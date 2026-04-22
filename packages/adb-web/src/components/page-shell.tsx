import styles from '@/components/page-shell.module.css';
import { mergeClasses } from '@fluentui/react-components';
import type { PropsWithChildren } from 'react';

export type PageShellProps = PropsWithChildren<{
  className?: string;
}>;

export const PageShell = (props: PageShellProps) => {
  return <div className={mergeClasses(styles.root, props.className)}>{props.children}</div>;
};
