export * from './src/components/ntl-form/ntl-form';
export * from './src/components/ntl-form-format/ntl-form-format';

// If mixin exisists, export it
// export * from './src/mixins/NtlFormMixin';

/* this bundles light dom styles by default */
import './src/styles/index.scss';


declare global {
  interface Window {
    formmail_callback: (data: object) => void;
  }
}