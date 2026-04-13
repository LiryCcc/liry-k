import type { JSX } from 'solid-js';

import type { ButtonVariant } from '../types/button-variant.js';

/** Builds the inline style object for the current interaction and variant state. */
export const computeButtonStyle = (
  args: {
    variant: ButtonVariant;
    pressed: boolean;
    hovered: boolean;
    disabled: boolean;
    focusVisible: boolean;
    block: boolean;
  },
  userStyle?: JSX.CSSProperties
): JSX.CSSProperties => {
  const { variant, pressed, hovered, disabled, focusVisible, block } = args;

  // Shared chrome: flex layout, motion, and hit target sizing live in one object.
  const base: JSX.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    font: 'inherit',
    'font-weight': 500,
    'line-height': 1.25,
    'border-radius': '0.5rem',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    'user-select': 'none',
    overflow: 'hidden',
    transition:
      'transform 0.12s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
    '-webkit-tap-highlight-color': 'transparent',
    width: block ? '100%' : undefined,
    opacity: disabled ? 0.55 : 1,
    outline: focusVisible ? '2px solid #3b82f6' : 'none',
    'outline-offset': focusVisible ? '2px' : undefined,
    transform: pressed && !disabled ? 'scale(0.97)' : undefined
  };

  // Each variant carries a resting paint and a hover paint (inline, no :hover selector).
  const paints: Record<ButtonVariant, { rest: JSX.CSSProperties; hover: JSX.CSSProperties }> = {
    primary: {
      rest: {
        background: '#2563eb',
        color: '#fff',
        'box-shadow': '0 1px 2px rgba(15, 23, 42, 0.12)'
      },
      hover: { background: '#1d4ed8' }
    },
    secondary: {
      rest: {
        background: '#e5e7eb',
        color: '#111827',
        'border-color': '#d1d5db'
      },
      hover: { background: '#d1d5db' }
    },
    ghost: {
      rest: {
        background: 'transparent',
        color: 'inherit',
        'border-color': 'rgba(0, 0, 0, 0.18)'
      },
      hover: { background: 'rgba(0, 0, 0, 0.06)' }
    }
  };

  const chosen = paints[variant];
  const tone = hovered && !disabled ? { ...chosen.rest, ...chosen.hover } : chosen.rest;

  return { ...base, ...tone, ...(userStyle ?? {}) };
};
