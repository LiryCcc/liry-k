import { BTree } from '@yume-chan/b-tree';
import { useCallback, useMemo, useRef, useState } from 'react';

const IS_MAC = typeof globalThis !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(globalThis.navigator.platform);

export const isModKey = (e: { metaKey: boolean; ctrlKey: boolean }): boolean => {
  return IS_MAC ? e.metaKey : e.ctrlKey;
};

type Model = {
  selected: BTree;
  rangeStart: number;
  selectedIndex: number | null;
};

export const useListSelection = () => {
  const [, setToken] = useState(0);
  const bump = useCallback(() => {
    setToken((t) => t + 1);
  }, []);

  const modelRef = useRef<Model | null>(null);
  if (modelRef.current === null) {
    modelRef.current = {
      selected: new BTree(6),
      rangeStart: 0,
      selectedIndex: null
    };
  }

  const api = useMemo(() => {
    const get = () => modelRef.current!;

    return {
      get size() {
        return get().selected.size;
      },
      get selectedIndex() {
        return get().selectedIndex;
      },
      has: (index: number) => {
        return get().selected.has(index);
      },
      [Symbol.iterator]: () => get().selected[Symbol.iterator](),
      select: (index: number, ctrlKey: boolean, shiftKey: boolean) => {
        const m = get();
        const { selected } = m;
        if (shiftKey) {
          if (!ctrlKey) {
            selected.clear();
          }
          const start = Math.min(m.rangeStart, index);
          const end = Math.max(m.rangeStart, index);
          for (const i of Array.from({ length: end - start + 1 }, (_, k) => start + k)) {
            selected.add(i);
          }
          m.selectedIndex = index;
          bump();
          return;
        }

        if (ctrlKey) {
          if (selected.has(index)) {
            selected.delete(index);
            m.selectedIndex = null;
          } else {
            selected.add(index);
            m.selectedIndex = index;
          }
          m.rangeStart = index;
          bump();
          return;
        }

        selected.clear();
        selected.add(index);
        m.rangeStart = index;
        m.selectedIndex = index;
        bump();
      },
      clear: () => {
        const m = get();
        m.selected.clear();
        m.rangeStart = 0;
        m.selectedIndex = null;
        bump();
      }
    };
  }, [bump]);

  return api;
};
