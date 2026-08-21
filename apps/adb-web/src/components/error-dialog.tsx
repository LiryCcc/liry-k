import { globalAppStore, hideGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle
} from '@fluentui/react-components';
import { useStore } from '@tanstack/react-store';
import type { PropsWithChildren } from 'react';

export const ErrorDialogProvider = (props: PropsWithChildren) => {
  const open = useStore(globalAppStore, (s) => s.errorDialogVisible);
  const message = useStore(globalAppStore, (s) => s.errorDialogMessage);

  return (
    <>
      {props.children}
      <Dialog
        open={open}
        onOpenChange={(_, data) => {
          if (!data.open) {
            hideGlobalError();
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{strings.errorTitle}</DialogTitle>
            <DialogContent>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message}</pre>
            </DialogContent>
            <DialogActions>
              <Button appearance='primary' onClick={hideGlobalError}>
                {strings.errorOk}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
