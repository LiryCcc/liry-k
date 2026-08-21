import type { SquareStatus } from '@/constant.js';
import type { Component } from 'solid-js';
import s from './index.module.css';

type SquareProps = {
  // default none
  status?: SquareStatus;
  x: number;
  y: number;
};

export const Square: Component<SquareProps> = () => {
  return <div class={s['square']}></div>;
};
