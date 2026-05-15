import '@nextrap/style-base';
import '@nextrap/style-button';
import '@nextrap/style-typography';
import '@nextrap/style-utils';
import '../index.ts';

import type {
  NextrapConfirmDetail,
  NextrapFailDetail,
  NextrapInfoDetail,
  NextrapLoadingDetail,
  NextrapProgressDetail,
  NextrapSuccessDetail,
  NteNotifier,
} from '../index.ts';

const notifier = document.querySelector('nte-notifier') as NteNotifier | null;
const logElement = document.getElementById('log');
const referenceTarget = document.getElementById('reference-target') as HTMLButtonElement | null;

const activeTimers: number[] = [];

const log = (message: string) => {
  if (!(logElement instanceof HTMLPreElement)) return;

  const line = `[${new Date().toLocaleTimeString()}] ${message}`;
  logElement.textContent = logElement.textContent ? `${line}\n${logElement.textContent}` : line;
};

const clearTimers = () => {
  while (activeTimers.length > 0) {
    const timer = activeTimers.pop();
    if (timer !== undefined) {
      window.clearTimeout(timer);
    }
  }
};

const later = (delay: number, callback: () => void) => {
  const timer = window.setTimeout(() => {
    const index = activeTimers.indexOf(timer);
    if (index >= 0) activeTimers.splice(index, 1);
    callback();
  }, delay);

  activeTimers.push(timer);
};

const sendLoading = (detail: NextrapLoadingDetail) => {
  log(`Event gesendet: nextrap:loading ${JSON.stringify({ message: detail.message })}`);
  window.dispatchEvent(new CustomEvent<NextrapLoadingDetail>('nextrap:loading', { detail }));
};

const sendProgress = (detail: NextrapProgressDetail) => {
  log(`Event gesendet: nextrap:progress ${JSON.stringify({ progress: detail.progress, message: detail.message })}`);
  window.dispatchEvent(new CustomEvent<NextrapProgressDetail>('nextrap:progress', { detail }));
};

const sendSuccess = (detail: NextrapSuccessDetail) => {
  log(`Event gesendet: nextrap:success ${JSON.stringify({ message: detail.message })}`);
  window.dispatchEvent(new CustomEvent<NextrapSuccessDetail>('nextrap:success', { detail }));
};

const sendFail = (detail: NextrapFailDetail) => {
  log(`Event gesendet: nextrap:fail ${JSON.stringify({ message: detail.message })}`);
  window.dispatchEvent(new CustomEvent<NextrapFailDetail>('nextrap:fail', { detail }));
};

const sendInfo = (detail: NextrapInfoDetail) => {
  log(`Event gesendet: nextrap:info ${JSON.stringify({ message: detail.message })}`);
  window.dispatchEvent(new CustomEvent<NextrapInfoDetail>('nextrap:info', { detail }));
};

const sendConfirm = (detail: NextrapConfirmDetail) => {
  log(`Event gesendet: nextrap:confirm ${JSON.stringify({ message: detail.message })}`);
  window.dispatchEvent(new CustomEvent<NextrapConfirmDetail>('nextrap:confirm', { detail }));
};

const runSuccessFlow = () => {
  clearTimers();

  sendLoading({
    message: 'Initialisiere Upload...',
    onAbort: () => {
      clearTimers();
      log('Abort-Callback aus Loading ausgeführt');
      sendFail({
        message: 'Upload wurde vom Benutzer abgebrochen.',
        autoClose: false,
      });
    },
  });

  later(900, () => sendProgress({ progress: 15, message: 'Dateien werden gesammelt...' }));
  later(1800, () => sendProgress({ progress: 48, message: 'Dateien werden geprüft...' }));
  later(2700, () => sendProgress({ progress: 78, message: 'Dateien werden hochgeladen...' }));
  later(3600, () => sendProgress({ progress: 100, message: 'Upload abgeschlossen.' }));
  later(4300, () => sendSuccess({ message: 'Alle Dateien wurden erfolgreich verarbeitet.' }));
};

const runFailFlow = () => {
  clearTimers();

  sendLoading({
    message: 'Starte Import...',
    onAbort: () => {
      clearTimers();
      log('Abort-Callback aus Loading ausgeführt');
      sendFail({
        message: 'Import wurde abgebrochen.',
        details: 'Der Vorgang wurde manuell über den Abort-Button beendet.',
        autoClose: false,
      });
    },
  });

  later(900, () => sendProgress({ progress: 20, message: 'Lese Quelldaten...' }));
  later(1800, () => sendProgress({ progress: 52, message: 'Transformiere Datensätze...' }));
  later(2700, () =>
    sendFail({
      message: 'Import fehlgeschlagen.',
      details: 'Zeile 152: Ungültiges Datumsformat in Spalte "deliveryDate".',
      autoClose: false,
    }),
  );
};

