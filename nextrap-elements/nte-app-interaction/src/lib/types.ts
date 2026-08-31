export const NTE_APP_INTERACTION_DEFAULT_AUTO_CLOSE_MS = 10_000;

export type NextrapBackdropBehavior = 'shake' | 'dismiss';

export interface NextrapLoadingDetail {
  title?: string;
  message?: string;
  reference?: string | HTMLElement;
  onAbort?: () => void;
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export interface NextrapProgressDetail {
  title?: string;
  progress: number;
  message?: string;
  reference?: string | HTMLElement;
  onAbort?: () => void;
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export interface NextrapSuccessDetail {
  title?: string;
  message?: string;
  autoClose?: boolean;
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export interface NextrapFailDetail {
  title?: string;
  message?: string;
  details?: string;
  autoClose?: boolean;
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export interface NextrapInfoDetail {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export interface NextrapConfirmAction {
  label: string;
  callback?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface NextrapConfirmDetail {
  title?: string;
  message?: string;
  html?: string;
  actions?: NextrapConfirmAction[];
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export type NteAppInteractionStatus = 'idle' | 'loading' | 'progress' | 'success' | 'fail' | 'info' | 'confirm';
