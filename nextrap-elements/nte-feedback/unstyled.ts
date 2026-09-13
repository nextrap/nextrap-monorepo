// Theme-Einstieg: nur Logik, Registrierung und inline eingebundene Shadow-DOM-Styles.
// Keine direkten oder transitiven Light-DOM-Styles: Themes gestalten die Oberfläche selbst über Sass-Mixins.
export * from './src/components/nte-feedback/nte-feedback';
export * from './src/lib/feedback';
export * from './src/lib/types';

import type {
  NextrapConfirmDetail,
  NextrapFailDetail,
  NextrapInfoDetail,
  NextrapLoadingDetail,
  NextrapProgressDetail,
  NextrapSuccessDetail,
} from './src/lib/types';

declare global {
  interface WindowEventMap {
    'nextrap:loading': CustomEvent<NextrapLoadingDetail>;
    'nextrap:progress': CustomEvent<NextrapProgressDetail>;
    'nextrap:success': CustomEvent<NextrapSuccessDetail>;
    'nextrap:fail': CustomEvent<NextrapFailDetail>;
    'nextrap:info': CustomEvent<NextrapInfoDetail>;
    'nextrap:confirm': CustomEvent<NextrapConfirmDetail>;
    'nextrap:feedback-close': CustomEvent<void>;
    'nextrap:feedback-closed': CustomEvent<void>;
  }
}
