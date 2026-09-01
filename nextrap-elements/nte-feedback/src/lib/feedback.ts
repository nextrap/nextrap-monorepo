import type {
  FeedbackConfirmOptions,
  FeedbackDetail,
  FeedbackKind,
  NextrapFailDetail,
  NextrapInfoDetail,
  NextrapLoadingDetail,
  NextrapProgressDetail,
  NextrapSuccessDetail,
} from './types';

const CLOSED_EVENT = 'nextrap:feedback-closed';
const CLOSE_EVENT = 'nextrap:feedback-close';

const withMessage = <T extends { message?: string }>(input: string | T): T =>
  typeof input === 'string' ? ({ message: input } as T) : input;

export class Feedback {
  static open(kind: FeedbackKind, detail: FeedbackDetail): Promise<void> {
    Feedback.close();

    return new Promise((resolve) => {
      window.addEventListener(CLOSED_EVENT, () => resolve(), { once: true });
      window.dispatchEvent(new CustomEvent(`nextrap:${kind}`, { detail }));
    });
  }

  static close(): void {
    window.dispatchEvent(new CustomEvent(CLOSE_EVENT));
  }

  static loading(input: string | NextrapLoadingDetail = {}): Promise<void> {
    return Feedback.open('loading', withMessage(input));
  }

  static progress(detail: NextrapProgressDetail): Promise<void>;
  static progress(progress: number, detail?: Omit<NextrapProgressDetail, 'progress'>): Promise<void>;
  static progress(
    progressOrDetail: number | NextrapProgressDetail,
    detail: Omit<NextrapProgressDetail, 'progress'> = {},
  ): Promise<void> {
    const progressDetail =
      typeof progressOrDetail === 'number' ? { ...detail, progress: progressOrDetail } : progressOrDetail;
    return Feedback.open('progress', progressDetail);
  }

  static success(input: string | NextrapSuccessDetail = {}): Promise<void> {
    return Feedback.open('success', withMessage(input));
  }

  static error(input: string | NextrapFailDetail = {}): Promise<void> {
    return Feedback.open('fail', withMessage(input));
  }

  static fail(input: string | NextrapFailDetail = {}): Promise<void> {
    return Feedback.error(input);
  }

  static info(input: string | NextrapInfoDetail = {}): Promise<void> {
    return Feedback.open('info', withMessage(input));
  }

  static alert(input: string | Omit<NextrapInfoDetail, 'onConfirm'>): Promise<void> {
    Feedback.close();
    const detail = withMessage(input);

    return new Promise((resolve) => {
      window.addEventListener(CLOSED_EVENT, () => resolve(), { once: true });
      window.dispatchEvent(
        new CustomEvent('nextrap:info', {
          detail: {
            ...detail,
            cancelable: false,
            onConfirm: () => undefined,
          } satisfies NextrapInfoDetail,
        }),
      );
    });
  }

  static confirm(input: string | FeedbackConfirmOptions): Promise<boolean> {
    Feedback.close();
    const options = typeof input === 'string' ? { message: input } : input;
    let confirmed = false;

    return new Promise((resolve) => {
      window.addEventListener(CLOSED_EVENT, () => resolve(confirmed), { once: true });
      window.dispatchEvent(
        new CustomEvent('nextrap:confirm', {
          detail: {
            title: options.title,
            message: options.message,
            html: options.html,
            cancelable: false,
            actions: [
              {
                label: options.confirmLabel ?? 'OK',
                variant: options.confirmVariant ?? 'primary',
                callback: () => {
                  confirmed = true;
                },
              },
              {
                label: options.cancelLabel ?? 'Abbrechen',
                variant: options.cancelVariant ?? 'secondary',
              },
            ],
          },
        }),
      );
    });
  }
}
