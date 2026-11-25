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


/** UI-relevanter Ausschnitt des API-Stub-Vertrags; benötigt keinen Runtime-Import. */
export interface RequestFeedbackDetails {
  key?: string;
  name?: string;
  loadingMessage?: string;
  successMessage?: string | false;
  errorMessage?: string | false;
  data?: unknown;
}

/** Ein benanntes Preset bestimmt Darstellung und optionale Standardtexte. */
export interface RequestFeedbackPreset extends Omit<RequestFeedbackDetails, 'key' | 'name'> {
  variant?: 'mini' | 'dialog';
}

interface RequestFeedbackEvent {
  id: string;
  key?: string;
  name?: string;
  feedback: RequestFeedbackDetails | false;
  context: { name: string };
}

type RequestFeedbackEnd = RequestFeedbackEvent & (
  | { status: 'success'; data: unknown }
  | { status: 'error' | 'aborted'; error: unknown }
);

type RequestFeedbackError = RequestFeedbackEvent & {
  status: 'error';
  error: unknown;
  response?: Response;
};

type ResolvedRequest = RequestFeedbackPreset & RequestFeedbackDetails & {
  name: string;
  variant: 'mini' | 'dialog';
};

type RequestPresentation =
  | { kind: 'terminal' }
  | { kind: 'loading'; id: string; variant: 'mini' | 'dialog'; ending: boolean };

type TerminalFeedback =
  | { kind: 'success'; detail: NextrapSuccessDetail }
  | { kind: 'error'; detail: NextrapFailDetail };

/** Nur explizit bereitgestellte Zusatzinformationen als Text anzeigen. */
function additionalDetails(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'details' in data && typeof data.details === 'string') {
    return data.details;
  }
  return '';
}

/** Die ursprüngliche Exception bleibt erhalten; JSON-Backendfehler ergänzen die Anzeige. */
async function describeRequestError(event: RequestFeedbackError): Promise<string> {
  const fallback = event.error instanceof Error ? event.error.message : String(event.error);
  if (!event.response || event.response.ok) return fallback;
  try {
    const body: unknown = await event.response.clone().json();
    if (body && typeof body === 'object') {
      const candidate = 'error' in body ? body.error : body;
      if (typeof candidate === 'string' && candidate.trim()) return candidate;
      if (candidate && typeof candidate === 'object'
          && 'message' in candidate && typeof candidate.message === 'string' && candidate.message.trim()) {
        return candidate.message;
      }
    }
  } catch {
    // Raw/NDJSON-Bodies können bereits verbraucht sein; die Exception bleibt der Fallback.
  }
  return fallback;
}

/** Ein Adapter bündelt alle Aufrufe einer SPA auf der vorhandenen Feedback-Fläche. */
function createRequestHandler(presets: Readonly<Record<string, RequestFeedbackPreset>> = {}) {
  const active = new Map<string, ResolvedRequest>();
  const terminal: TerminalFeedback[] = [];
  let pendingErrors = 0;
  let scheduled = false;
  let current: RequestPresentation | undefined;

  // Request-Details überschreiben das frei definierbare Preset.
  const resolve = (event: RequestFeedbackEvent): ResolvedRequest => {
    const details: RequestFeedbackDetails = event.feedback || {};
    const key = details.key ?? event.key ?? 'mini';
    const preset = Object.prototype.hasOwnProperty.call(presets, key) ? presets[key] : undefined;
    return {
      ...preset,
      ...details,
      name: details.name ?? event.name ?? event.context.name,
      variant: preset?.variant ?? (key === 'dialog' ? 'dialog' : 'mini'),
    };
  };

  // Erst nach den synchron aufeinanderfolgenden End-/Error-Callbacks neu darstellen.
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      refresh();
    });
  };

  // Ein alter Loading-Promise darf weder einen neuen Loader noch einen Fehler schließen.
  const show = (state: RequestPresentation, open: () => Promise<void>) => {
    current = state;
    void open().then(() => {
      if (current !== state) return;
      current = undefined;
      if (state.kind === 'terminal' || state.ending) schedule();
    });
  };

  // Dialoge haben Vorrang; Abschlussmeldungen warten auf laufende sichtbare Requests.
  const refresh = () => {
    if (current?.kind === 'terminal') return;
    const entries = [...active.entries()];
    const selected = entries.find(([, request]) => request.variant === 'dialog') ?? entries[0];
    if (selected) {
      const [id, request] = selected;
      if (current?.kind === 'loading' && !current.ending && current.variant === request.variant
          && (request.variant === 'mini' || current.id === id)) return;
      show({ kind: 'loading', id, variant: request.variant, ending: false }, () => Feedback.loading({
        variant: request.variant,
        title: request.name,
        message: request.loadingMessage ?? request.name,
        cancelable: false,
      }));
      return;
    }

    // Fehler zuerst anzeigen; keine Abschlussmeldung durch einen späteren Request ersetzen.
    if (!pendingErrors && terminal.length) {
      const errorIndex = terminal.findIndex(item => item.kind === 'error');
      const item = terminal.splice(errorIndex < 0 ? 0 : errorIndex, 1)[0];
      show({ kind: 'terminal' }, () => item.kind === 'error'
        ? Feedback.error(item.detail) : Feedback.success(item.detail));
      return;
    }

    if (current?.kind === 'loading' && !current.ending) {
      current.ending = true;
      Feedback.ready();
    }
  };

  // Diese drei Callbacks werden einmal an createApi() oder API.with() übergeben.
  return {
    feedback: 'mini' as const,
    onFeedbackStart(event: RequestFeedbackEvent): void {
      if (event.feedback === false) return;
      active.set(event.id, resolve(event));
      schedule();
    },
    onFeedbackEnd(event: RequestFeedbackEnd): void {
      const request = active.get(event.id);
      active.delete(event.id);
      if (request && event.status === 'success'
          && request.successMessage !== false
          && (request.variant === 'dialog' || request.successMessage !== undefined)) {
        terminal.push({
          kind: 'success',
          detail: {
            title: 'Erfolgreich: ' + request.name,
            message: [request.successMessage ?? 'Vorgang erfolgreich abgeschlossen.', additionalDetails(request.data)].filter(Boolean).join(' — '),
          },
        });
      }
      schedule();
    },
    async onError(event: RequestFeedbackError): Promise<void> {
      const request = resolve(event);
      if (request.errorMessage === false) return;
      pendingErrors++;
      try {
        const reason = await describeRequestError(event);
        const status = event.response && !event.response.ok
          ? `HTTP ${event.response.status} ${event.response.statusText}`.trim() : '';
        terminal.push({
          kind: 'error',
          detail: {
            title: 'Fehler: ' + request.name,
            message: request.errorMessage ?? reason,
            details: [request.errorMessage ? reason : '', status, additionalDetails(request.data)].filter(Boolean).join('\n'),
            autoClose: false,
          },
        });
      } finally {
        pendingErrors--;
        schedule();
      }
    },
  };
}

export class Feedback {
  /**
   * Verknüpft die globalen Feedback-Callbacks des @trunkjs/api-stub mit NTE Feedback.
   * @example const API = generatedAPI.with(Feedback.createRequestHandler());
   */
  static createRequestHandler(presets?: Readonly<Record<string, RequestFeedbackPreset>>) {
    return createRequestHandler(presets);
  }

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

  /** Schließt Loading ab; der Mini-Loader läuft vor dem Ausblenden bis zum Ende. */
  static ready(): void {
    window.dispatchEvent(new CustomEvent('nextrap:ready'));
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
