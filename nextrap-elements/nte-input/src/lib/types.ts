import type { NteInput } from '../components/nte-input/nte-input';

export const NTE_INPUT_CONTROL_ID = 'main-control';
export const NTE_INPUT_VALIDATION_ID = 'validation-content';

export interface InputOption {
  value: string;
  label: string;
  disabled?: boolean;
  html?: string;
}

export type InputOptionsType = InputOption[];
export type NteInputValue = string | boolean | string[] | null | undefined;

export interface NteInputRenderContext {
  element: NteInput;
  type: string;
}
