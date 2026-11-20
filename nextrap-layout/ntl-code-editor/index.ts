// Runtime-Entrypoint ohne Light-DOM-Styles; das Theme bindet index.scss separat ein.
export { NtlCodeEditor } from './src/components/ntl-code-editor/ntl-code-editor';
export type {
  CodeEditorHtmlElement,
  CodeEditorLanguage,
} from './src/lib/types';
