import { NteInput } from './components/nte-input/nte-input';
export * from './components/nte-input/nte-input';
export * from './lib/options';
export * from './lib/types';
export * from './plugins/default-checkbox';
export * from './plugins/default-select';
export * from './plugins/default-select-radio';
export * from './plugins/default-text';
export * from './plugins/default-textarea';

import { defaultCheckboxPlugin } from './plugins/default-checkbox';
import { defaultSelectPlugin } from './plugins/default-select';
import { defaultSelectRadioPlugin } from './plugins/default-select-radio';
import { defaultTextPlugin } from './plugins/default-text';
import { defaultTextareaPlugin } from './plugins/default-textarea';

NteInput.registerPlugin(defaultTextPlugin);
NteInput.registerPlugin(defaultTextareaPlugin);
NteInput.registerPlugin(defaultSelectPlugin);
NteInput.registerPlugin(defaultSelectRadioPlugin);
NteInput.registerPlugin(defaultCheckboxPlugin);
