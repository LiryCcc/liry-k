import type { MdFilledButton } from '@material/web/button/filled-button.js';
import type { MdFilledTonalButton } from '@material/web/button/filled-tonal-button.js';
import type { MdOutlinedButton } from '@material/web/button/outlined-button.js';
import type { MdOutlinedCard } from '@material/web/labs/card/outlined-card.js';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import type { JSX } from 'solid-js';

/**
 * Solid JSX props for a Material Web custom element: DOM / event attrs are
 * typed against the real element class, plus a curated set of Lit properties.
 */
type MaterialElementProps<T extends HTMLElement, Prop extends keyof T> = JSX.HTMLAttributes<T> & Partial<Pick<T, Prop>>;

type MdButtonProp =
  'disabled' | 'download' | 'hasIcon' | 'href' | 'name' | 'softDisabled' | 'target' | 'trailingIcon' | 'type' | 'value';

type MdTextFieldProp =
  | 'cols'
  | 'disabled'
  | 'error'
  | 'errorText'
  | 'hasLeadingIcon'
  | 'hasTrailingIcon'
  | 'inputMode'
  | 'label'
  | 'max'
  | 'maxLength'
  | 'min'
  | 'minLength'
  | 'multiple'
  | 'name'
  | 'noAsterisk'
  | 'noSpinner'
  | 'pattern'
  | 'placeholder'
  | 'prefixText'
  | 'readOnly'
  | 'required'
  | 'rows'
  | 'suffixText'
  | 'supportingText'
  | 'textDirection'
  | 'type'
  | 'value';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'md-filled-button': MaterialElementProps<MdFilledButton, MdButtonProp>;
      'md-filled-tonal-button': MaterialElementProps<MdFilledTonalButton, MdButtonProp>;
      'md-outlined-button': MaterialElementProps<MdOutlinedButton, MdButtonProp>;
      'md-outlined-text-field': MaterialElementProps<MdOutlinedTextField, MdTextFieldProp>;
      'md-outlined-card': JSX.HTMLAttributes<MdOutlinedCard>;
    }
  }
}

export {};
