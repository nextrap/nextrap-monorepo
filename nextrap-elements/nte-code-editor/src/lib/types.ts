/** Sprachen, die der Editor ohne zusätzliche Extensions bereitstellt. */
export type CodeEditorLanguage =
  | 'html'
  | 'markdown'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'scss'
  | 'text';

/** Darstellung des Vergleichs; ohne originalValue bleibt der normale Editor aktiv. */
export type CodeEditorDiffMode = 'unified' | 'side-by-side';

/** Visuelle Reihenfolge, unabhängig von den Rollen der beiden Dokumente. */
export type CodeEditorDiffOrientation = 'original-first' | 'modified-first';

/** Ziel der blockweisen Übernahme im zweispaltigen Vergleich. */
export type CodeEditorRevertControls =
  | 'original-to-modified'
  | 'modified-to-original'
  | 'none';

/** Zusätzlicher HTML-Tag mit optionalen Attributen und deren Vorschlagswerten. */
export type CodeEditorHtmlElement =
  | string
  | {
      name: string;
      attributes?: Record<string, readonly string[] | null>;
    };

/** Kontext einer Vervollständigung; Positionen sind UTF-16-Offsets wie in CodeMirror. */
export interface CodeEditorInlineCompletionRequest {
  language: CodeEditorLanguage;
  codeBefore: string;
  codeAfter: string;
  cursor: number;
  signal: AbortSignal;
}

/** Nur einzufügender Text, nicht das gesamte Dokument. */
export interface CodeEditorInlineCompletionResponse {
  text: string;
}

/** Null bedeutet, dass kein Vorschlag angezeigt werden soll. */
export type CodeEditorInlineCompletionCallback = (
  request: CodeEditorInlineCompletionRequest,
) => Promise<CodeEditorInlineCompletionResponse | null>;

/** Vom Plugin auf vollständige Zeilen erweiterte Auswahl mit Freitextanweisung. */
export interface CodeEditorInlineEditRequest {
  language: CodeEditorLanguage;
  codeBefore: string;
  selection: string;
  codeAfter: string;
  from: number;
  to: number;
  prompt: string;
  signal?: AbortSignal;
}

/** Nichtleerer Ersatz der ausgewählten Zeilen. */
export interface CodeEditorInlineEditResponse {
  text: string;
}

/** Null oder leerer Ersatz lässt die ursprünglichen Zeilen unverändert. */
export type CodeEditorInlineEditCallback = (
  request: CodeEditorInlineEditRequest,
) => Promise<CodeEditorInlineEditResponse | null>;
