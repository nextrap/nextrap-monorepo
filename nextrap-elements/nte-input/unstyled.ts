// Theme-Einstieg: nur Logik, Registrierung und inline eingebundene Shadow-DOM-Styles.
// Keine direkten oder transitiven Light-DOM-Styles: Themes gestalten die Oberfläche selbst über Sass-Mixins.
import { NteInput } from './src/components/nte-input/nte-input';

export * from './src/components/nte-input/nte-input';
export * from './src/lib/options';
export * from './src/lib/plugin';
export * from './src/lib/types';
export * from './src/plugins/default-checkbox';
export * from './src/plugins/default-select';
export * from './src/plugins/default-select-radio';
export * from './src/plugins/default-text';
export * from './src/plugins/default-textarea';
export * from './src/plugins/default-token-input';

import { DefaultCheckboxPlugin } from './src/plugins/default-checkbox';
import { DefaultSelectPlugin } from './src/plugins/default-select';
import { DefaultSelectRadioPlugin } from './src/plugins/default-select-radio';
import { DefaultTextPlugin } from './src/plugins/default-text';
import { DefaultTextareaPlugin } from './src/plugins/default-textarea';
import { DefaultTokenInputPlugin } from './src/plugins/default-token-input';

NteInput.registerPlugin(DefaultTextPlugin);
NteInput.registerPlugin(DefaultTextareaPlugin);
NteInput.registerPlugin(DefaultSelectPlugin);
NteInput.registerPlugin(DefaultSelectRadioPlugin);
NteInput.registerPlugin(DefaultCheckboxPlugin);
NteInput.registerPlugin(DefaultTokenInputPlugin);
