import { NteInput } from './components/nte-input/nte-input';

export * from './components/nte-input/nte-input';
export * from './lib/form-data-accessor';
export * from './lib/options';
export * from './lib/plugin';
export * from './lib/types';
export * from './plugins/default-checkbox';
export * from './plugins/default-select';
export * from './plugins/default-select-radio';
export * from './plugins/default-text';
export * from './plugins/default-textarea';

import { DefaultCheckboxPlugin } from './plugins/default-checkbox';
import { DefaultSelectPlugin } from './plugins/default-select';
import { DefaultSelectRadioPlugin } from './plugins/default-select-radio';
import { DefaultTextPlugin } from './plugins/default-text';
import { DefaultTextareaPlugin } from './plugins/default-textarea';

NteInput.registerPlugin(DefaultTextPlugin);
NteInput.registerPlugin(DefaultTextareaPlugin);
NteInput.registerPlugin(DefaultSelectPlugin);
NteInput.registerPlugin(DefaultSelectRadioPlugin);
NteInput.registerPlugin(DefaultCheckboxPlugin);
