export const NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS = 10_000;

export type NextrapBackdropBehavior = 'shake' | 'dismiss';

interface NextrapFeedbackDetail {
  title?: string;
  message?: string;
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export interface NextrapLoadingDetail extends NextrapFeedbackDetail {
  reference?: string | HTMLElement;
  onAbort?: () => void;
}

export interface NextrapProgressDetail extends NextrapFeedbackDetail {
  progress: number;
  mock?: boolean;
  mockDuration?: number;
  mockMessages?: string[];
  reference?: string | HTMLElement;
  onAbort?: () => void;
}

export interface NextrapSuccessDetail extends NextrapFeedbackDetail {
  autoClose?: boolean;
}

export interface NextrapFailDetail extends NextrapFeedbackDetail {
  details?: string;
  autoClose?: boolean;
}

export interface NextrapInfoDetail extends NextrapFeedbackDetail {
  onConfirm?: () => void;
}

export interface NextrapConfirmAction {
  label: string;
  callback?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface NextrapConfirmDetail extends NextrapFeedbackDetail {
  html?: string;
  actions?: NextrapConfirmAction[];
}

export interface FeedbackConfirmOptions {
  title?: string;
  message?: string;
  html?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: NextrapConfirmAction['variant'];
  cancelVariant?: NextrapConfirmAction['variant'];
}

export type FeedbackKind = 'loading' | 'progress' | 'success' | 'fail' | 'info' | 'confirm';
export type FeedbackDetail =
  | NextrapLoadingDetail
  | NextrapProgressDetail
  | NextrapSuccessDetail
  | NextrapFailDetail
  | NextrapInfoDetail
  | NextrapConfirmDetail;

export type NteFeedbackStatus = 'idle' | FeedbackKind;
