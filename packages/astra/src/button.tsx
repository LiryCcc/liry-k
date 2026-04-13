import { For, createSignal, mergeProps, splitProps, type ComponentProps, type JSX } from 'solid-js';

import type { ButtonVariant } from './types/button-variant.js';
import { cn, computeButtonStyle, createRippleKey, tryCallEventHandler } from './utils/index.js';

/** Re-export variant type alongside the component for ergonomic single-file imports. */
export type { ButtonVariant } from './types/button-variant.js';

/** Public props: native `button` attributes plus Astra-specific options. */
export type ButtonProps = ComponentProps<'button'> & {
  /** Preset look; defaults to `secondary` so it stays neutral in layouts. */
  variant?: ButtonVariant;
  /** Shows a spinner, sets `aria-busy`, and disables interaction. */
  loading?: boolean;
  /** Makes the control stretch to the full width of its container. */
  block?: boolean;
};

/** One ripple instance; `key` is only used for list diffing and removal. */
type RippleItem = { key: string; x: number; y: number };

/**
 * Expanding circle driven by the Web Animations API so we avoid @keyframes in the document.
 * Runs entirely through inline geometry plus a local animation handle.
 */
const RippleDisk = (props: { x: number; y: number; onComplete: () => void }) => {
  return (
    <span
      aria-hidden='true'
      style={{
        position: 'absolute',
        left: `${props.x}px`,
        top: `${props.y}px`,
        width: '10px',
        height: '10px',
        'border-radius': '50%',
        'pointer-events': 'none',
        background: 'rgba(128, 128, 128, 0.35)',
        'transform-origin': 'center'
      }}
      ref={(el) => {
        // Defer until the node is fully attached so element.animate has a valid target.
        queueMicrotask(() => {
          if (typeof el.animate === 'function') {
            const handle = el.animate(
              [
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.45 },
                { transform: 'translate(-50%, -50%) scale(24)', opacity: 0 }
              ],
              { duration: 550, easing: 'ease-out', fill: 'forwards' }
            );
            handle.onfinish = () => props.onComplete();
            return;
          }
          // Environments without element.animate still clear the ripple after the same duration.
          globalThis.setTimeout(() => props.onComplete(), 550);
        });
      }}
    />
  );
};

/** Lightweight loading glyph using SVG animation only (no shared stylesheet). */
const ButtonSpinner = () => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 24 24' aria-hidden='true' style={{ 'flex-shrink': 0 }}>
      <circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2' fill='none' opacity={0.2} />
      <path d='M12 2 A10 10 0 0 1 22 12' stroke='currentColor' stroke-width='2' fill='none' stroke-linecap='round'>
        <animateTransform
          attributeName='transform'
          type='rotate'
          from='0 12 12'
          to='360 12 12'
          dur='0.55s'
          repeatCount='indefinite'
        />
      </path>
    </svg>
  );
};

/**
 * Solid button with variants, loading state, press feedback, and ripples.
 * Styling is CSS-in-JS (inline objects + Web Animations API / SVG), no document-level stylesheet.
 */
export const Button = (inputProps: ButtonProps) => {
  const props = mergeProps({ variant: 'secondary' as ButtonVariant, type: 'button' as const }, inputProps);
  const [local, rest] = splitProps(props, [
    'variant',
    'loading',
    'block',
    'class',
    'style',
    'onPointerDown',
    'onPointerUp',
    'onPointerCancel',
    'onPointerLeave',
    'onMouseEnter',
    'onMouseLeave',
    'onFocus',
    'onBlur'
  ]);
  const [pressed, setPressed] = createSignal(false);
  const [hovered, setHovered] = createSignal(false);
  const [focusVisible, setFocusVisible] = createSignal(false);
  const [ripples, setRipples] = createSignal<RippleItem[]>([]);

  /** Pointer down: forward listener, then press + ripple when allowed. */
  const onPointerDown: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
    tryCallEventHandler(local.onPointerDown, e);
    if (e.defaultPrevented) {
      return;
    }
    if (rest.disabled || local.loading) {
      return;
    }
    setPressed(true);
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const key = createRippleKey();
    setRipples((list) => [...list, { key, x, y }]);
  };

  const onPointerUp: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
    tryCallEventHandler(local.onPointerUp, e);
    setPressed(false);
  };

  const onPointerCancel: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
    tryCallEventHandler(local.onPointerCancel, e);
    setPressed(false);
  };

  const onPointerLeave: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
    tryCallEventHandler(local.onPointerLeave, e);
    setPressed(false);
  };

  const onMouseEnter: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    tryCallEventHandler(local.onMouseEnter, e);
    setHovered(true);
  };

  const onMouseLeave: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    tryCallEventHandler(local.onMouseLeave, e);
    setHovered(false);
  };

  /** Prefer showing a focus ring only for keyboard-style focus. */
  const onFocus: JSX.EventHandler<HTMLButtonElement, FocusEvent> = (e) => {
    tryCallEventHandler(local.onFocus, e);
    const target = e.currentTarget;
    queueMicrotask(() => {
      if (target.matches(':focus-visible')) {
        setFocusVisible(true);
      }
    });
  };

  const onBlur: JSX.EventHandler<HTMLButtonElement, FocusEvent> = (e) => {
    tryCallEventHandler(local.onBlur, e);
    setFocusVisible(false);
  };

  const disabled = () => !!rest.disabled || !!local.loading;

  // `style` on native buttons may be a string; we only deep-merge plain objects.
  const userStyleOverride = local.style !== undefined && typeof local.style === 'object' ? local.style : undefined;

  return (
    <button
      {...rest}
      {...(local.loading ? ({ 'aria-busy': true } as const) : {})}
      disabled={disabled()}
      class={cn(local.class)}
      style={computeButtonStyle(
        {
          variant: local.variant,
          pressed: pressed(),
          hovered: hovered(),
          disabled: disabled(),
          focusVisible: focusVisible(),
          block: !!local.block
        },
        userStyleOverride
      )}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerLeave}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <For each={ripples()}>
        {(r) => (
          <RippleDisk
            x={r.x}
            y={r.y}
            onComplete={() => setRipples((list) => list.filter((item) => item.key !== r.key))}
          />
        )}
      </For>
      {local.loading ? (
        <>
          <ButtonSpinner />
          <span style={{ opacity: 0.88 }}>{rest.children}</span>
        </>
      ) : (
        rest.children
      )}
    </button>
  );
};
