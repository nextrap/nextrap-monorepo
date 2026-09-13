// Theme-Einstieg: nur Logik, Registrierung und inline eingebundene Shadow-DOM-Styles.
// Keine direkten oder transitiven Light-DOM-Styles: Themes gestalten die Oberfläche selbst über Sass-Mixins.
export { NteMultiselectItemElement } from './src/components/nte-multiselect-item/nte-multiselect-item';
export { NteMultiselectElement } from './src/components/nte-multiselect/nte-multiselect';
export type { MultiselectChangeDetail } from './src/components/nte-multiselect/nte-multiselect';

// Auto-register components when imported
import './src/components/nte-multiselect-item/nte-multiselect-item';
import './src/components/nte-multiselect/nte-multiselect';

// If mixin exisists, export it
// export * from './src/mixins/NteMultiselectMixin';
