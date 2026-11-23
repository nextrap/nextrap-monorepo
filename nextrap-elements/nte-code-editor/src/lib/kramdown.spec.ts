// Parser-Tests sichern Attributlisten und die Grenzen zu normalem Markdown ab.
import { markdown } from '@codemirror/lang-markdown';
import { describe, expect, it } from 'vitest';
import { kramdown } from './kramdown';

// Ermittelt nur die von der Erweiterung erkannten Quelltextbereiche.
function attributes(source: string): string[] {
  const result: string[] = [];
  markdown({ extensions: [kramdown] }).language.parser.parse(source).iterate({
    enter(node) {
      if (node.name === 'KramdownAttributes') result.push(source.slice(node.from, node.to));
    },
  });
  return result;
}

// Inline- und Blockverwendung teilen dieselbe Syntax, einschließlich zitierter Werte.
describe('Kramdown-Attributlisten', () => {
  it.each([
    '*Text*{: .klasse}',
    'Absatz\n{: layout="ntl-2col"}',
    '---\n{: #bereich .klasse layout="ntl-2col"}',
    '{: title="Text mit } und Leerzeichen"}',
    "{: title='Text mit Leerzeichen'}",
  ])('erkennt Attribute in %s', source => {
    expect(attributes(source)).toHaveLength(1);
  });

  // Markdown-Code, Escapes und unvollständige Attribute dürfen keine Attributknoten erzeugen.
  it.each([
    '`{: .klasse}`',
    '```markdown\n{: .klasse}\n```',
    '    {: .klasse}',
    '\\{: .klasse}',
    '{: layout="offen}',
    '{: }',
    '{ normaler Text }',
  ])('ignoriert %s', source => {
    expect(attributes(source)).toEqual([]);
  });
});
