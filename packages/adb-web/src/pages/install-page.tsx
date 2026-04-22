import { PageShell } from '@/components/page-shell';
import { globalAppStore, showGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import { createFileStream, pickFile } from '@/utils/file';
import { createProgressStream } from '@/utils/file-size';
import { Button, Checkbox, Field, ProgressBar, Text } from '@fluentui/react-components';
import { FolderOpenRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import { PackageManager, type PackageManagerInstallOptions } from '@yume-chan/android-bin';
import { WrapConsumableStream, WritableStream } from '@yume-chan/stream-extra';
import { useCallback, useEffect, useReducer } from 'react';

const Stage = {
  Uploading: 0,
  Installing: 1,
  Completed: 2
} as const;
type Stage = (typeof Stage)[keyof typeof Stage];

type Progress = {
  filename: string;
  stage: Stage;
  uploadedSize: number;
  totalSize: number;
  value: number | undefined;
};

type State = {
  installing: boolean;
  progress: Progress | undefined;
  log: string;
  options: Partial<PackageManagerInstallOptions>;
};

const initial: State = {
  installing: false,
  progress: undefined,
  log: '',
  options: {
    bypassLowTargetSdkBlock: false
  }
};

type Action =
  | { type: 'resetProgress' }
  | { type: 'startInstall'; filename: string; size: number }
  | { type: 'progress'; uploaded: number; total: number }
  | { type: 'installingPhase'; filename: string; uploaded: number; total: number }
  | { type: 'done'; filename: string; total: number; log: string; elapsed: number; rate: string }
  | { type: 'setOption'; key: 'bypassLowTargetSdkBlock'; value: boolean }
  | { type: 'finishError' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setOption':
      return {
        ...state,
        options: { ...state.options, [action.key]: action.value }
      };
    case 'startInstall':
      return {
        ...state,
        installing: true,
        log: '',
        progress: {
          filename: action.filename,
          stage: Stage.Uploading,
          uploadedSize: 0,
          totalSize: action.size,
          value: 0
        }
      };
    case 'progress': {
      const { uploaded, total } = action;
      const filename = state.progress?.filename ?? '';
      return {
        ...state,
        progress:
          uploaded !== total
            ? {
                filename,
                stage: Stage.Uploading,
                uploadedSize: uploaded,
                totalSize: total,
                value: (uploaded / total) * 0.8
              }
            : {
                filename,
                stage: Stage.Installing,
                uploadedSize: uploaded,
                totalSize: total,
                value: 0.8
              }
      };
    }
    case 'installingPhase':
      return {
        ...state,
        progress: {
          filename: action.filename,
          stage: Stage.Installing,
          uploadedSize: action.uploaded,
          totalSize: action.total,
          value: 0.8
        }
      };
    case 'done':
      return {
        ...state,
        installing: false,
        log: action.log,
        progress: {
          filename: action.filename,
          stage: Stage.Completed,
          uploadedSize: action.total,
          totalSize: action.total,
          value: 1
        }
      };
    case 'finishError':
      return { ...state, installing: false };
    default:
      return state;
  }
};

export const InstallPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    document.title = strings.install.documentTitle;
  }, []);

  const install = useCallback(async () => {
    const file = await pickFile({ accept: '.apk' });
    if (!file || file instanceof FileList) {
      return;
    }
    const adbInst = globalAppStore.state.adb;
    if (!adbInst) {
      return;
    }

    dispatch({ type: 'startInstall', filename: file.name, size: file.size });

    const pm = new PackageManager(adbInst);
    const start = Date.now();
    try {
      const installOptions = state.options;
      const logStream = await pm.installStream(
        file.size,
        createFileStream(file)
          .pipeThrough(new WrapConsumableStream())
          .pipeThrough(
            createProgressStream((uploaded) => {
              dispatch({ type: 'progress', uploaded, total: file.size });
            })
          ),
        installOptions
      );

      const logPieces: string[] = [];
      await logStream.pipeTo(
        new WritableStream({
          write: (chunk) => {
            logPieces.push(chunk);
          }
        })
      );

      const elapsed = Date.now() - start;
      const transferRate = (file.size / (elapsed / 1000) / 1024 / 1024).toFixed(2);
      const logText = logPieces.join('') + `\n安装耗时 ${elapsed} ms，约 ${transferRate} MB/s`;

      dispatch({
        type: 'done',
        filename: file.name,
        total: file.size,
        log: logText,
        elapsed,
        rate: transferRate
      });
    } catch (e) {
      showGlobalError(e instanceof Error ? e : String(e));
      dispatch({ type: 'finishError' });
    }
  }, [state.options]);

  const stageLabel =
    state.progress === undefined
      ? ''
      : state.progress.stage === Stage.Uploading
        ? strings.install.stageUploading
        : state.progress.stage === Stage.Installing
          ? strings.install.stageInstalling
          : strings.install.stageDone;

  return (
    <PageShell>
      <Field label={strings.install.bypassLowTarget}>
        <Checkbox
          checked={!!state.options.bypassLowTargetSdkBlock}
          onChange={(_, data) => {
            dispatch({ type: 'setOption', key: 'bypassLowTargetSdkBlock', value: !!data.checked });
          }}
        />
      </Field>

      <Button
        appearance='primary'
        icon={<FolderOpenRegular />}
        disabled={!adb || state.installing}
        onClick={() => void install()}
      >
        {strings.install.browse}
      </Button>

      {state.progress ? (
        <div style={{ maxWidth: 360 }}>
          <Text>{state.progress.filename}</Text>
          <ProgressBar value={state.progress.value} max={1} />
          <Text>{stageLabel}</Text>
        </div>
      ) : null}

      {state.log ? <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{state.log}</pre> : null}
    </PageShell>
  );
};
