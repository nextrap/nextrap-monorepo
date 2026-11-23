// Sprachpakete teilen ihre Parser und Completion-Daten auch mit eingebetteten Dokumenten.
import {
  CompletionContext,
  type CompletionResult,
} from '@codemirror/autocomplete';
import { css } from '@codemirror/lang-css';
import {
  html,
  htmlCompletionSourceWith,
  type TagSpec,
} from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { markdown } from '@codemirror/lang-markdown';
import { sass } from '@codemirror/lang-sass';
import {
  LanguageDescription,
  LanguageSupport,
  syntaxTree,
  type Language,
} from '@codemirror/language';
import { EditorState, type Extension } from '@codemirror/state';
import type { CodeEditorHtmlElement, CodeEditorLanguage } from './types';
import { kramdown } from './kramdown';

// Die HTML-Quelle arbeitet synchron, auch wenn Markdown sie auf ein Fragment anwendet.
type SynchronousCompletion = (
  context: CompletionContext,
) => CompletionResult | null;

// Unveränderliche Sprachinstanzen werden zwischen Editoren und Fences wiederverwendet.
const cssSupport = css();
const javascriptSupport = javascript();
const typescriptSupport = javascript({ typescript: true });
const scssSupport = sass();
const markdownCodeNodes = new Set([
  'CodeBlock',
  'FencedCode',
  'CodeText',
  'CodeInfo',
  'InlineCode',
  'CommentBlock',
  'ProcessingInstructionBlock',
  'Link',
  'Image',
  'Escape',
]);

