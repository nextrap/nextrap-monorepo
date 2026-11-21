// Runtime-Entrypoint ohne Light-DOM-Styles; das Theme bindet index.scss separat ein.
export { NteCodeEditor } from './src/components/nte-code-editor/nte-code-editor';
export type {
  CodeEditorDiffMode,
  CodeEditorDiffOrientation,
  CodeEditorHtmlElement,
  CodeEditorLanguage,
  CodeEditorRevertControls,
} from './src/lib/types';
