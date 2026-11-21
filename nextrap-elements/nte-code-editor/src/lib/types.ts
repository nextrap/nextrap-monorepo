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