/** Ersetzt nur den aktuellen Klassennamen und erhält vorhandene Klassen. */
function createClassCompletion(
  classNames: readonly string[],
): SynchronousCompletion {
  const classes = [
    ...new Set(
      classNames.filter((name) => name.length > 0 && !/\s/.test(name)),
    ),
  ];

  return (context) => {
    if (classes.length === 0) return null;

    // Nur ein tatsächlich geparstes HTML-Attribut darf Klassen anbieten.
    let attribute = syntaxTree(context.state).resolveInner(context.pos, -1);
    while (attribute.name !== 'Attribute' && attribute.parent)
      attribute = attribute.parent;
    if (attribute.name !== 'Attribute') return null;

    const name = attribute.getChild('AttributeName');
    if (
      !name ||
      context.state.sliceDoc(name.from, name.to).toLowerCase() !== 'class'
    )
      return null;
    const assignment = /^\s*=\s*(["']?)/.exec(
      context.state.sliceDoc(name.to, context.pos),
    );
    if (!assignment) return null;

    const quote = assignment[1];
    const valueFrom = name.to + assignment[0].length;
    const rawValue = context.state.sliceDoc(valueFrom, attribute.to);
    const quoteEnd = quote ? rawValue.indexOf(quote) : -1;
    const valueTo = quoteEnd < 0 ? attribute.to : valueFrom + quoteEnd;
    if (context.pos < valueFrom || context.pos > valueTo) return null;

    // Auch bei einem Cursor mitten im Token bleibt der Rest der Klassenliste erhalten.
    const before = context.state.sliceDoc(valueFrom, context.pos);
    const after = context.state.sliceDoc(context.pos, valueTo);
    const from = context.pos - /[^\s]*$/.exec(before)![0].length;
    const to = context.pos + /^[^\s]*/.exec(after)![0].length;
    const existing = new Set([
      ...context.state.sliceDoc(valueFrom, from).split(/\s+/),
      ...context.state.sliceDoc(to, valueTo).split(/\s+/),
    ]);

    return {
      from,
      to,
      options: classes
        .filter((label) => !existing.has(label))
        .map((label) => ({ label, type: 'class' })),
      validFor: /^[^\s"'<>`=]*$/,
    };
  };
}

/** Ergänzt auch unvollständige HTML-Tags, die Markdown noch als Absatz erkennt. */
function createMarkdownHtmlCompletion(
  language: Language,
  htmlSupport: LanguageSupport,
  htmlCompletion: SynchronousCompletion,
  classCompletion: SynchronousCompletion,
): SynchronousCompletion {
  return (context) => {
    if (!language.isActiveAt(context.state, context.pos, -1)) return null;

    const tree = syntaxTree(context.state);
    let node = tree.resolveInner(context.pos, -1);
    let paragraph = node;
    for (;;) {
      if (markdownCodeNodes.has(node.name)) return null;
      if (node.name === 'Paragraph') paragraph = node;
      if (!node.parent) break;
      node = node.parent;
    }

    // Abgeschlossene Code-Spans und Escapes vor dem Cursor gehören nicht zum HTML-Fragment.
    let from = paragraph.from;
    tree.iterate({
      from,
      to: context.pos,
      enter(part) {
        if (!markdownCodeNodes.has(part.name)) return;
        if (part.to <= context.pos) from = Math.max(from, part.to);
        return false;
      },
    });
    const fragment = context.state.sliceDoc(from, paragraph.to);
    if (!fragment.includes('<')) return null;

    // Der HTML-Parser begrenzt Vorschläge auf Tags und Attribute statt auf beliebigen Markdown-Text.
    const state = EditorState.create({
      doc: fragment,
      extensions: htmlSupport,
    });
    const pos = context.pos - from;
    let tag = syntaxTree(state).resolveInner(pos, -1);
    while (
      !/^(?:OpenTag|CloseTag|SelfClosingTag|IncompleteTag|IncompleteCloseTag)$/.test(
        tag.name,
      ) &&
      tag.parent
    ) {
      tag = tag.parent;
    }
    if (
      !/^(?:OpenTag|CloseTag|SelfClosingTag|IncompleteTag|IncompleteCloseTag)$/.test(
        tag.name,
      )
    )
      return null;

    const localContext = new CompletionContext(state, pos, context.explicit);
    const result =
      classCompletion(localContext) ?? htmlCompletion(localContext);
    // Die Fragment-Positionen werden auf das vollständige Markdown-Dokument abgebildet.
    if (!result) return null;
    return {
      ...result,
      from: result.from + from,
      to: (result.to ?? pos) + from,
    };
  };
}

/** Baut die Sprachunterstützung einschließlich konfigurierbarer HTML-Vorschläge. */
export function createLanguageSupport(
  language: CodeEditorLanguage,
  htmlElements: readonly CodeEditorHtmlElement[],
  classNames: readonly string[],
): Extension {
  switch (language) {
    case 'text':
      return [];
    case 'css':
      return cssSupport;
    case 'javascript':
      return javascriptSupport;
    case 'typescript':
      return typescriptSupport;
    case 'scss':
      return scssSupport;
  }

  // Tags erweitern die eingebauten HTML-Vorschläge; Klassen erhalten eine eigene Token-Quelle.
  const extraTags: Record<string, TagSpec> = Object.fromEntries(
    htmlElements.map((element) => [
      typeof element === 'string' ? element : element.name,
      typeof element === 'string' ? {} : { attrs: element.attributes },
    ]),
  );
  const classCompletion = createClassCompletion(classNames);
  const htmlOptions = { extraTags, matchClosingTags: language !== 'markdown' };
  const baseHtml = html(htmlOptions);
  const htmlSupport = new LanguageSupport(baseHtml.language, [
    baseHtml.support,
    baseHtml.language.data.of({ autocomplete: classCompletion }),
  ]);
  if (language === 'html') return htmlSupport;

  // Dieselben Sprachinstanzen werden in Fences benutzt, damit auch deren Completion verfügbar ist.
  let markdownSupport: LanguageSupport;
  const codeLanguages = [
    LanguageDescription.of({
      name: 'HTML',
      alias: ['html'],
      support: htmlSupport,
    }),
    LanguageDescription.of({
      name: 'CSS',
      alias: ['css'],
      support: cssSupport,
    }),
    LanguageDescription.of({
      name: 'JavaScript',
      alias: ['js'],
      support: javascriptSupport,
    }),
    LanguageDescription.of({
      name: 'TypeScript',
      alias: ['ts'],
      support: typescriptSupport,
    }),
    LanguageDescription.of({
      name: 'SCSS',
      alias: ['scss'],
      support: scssSupport,
    }),
    // Die verzögerte Referenz erlaubt Markdown-Fences ohne rekursive Konfiguration beim Aufbau.
    LanguageDescription.of({
      name: 'Markdown',
      alias: ['md'],
      load: async () => markdownSupport,
    }),
  ];
  const baseMarkdown = markdown({
    extensions: [kramdown],
    htmlTagLanguage: htmlSupport,
    codeLanguages,
    completeHTMLTags: false,
  });
  markdownSupport = new LanguageSupport(baseMarkdown.language, [
    baseMarkdown.support,
    cssSupport.support,
    javascriptSupport.support,
    typescriptSupport.support,
    scssSupport.support,
    baseMarkdown.language.data.of({
      autocomplete: createMarkdownHtmlCompletion(
        baseMarkdown.language,
        htmlSupport,
        htmlCompletionSourceWith({ extraTags }),
        classCompletion,
      ),
    }),
  ]);
  return markdownSupport;
}
