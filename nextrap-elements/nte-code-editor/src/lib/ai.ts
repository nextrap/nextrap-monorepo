// Marimo übernimmt nur die automatische Vervollständigung.
import { inlineCompletion, inlineCompletionKeymap } from '@marimo-team/codemirror-ai';
import { inlineEditExtension, isInlineEditActive, openInlineEdit } from './inline-edit';
import { Prec } from '@codemirror/state';
import type { Extension } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import type {
  CodeEditorInlineCompletionCallback, CodeEditorInlineEditCallback, CodeEditorLanguage,
} from './types';

// Nur die anwendungsspezifischen Callbacks werden an die Plugin-API angepasst.
interface AiOptions {
  completion?: CodeEditorInlineCompletionCallback;
  edit?: CodeEditorInlineEditCallback;
  automatic: boolean;
  delay: number;
  editKey: string;
  language: () => CodeEditorLanguage;
  canEdit: () => boolean;
}

// Die beiden Erweiterungen sind unabhängig; ohne Callback wird nichts installiert.
export function aiExtensions(config: AiOptions): Extension {
  const { completion, edit } = config;
  return [
    completion && config.automatic ? [
      inlineCompletion({
        delay: config.delay,
        includeKeymap: false,
        events: {
          beforeSuggestionFetch: view => config.canEdit() && !isInlineEditActive(view),
          shouldShowSuggestion: view => config.canEdit() && !isInlineEditActive(view),
        },
        fetchFn: async (state, signal) => {
          const cursor = state.selection.main.head;
          const result = await completion({
            language: config.language(),
            codeBefore: state.sliceDoc(0, cursor),
            codeAfter: state.sliceDoc(cursor),
            cursor,
            signal,
          });
          return result?.text ?? '';
        },
      }),
      // Tab übernimmt Ghost-Text vor der bestehenden Einrückungsbelegung.
      Prec.highest(inlineCompletionKeymap),
    ] : [],
    edit ? inlineEditExtension({
      edit, key: config.editKey, language: config.language, canEdit: config.canEdit,
    }) : [],
  ];
}

// Der öffentliche Edit-Trigger delegiert an den vorhandenen Plugin-Befehl.
export function triggerEdit(view: EditorView): boolean {
  return openInlineEdit(view);
}
