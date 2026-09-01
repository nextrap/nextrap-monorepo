export const NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS = 10_000;
export const NTE_FEEDBACK_MOCK_PROGRESS_INTERVAL_MS = 100;

export type NextrapBackdropBehavior = 'shake' | 'dismiss';
export type NextrapFeedbackDetails = string | readonly unknown[];

interface NextrapFeedbackDetail {
  title?: string;
  message?: string;
  details?: NextrapFeedbackDetails;
  cancelable?: boolean;
  backdropBehavior?: NextrapBackdropBehavior;
}

export interface NextrapLoadingDetail extends NextrapFeedbackDetail {
  reference?: string | HTMLElement;
  onAbort?: () => void;
}

export interface NextrapDeterminateProgressDetail extends NextrapFeedbackDetail {
  mode?: 'determinate';
  progress: number;
  reference?: string | HTMLElement;
  onAbort?: () => void;
}

export interface NextrapMockProgressDetail extends NextrapFeedbackDetail {
  mode: 'mock';
  durationMs: number;
  reference?: string | HTMLElement;
  onAbort?: () => void;
}

export type NextrapProgressDetail = NextrapDeterminateProgressDetail | NextrapMockProgressDetail;

export interface NextrapSuccessDetail extends NextrapFeedbackDetail {
  autoClose?: boolean;
}

export interface NextrapFailDetail extends NextrapFeedbackDetail {
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
  details?: NextrapFeedbackDetails;
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