const runInfoConfirmFlow = () => {
  clearTimers();

  sendInfo({
    message: 'Ein Folgeprozess kann jetzt gestartet werden.',
    onConfirm: () => {
      log('Info bestätigt → Confirm wird geöffnet');
      sendConfirm({
        message: 'Welcher Folgeprozess soll gestartet werden?',
        html: '<p><strong>Hinweis:</strong> Die Aktion wird direkt nach der Auswahl simuliert.</p>',
        actions: [
          {
            label: 'Erfolgsweg',
            variant: 'primary',
            callback: () => {
              log('Confirm-Aktion: Erfolgsweg');
              runSuccessFlow();
            },
          },
          {
            label: 'Fehlerweg',
            variant: 'danger',
            callback: () => {
              log('Confirm-Aktion: Fehlerweg');
              runFailFlow();
            },
          },
          {
            label: 'Nur schließen',
            variant: 'secondary',
            callback: () => {
              log('Confirm-Aktion: Nur schließen');
              sendSuccess({
                message: 'Dialog geschlossen. Es wurde kein Folgeprozess gestartet.',
                autoClose: true,
              });
            },
          },
        ],
      });
    },
  });
};

const runReferenceFlow = () => {
  clearTimers();

  sendProgress({
    progress: 33,
    message: 'Referenzierter Prozess läuft...',
    reference: referenceTarget ?? 'reference-target',
    onAbort: () => {
      clearTimers();
      sendFail({
        message: 'Referenzierter Prozess wurde abgebrochen.',
        autoClose: false,
      });
    },
  });

  later(1000, () =>
    sendProgress({
      progress: 66,
      message: 'Referenzierter Prozess wird fortgesetzt...',
      reference: referenceTarget ?? 'reference-target',
    }),
  );

  later(2000, () =>
    sendSuccess({
      message: 'Referenzierter Prozess erfolgreich abgeschlossen.',
      autoClose: true,
    }),
  );
};

const wireButton = (id: string, callback: () => void) => {
  document.getElementById(id)?.addEventListener('click', callback);
};

wireButton('send-loading', () => {
  clearTimers();
  sendLoading({
    message: 'Globale Ladeanzeige aktiv.',
    onAbort: () => {
      log('Abort aus direktem Loading ausgelöst');
      sendFail({
        message: 'Ladevorgang wurde abgebrochen.',
        autoClose: false,
      });
    },
  });
});

wireButton('send-progress', () => {
  clearTimers();
  sendProgress({
    progress: 45,
    message: 'Dateien werden verarbeitet...',
    reference: referenceTarget ?? 'reference-target',
    onAbort: () => {
      log('Abort aus direktem Progress ausgelöst');
      sendFail({
        message: 'Progress-Vorgang wurde abgebrochen.',
        autoClose: false,
      });
    },
  });
});

wireButton('send-success', () => {
  clearTimers();
  sendSuccess({
    message: 'Vorgang erfolgreich abgeschlossen.',
    autoClose: true,
  });
});

wireButton('send-fail', () => {
  clearTimers();
  sendFail({
    message: 'Es ist ein Fehler aufgetreten.',
    details: 'HTTP 500 – Interner Serverfehler',
    autoClose: false,
  });
});

wireButton('send-info', () => {
  clearTimers();
  sendInfo({
    message: 'Dies ist ein einfacher Info-Dialog.',
    onConfirm: () => log('Info-Dialog bestätigt'),
  });
});

wireButton('send-confirm', () => {
  clearTimers();
  sendConfirm({
    message: 'Bitte wähle eine Aktion.',
    html: '<ul><li>Primäre Aktion</li><li>Sekundäre Aktion</li><li>Gefährliche Aktion</li></ul>',
    actions: [
      {
        label: 'Weiter',
        variant: 'primary',
        callback: () => sendSuccess({ message: 'Primäre Aktion bestätigt.', autoClose: true }),
      },
      {
        label: 'Später',
        variant: 'secondary',
        callback: () => sendInfo({ message: 'Aktion wurde vertagt.' }),
      },
      {
        label: 'Löschen',
        variant: 'danger',
        callback: () => sendFail({ message: 'Löschvorgang simuliert.', autoClose: false }),
      },
    ],
  });
});

wireButton('flow-success', runSuccessFlow);
wireButton('flow-fail', runFailFlow);
wireButton('flow-info-confirm', runInfoConfirmFlow);
wireButton('flow-reference', runReferenceFlow);
wireButton('close-notifier', () => {
  clearTimers();
  notifier?.close();
  log('Notifier manuell geschlossen');
});
wireButton('clear-log', () => {
  if (logElement instanceof HTMLPreElement) {
    logElement.textContent = '';
  }
});

log('Demo initialisiert');
