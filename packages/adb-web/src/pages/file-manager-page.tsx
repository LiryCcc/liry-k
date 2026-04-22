import { PageShell } from '@/components/page-shell';
import styles from '@/pages/file-manager-page.module.css';
import { globalAppStore, showGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import { asyncEffect } from '@/utils/async-effect';
import { createFileStream, pickFile, saveFile } from '@/utils/file';
import { createProgressStream, formatSize, formatSpeed } from '@/utils/file-size';
import { posixBasename, posixExtname, posixResolve } from '@/utils/posix-path';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  ProgressBar,
  Text
} from '@fluentui/react-components';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { AdbFeature, AdbSync, LinuxFileType, type AdbSyncEntry } from '@yume-chan/adb';
import { WrapConsumableStream, WritableStream } from '@yume-chan/stream-extra';
import { EMPTY_UINT8_ARRAY } from '@yume-chan/struct';
import { Zip, ZipPassThrough } from 'fflate';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

type ListItem = AdbSyncEntry & { key: string };

const toListItem = (item: AdbSyncEntry): ListItem => {
  const row = item as ListItem;
  row.key = item.name ?? '';
  return row;
};

const compareCaseInsensitively = (a: string, b: string) => {
  const primary = a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
  if (primary !== 0) {
    return primary;
  }
  return a.localeCompare(b);
};

type FileManagerModel = {
  path: string;
  loading: boolean;
  items: ListItem[];
  sortKey: keyof ListItem;
  sortDescending: boolean;
  selectedKeys: Set<string>;
  uploading: boolean;
  uploadPath: string | undefined;
  uploadedSize: number;
  uploadTotalSize: number;
  debouncedUploadedSize: number;
  uploadSpeed: number;
};

