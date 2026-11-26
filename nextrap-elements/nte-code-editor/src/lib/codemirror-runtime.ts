// Diese Laufzeit wird erst bei der Initialisierung einer Editoransicht geladen.
export { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
export { defaultKeymap, history, historyField, historyKeymap, indentWithTab } from '@codemirror/commands';
export { bracketMatching, codeFolding, foldAll as foldAllCode, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting, unfoldAll as unfoldAllCode } from '@codemirror/language';
export { getOriginalDoc, MergeView, originalDocChangeEffect, unifiedMergeView } from '@codemirror/merge';
export { ChangeSet, Compartment, EditorState, Transaction } from '@codemirror/state';
export { drawSelection, dropCursor, EditorView, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view';
export { createLanguageSupport } from './languages';
export { aiExtensions, triggerEdit } from './ai';
import { Annotation } from '@codemirror/state';
import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Programmatische Wertzuweisungen bleiben wie bei einem nativen Textfeld ereignislos.
export const assignedValue = Annotation.define<boolean>();

// Syntaxfarben bleiben über das äußere Theme konfigurierbar.
export const tokenHighlighting = HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--nte-code-editor-keyword)' },
  { tag: [tags.string, tags.attributeValue], color: 'var(--nte-code-editor-string)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--nte-code-editor-number)' },
  { tag: [tags.comment, tags.meta], color: 'var(--nte-code-editor-comment)' },
  { tag: [tags.tagName, tags.typeName], color: 'var(--nte-code-editor-tag)' },
  { tag: [tags.attributeName, tags.propertyName], color: 'var(--nte-code-editor-attribute)' },
  { tag: tags.heading, fontWeight: 'bold' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
]);
