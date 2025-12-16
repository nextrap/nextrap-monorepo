export { NteMultiselectItemElement } from './components/nte-multiselect-item/nte-multiselect-item';
export { NteMultiselectElement } from './components/nte-multiselect/nte-multiselect';
export type { MultiselectChangeDetail } from './components/nte-multiselect/nte-multiselect';

// Auto-register components when imported
import './components/nte-multiselect-item/nte-multiselect-item';
import './components/nte-multiselect/nte-multiselect';

// If mixin exisists, export it
// export * from './mixins/NteMultiselectMixin';

/* this bundles light dom styles by default */
export * from './styles/index.scss';
