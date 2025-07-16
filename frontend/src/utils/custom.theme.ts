import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const customTheme = EditorView.theme({
  '&': {
    color: '#abb2bf',
    backgroundColor: '#0B1226'
  },
  '.cm-content': {
    padding: '10px 0',
    caretColor: '#528bff'
  },
  '.cm-focused .cm-cursor': {
    borderLeftColor: '#528bff'
  },
  '.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: '#3e4451'
  },
  '.cm-panels': {
    backgroundColor: '#21252b',
    color: '#abb2bf'
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '2px solid black'
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '2px solid black'
  },
  '.cm-searchMatch': {
    backgroundColor: '#72a1ff59',
    outline: '1px solid #457dff'
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#6199ff2f'
  },
  '.cm-activeLine': {
    backgroundColor: '#2c313c'
  },
  '.cm-selectionMatch': {
    backgroundColor: '#aafe661a'
  },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: '#bad0f847',
    outline: '1px solid #515a6b'
  },
  '.cm-gutters': {
    backgroundColor: '#0B1226',
    color: '#546e7a',
    border: 'none'
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2c313c'
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ddd'
  },
  '.cm-tooltip': {
    border: 'none',
    backgroundColor: '#353a42'
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: '#353a42',
    borderBottomColor: '#353a42'
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#2c313c',
      color: '#abb2bf'
    }
  }
}, { dark: true });

const customHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#c678dd' },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: '#e06c75' },
  { tag: [t.function(t.variableName), t.labelName], color: '#61afef' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#d19a66' },
  { tag: [t.definition(t.name), t.separator], color: '#abb2bf' },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#e5c07b' },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: '#56b6c2' },
  { tag: [t.meta, t.comment], color: '#5c6370' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: '#61afef', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#e06c75' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d19a66' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#98c379' },
  { tag: t.invalid, color: '#ffffff' }
]);

export const customOneDarkTheme: Extension = [
  customTheme,
  syntaxHighlighting(customHighlightStyle)
];