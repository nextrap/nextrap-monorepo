import type { NteInput } from '../components/nte-input/nte-input';

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
  controlId: string;
  validationId: string;
}
