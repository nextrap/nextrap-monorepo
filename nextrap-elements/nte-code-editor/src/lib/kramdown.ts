// Kramdown-Attributlisten ergänzen Markdown, ohne dessen Code- und Escape-Regeln zu ersetzen.
import type { markdown } from '@codemirror/lang-markdown';
import { tags } from '@lezer/highlight';

// Die öffentliche Markdown-API liefert den Extension-Vertrag ohne zusätzliche Parser-Abhängigkeit.
type MarkdownOptions = NonNullable<Parameters<typeof markdown>[0]>;

// Erkennt Klassen, IDs und benannte Attribute; Anführungszeichen dürfen geschweifte Klammern enthalten.
const attributeList = /^\{:[ \t]+(?:[.#][\w-]+|[\w-]+=(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s}"']+))(?:[ \t]+(?:[.#][\w-]+|[\w-]+=(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s}"']+)))*[ \t]*\}/;

// Inline-Parsing erfasst auch eigenständige Attributzeilen, ohne sie als Code umzudeuten.
export const kramdown: NonNullable<MarkdownOptions['extensions']> = {
  defineNodes: [{ name: 'KramdownAttributes', style: tags.attributeName }],
  parseInline: [{
    name: 'KramdownAttributes',
    parse(context, next, position) {
      if (next !== 123 || context.char(position + 1) !== 58) return -1;
      const match = attributeList.exec(context.slice(position, context.end));
      if (!match) return -1;
      return context.addElement(context.elt('KramdownAttributes', position, position + match[0].length));
    },
  }],
};
