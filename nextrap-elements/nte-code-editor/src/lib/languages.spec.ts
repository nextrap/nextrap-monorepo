import { describe, expect, it } from 'vitest';
import { EditorState } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { createLanguageSupport } from './languages';
import type { CodeEditorLanguage } from './types';

// Die Parser müssen nicht nur laden, sondern die eingebetteten Sprachen erkennen.
describe('Sprachunterstützung für Website-Dateien', () => {
  it.each<[CodeEditorLanguage, string, string]>([
    ['yaml', 'title: Hallo\n', 'BlockMapping'],
    ['php', '<?php echo "Hallo";', 'Template'],
    ['markdown', '---\ntitle: Hallo\n---\n# Inhalt', 'Frontmatter'],
    ['jekyll', '---\ntitle: Hallo\n---\n<h1>{{ page.title }}</h1>', 'Frontmatter'],
    ['liquid', '<h1>{{ page.title }}</h1>', 'Template'],
  ])('%s erkennt die Syntax', (language, doc, node) => {
    const state = EditorState.create({ doc, extensions: [createLanguageSupport(language, [], [])] });
    expect(syntaxTree(state).toString()).toContain(node);
  });
});
