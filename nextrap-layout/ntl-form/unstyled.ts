// Theme-Einstieg: nur Logik, Registrierung und inline eingebundene Shadow-DOM-Styles.
// Keine direkten oder transitiven Light-DOM-Styles: Themes gestalten die Oberfläche selbst über Sass-Mixins.
export * from './src/components/ntl-form/ntl-form';
export * from './src/components/ntl-form-format/ntl-form-format';

// If mixin exisists, export it
// export * from './src/mixins/NtlFormMixin';

declare global {
  interface Window {
    formmail_callback: (data: object) => void;
  }
}
