export * from './src/components/nte-notifier/nte-notifier';
export * from './src/lib/types';

/* this bundles light dom styles by default */
import './src/styles/index.scss';

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
  }
}