const createFileManagerController = (notify: () => void) => {
  const st: FileManagerModel = {
    path: '/',
    loading: false,
    items: [],
    sortKey: 'name',
    sortDescending: false,
    selectedKeys: new Set(),
    uploading: false,
    uploadPath: undefined,
    uploadedSize: 0,
    uploadTotalSize: 0,
    debouncedUploadedSize: 0,
    uploadSpeed: 0
  };

  const bump = () => {
    notify();
  };

  const getSortedList = (): ListItem[] => {
    const list = st.items.slice();
    list.sort((a, b) => {
      const aIsFile = a.type === LinuxFileType.File ? 1 : 0;
      const bIsFile = b.type === LinuxFileType.File ? 1 : 0;
      const aSortKey = a[st.sortKey];
      const bSortKey = b[st.sortKey];
      const result: number =
        aIsFile !== bIsFile
          ? aIsFile - bIsFile
          : aSortKey === bSortKey
            ? compareCaseInsensitively(a.name ?? '', b.name ?? '')
            : typeof aSortKey === 'string' && typeof bSortKey === 'string'
              ? compareCaseInsensitively(aSortKey, bSortKey)
              : typeof aSortKey === 'bigint' && typeof bSortKey === 'bigint'
                ? aSortKey < bSortKey
                  ? -1
                  : aSortKey > bSortKey
                    ? 1
                    : 0
                : (aSortKey as number) < (bSortKey as number)
                  ? -1
                  : 1;
      return st.sortDescending ? -result : result;
    });
    return list;
  };

  const getSelectedItems = (): ListItem[] => getSortedList().filter((i) => st.selectedKeys.has(i.key));

  const getFileStream = (sync: AdbSync, basePath: string, name: string) => sync.read(posixResolve(basePath, name));

  const addFile = async (sync: AdbSync, zip: Zip, basePath: string, name: string) => {
    const zipEntry = new ZipPassThrough(name);
    zip.add(zipEntry);
    await getFileStream(sync, basePath, name).pipeTo(
      new WritableStream({
        write: (chunk) => {
          zipEntry.push(chunk);
        },
        close: () => {
          zipEntry.push(EMPTY_UINT8_ARRAY, true);
        }
      })
    );
  };

  const addDirectory = async (sync: AdbSync, zip: Zip, basePath: string, relativePath: string) => {
    if (relativePath !== '.') {
      const dirEntry = new ZipPassThrough(`${relativePath}/`);
      zip.add(dirEntry);
      dirEntry.push(EMPTY_UINT8_ARRAY, true);
    }

    for (const entry of await sync.readdir(posixResolve(basePath, relativePath))) {
      if (entry.name === '.' || entry.name === '..') {
        continue;
      }
      switch (entry.type) {
        case LinuxFileType.Directory:
          await addDirectory(sync, zip, basePath, posixResolve(relativePath, entry.name!));
          break;
        case LinuxFileType.File:
          await addFile(sync, zip, basePath, posixResolve(relativePath, entry.name!));
          break;
        default:
          break;
      }
    }
  };

  const loadFiles = asyncEffect(async (signal) => {
    const currentPath = st.path;
    st.items = [];
    st.loading = true;
    bump();

    const adb = globalAppStore.state.adb;
    if (!adb) {
      st.loading = false;
      bump();
      return;
    }

    const sync = await adb.sync();
    const items: ListItem[] = [];
    const linkItems: AdbSyncEntry[] = [];
    const intervalId = globalThis.setInterval(() => {
      if (!signal.aborted) {
        st.items = items.slice();
        bump();
      }
    }, 1000);

    try {
      for await (const entry of sync.opendir(currentPath)) {
        if (signal.aborted) {
          return;
        }
        if (entry.name === '.' || entry.name === '..') {
          continue;
        }
        if (entry.type === LinuxFileType.Link) {
          linkItems.push(entry);
        } else {
          items.push(toListItem(entry));
        }
      }

      for (const entry of linkItems) {
        if (signal.aborted) {
          return;
        }
        if (!(await sync.isDirectory(posixResolve(currentPath, entry.name!)))) {
          entry.mode = (LinuxFileType.File << 12) | entry.permission;
          entry.size = 0n;
        }
        items.push(toListItem(entry));
      }

      if (!signal.aborted) {
        st.items = items;
      }
    } finally {
      if (!signal.aborted) {
        st.loading = false;
      }
      globalThis.clearInterval(intervalId);
      sync.dispose();
      bump();
    }
  });

  const download = async () => {
    const adb = globalAppStore.state.adb;
    const selected = getSelectedItems();
    if (!adb || selected.length === 0) {
      return;
    }
    const sync = await adb.sync();
    try {
      if (selected.length === 1) {
        const item = selected[0]!;
        switch (item.type) {
          case LinuxFileType.Directory: {
            const stream = saveFile(`${item.name}.zip`);
            const writer = stream.getWriter();
            const zip = new Zip((err, data, final) => {
              if (err) {
                return;
              }
              writer.write(data);
              if (final) {
                void writer.close();
              }
            });
            await addDirectory(sync, zip, posixResolve(st.path, item.name!), '.');
            zip.end();
            break;
          }
          case LinuxFileType.File:
            await getFileStream(sync, st.path, item.name!).pipeTo(saveFile(item.name!, Number(item.size)));
            break;
          default:
            break;
        }
        return;
      }

      const stream = saveFile(`${posixBasename(st.path)}.zip`);
      const writer = stream.getWriter();
      const zip = new Zip((err, data, final) => {
        if (err) {
          return;
        }
        writer.write(data);
        if (final) {
          void writer.close();
        }
      });
      for (const item of selected) {
        switch (item.type) {
          case LinuxFileType.Directory:
            await addDirectory(sync, zip, st.path, item.name!);
            break;
          case LinuxFileType.File:
            await addFile(sync, zip, st.path, item.name!);
            break;
          default:
            break;
        }
      }
      zip.end();
    } catch (e) {
      showGlobalError(e instanceof Error ? e : String(e));
    } finally {
      sync.dispose();
    }
  };

  const deleteSelection = async () => {
    const adb = globalAppStore.state.adb;
    if (!adb) {
      return;
    }
    try {
      for (const item of getSelectedItems()) {
        const output = await adb.rm(posixResolve(st.path, item.name!));
        if (output) {
          showGlobalError(output);
          return;
        }
      }
    } catch (e) {
      showGlobalError(e instanceof Error ? e : String(e));
    } finally {
      void loadFiles();
    }
  };

  const uploadOne = async (file: File) => {
    const adb = globalAppStore.state.adb;
    if (!adb) {
      return;
    }
    const sync = await adb.sync();
    try {
      const itemPath = posixResolve(st.path, file.name);
      st.uploading = true;
      st.uploadPath = file.name;
      st.uploadedSize = 0;
      st.uploadTotalSize = file.size;
      st.debouncedUploadedSize = 0;
      st.uploadSpeed = 0;
      bump();

      const intervalId = globalThis.setInterval(() => {
        st.uploadSpeed = st.uploadedSize - st.debouncedUploadedSize;
        st.debouncedUploadedSize = st.uploadedSize;
        bump();
      }, 1000);

      try {
        const start = Date.now();
        await sync.write({
          filename: itemPath,
          file: createFileStream(file)
            .pipeThrough(new WrapConsumableStream())
            .pipeThrough(
              createProgressStream((uploaded) => {
                st.uploadedSize = uploaded;
                bump();
              })
            ),
          type: LinuxFileType.File,
          permission: 0o666,
          mtime: file.lastModified / 1000
        });
        console.log('Upload speed:', (((file.size / (Date.now() - start)) * 1000) / 1024 / 1024).toFixed(2), 'MB/s');
        st.uploadSpeed = st.uploadedSize - st.debouncedUploadedSize;
        st.debouncedUploadedSize = st.uploadedSize;
        bump();
      } finally {
        globalThis.clearInterval(intervalId);
      }
    } catch (e) {
      showGlobalError(e instanceof Error ? e : String(e));
    } finally {
      sync.dispose();
      void loadFiles();
      st.uploading = false;
      bump();
    }
  };

  const uploadFiles = async () => {
    const adb = globalAppStore.state.adb;
    if (!adb) {
      return;
    }
    const files = await pickFile({ multiple: true });
    if (!files || !(files instanceof FileList)) {
      return;
    }
    for (const file of Array.from(files)) {
      await uploadOne(file);
    }
  };

  const toggleSort = (key: keyof ListItem) => {
    if (st.sortKey === key) {
      st.sortDescending = !st.sortDescending;
    } else {
      st.sortKey = key;
      st.sortDescending = false;
    }
    bump();
  };

  const setSelection = (keys: Set<string>) => {
    st.selectedKeys = keys;
    bump();
  };

  const toggleRow = (key: string, mod: boolean) => {
    if (mod) {
      const next = new Set(st.selectedKeys);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      setSelection(next);
    } else {
      setSelection(new Set([key]));
    }
  };

  const breadcrumbs = (navigate: (path: string) => void) => {
    const segments = st.path.split('/').filter(Boolean);
    const { items } = segments.reduce<{
      acc: string;
      items: { key: string; text: string; current?: boolean }[];
    }>(
      (state, seg) => {
        const nextAcc = posixResolve(state.acc === '' ? '/' : state.acc, seg);
        return {
          acc: nextAcc,
          items: [...state.items, { key: nextAcc, text: seg }]
        };
      },
      { acc: '', items: [{ key: '/', text: strings.fileManager.rootCrumb }] }
    );
    if (items.length) {
      items[items.length - 1] = { ...items[items.length - 1]!, current: true };
    }
    return (
      <Breadcrumb className={styles.crumb}>
        {items.map((it, i) => (
          <span key={it.key} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 ? <BreadcrumbDivider /> : null}
            <BreadcrumbItem>
              {it.current ? (
                <Text>{it.text}</Text>
              ) : (
                <BreadcrumbButton onClick={() => navigate(it.key)}>{it.text}</BreadcrumbButton>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </Breadcrumb>
    );
  };

  const pushPath = (next: string, navigate: (opts: { search: { path: string } }) => void) => {
    navigate({ search: { path: next } });
  };

  const changeDirectory = (next: string, adb: (typeof globalAppStore)['state']['adb']) => {
    st.path = next;
    st.selectedKeys = new Set();
    if (!adb) {
      st.items = [];
      st.loading = false;
      bump();
      return;
    }
    void loadFiles();
  };

  const openEntry = (
    item: ListItem,
    navigate: (opts: { search: { path: string } }) => void,
    preview: (fullPath: string) => void
  ) => {
    switch (item.type) {
      case LinuxFileType.Link:
      case LinuxFileType.Directory:
        pushPath(posixResolve(st.path, item.name!), navigate);
        break;
      case LinuxFileType.File: {
        const ext = posixExtname(item.name!).toLowerCase();
        if (ext === '.jpg' || ext === '.png' || ext === '.svg' || ext === '.gif') {
          preview(posixResolve(st.path, item.name!));
        }
        break;
      }
      default:
        break;
    }
  };

  return {
    get path() {
      return st.path;
    },
    get loading() {
      return st.loading;
    },
    get items() {
      return st.items;
    },
    get selectedKeys() {
      return st.selectedKeys;
    },
    get sortedList() {
      return getSortedList();
    },
    get selectedItems() {
      return getSelectedItems();
    },
    get uploading() {
      return st.uploading;
    },
    get uploadPath() {
      return st.uploadPath;
    },
    get uploadedSize() {
      return st.uploadedSize;
    },
    get uploadTotalSize() {
      return st.uploadTotalSize;
    },
    get debouncedUploadedSize() {
      return st.debouncedUploadedSize;
    },
    get uploadSpeed() {
      return st.uploadSpeed;
    },
    toggleSort,
    setSelection,
    toggleRow,
    breadcrumbs,
    pushPath,
    changeDirectory,
    loadFiles,
    download,
    deleteSelection,
    uploadFiles,
    openEntry
  };
};

export const FileManagerPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);
  const search = useSearch({ from: '/file-manager' }) as { path: string };
  const navigate = useNavigate({ from: '/file-manager' });
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const ctl = useRef<ReturnType<typeof createFileManagerController> | null>(null);
  if (ctl.current === null) {
    ctl.current = createFileManagerController(() => bump());
  }
  const c = ctl.current;

  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  useEffect(() => {
    document.title = strings.fileManager.documentTitle;
  }, []);

  useEffect(() => {
    const path = search.path ?? '/';
    c.changeDirectory(path, adb);
  }, [search.path, adb, c]);

  const navigatePath = useCallback(
    (path: string) => {
      void navigate({ search: { path } });
    },
    [navigate]
  );

  const previewImage = useCallback(async (fullPath: string) => {
    const adbInst = globalAppStore.state.adb;
    if (!adbInst) {
      return;
    }
    const sync = await adbInst.sync();
    try {
      const readable = sync.read(fullPath);
      const response = new Response(readable as unknown as BodyInit);
      const blob = await response.blob();
      const url = globalThis.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } finally {
      sync.dispose();
    }
  }, []);

  const listV2 = !!adb?.supportsFeature(AdbFeature.ListV2);

  return (
    <PageShell className={styles.page}>
      <div className={styles.toolbar}>
        <Button
          onClick={() => {
            void c.uploadFiles();
          }}
          disabled={!adb}
        >
          {strings.fileManager.upload}
        </Button>
        <Button
          onClick={() => {
            void c.download();
          }}
          disabled={!adb || c.selectedItems.length === 0}
        >
          {strings.fileManager.download}
        </Button>
        <Button
          onClick={() => {
            void c.deleteSelection();
          }}
          disabled={!adb || c.selectedItems.length === 0}
        >
          {strings.fileManager.delete}
        </Button>
      </div>

      {c.breadcrumbs(navigatePath)}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th aria-hidden />
              <th>
                <button type='button' onClick={() => c.toggleSort('name')}>
                  {strings.fileManager.colName}
                </button>
              </th>
              <th>
                <button type='button' onClick={() => c.toggleSort('mode')}>
                  {strings.fileManager.colPerm}
                </button>
              </th>
              <th>
                <button type='button' onClick={() => c.toggleSort('size')}>
                  {strings.fileManager.colSize}
                </button>
              </th>
              <th>
                <button type='button' onClick={() => c.toggleSort('mtime')}>
                  {strings.fileManager.colMtime}
                </button>
              </th>
              {listV2 ? (
                <>
                  <th>{strings.fileManager.colCtime}</th>
                  <th>{strings.fileManager.colAtime}</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {c.loading && c.items.length === 0 ? (
              <tr>
                <td colSpan={listV2 ? 7 : 5}>
                  <Text>{strings.fileManager.loading}</Text>
                </td>
              </tr>
            ) : null}
            {c.sortedList.map((item) => (
              <tr
                key={item.key}
                className={c.selectedKeys.has(item.key) ? styles.rowSelected : undefined}
                onClick={(e) => {
                  c.toggleRow(item.key, e.metaKey || e.ctrlKey);
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  c.openEntry(item, navigate, previewImage);
                }}
              >
                <td>
                  {item.type === LinuxFileType.Directory || item.type === LinuxFileType.Link
                    ? strings.fileManager.kindDir
                    : strings.fileManager.kindFile}
                </td>
                <td className={styles.nameCell}>{item.name}</td>
                <td>
                  {`${(((item.mode >> 6) & 0b100) >>> 0).toString(8)}${(((item.mode >> 3) & 0b100) >>> 0).toString(8)}${((item.mode & 0b100) >>> 0).toString(8)}`}
                </td>
                <td>{item.type === LinuxFileType.File ? formatSize(Number(item.size)) : ''}</td>
                <td>{new Date(Number(item.mtime) * 1000).toLocaleString()}</td>
                {listV2 ? (
                  <>
                    <td>{item.ctime !== undefined ? new Date(Number(item.ctime) * 1000).toLocaleString() : ''}</td>
                    <td>{item.atime !== undefined ? new Date(Number(item.atime) * 1000).toLocaleString() : ''}</td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewUrl ? (
        <button
          type='button'
          className={styles.overlay}
          onClick={() => {
            globalThis.URL.revokeObjectURL(previewUrl);
            setPreviewUrl(undefined);
          }}
        >
          <img src={previewUrl} alt={strings.fileManager.previewImageAlt} />
        </button>
      ) : null}

      <Dialog open={c.uploading}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{strings.fileManager.uploadingTitle}</DialogTitle>
            <DialogContent>
              <Text>{c.uploadPath}</Text>
              <ProgressBar value={c.uploadTotalSize ? c.uploadedSize / c.uploadTotalSize : 0} max={1} />
              <Text>{formatSpeed(c.debouncedUploadedSize, c.uploadTotalSize, c.uploadSpeed) ?? ''}</Text>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </PageShell>
  );
};
