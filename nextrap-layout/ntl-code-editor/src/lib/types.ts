/** Sprachen, die der Editor ohne zusätzliche Extensions bereitstellt. */
export type CodeEditorLanguage =
  | 'html'
  | 'markdown'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'scss'
  | 'text';

/** Zusätzlicher HTML-Tag mit optionalen Attributen und deren Vorschlagswerten. */
export type CodeEditorHtmlElement =
  | string
  | {
      name: string;
      attributes?: Record<string, readonly string[] | null>;
    };
