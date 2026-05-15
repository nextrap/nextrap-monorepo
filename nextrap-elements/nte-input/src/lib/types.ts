import type { NteInput } from '../components/nte-input/nte-input';

export interface InputOption {
  value: string;
  label: string;
  disabled?: boolean;
  html?: string;
}

export type InputOptionsType = InputOption[];

export interface NteInputPlugin {
  types: string[];
  getHtml?: (context: unknown) => unknown;
  init?: (element: NteInput) => void;
  shouldHoverlabelFloat?: (element: NteInput) => boolean;
}

export interface NteInputRenderContext {
  element: NteInput;
  type: string;
  controlId: string;
  validationId: string;
}
