import { Range, type CompletionItem, type TextDocument } from 'vscode';
import {
  INFER_MODE,
  NameInferMode,
  type InferMode,
} from '../detect-infer-mode';
import type { CursorVariableInfo } from '../node/get-cursor-variable-info';
import { getSortTextPrefix } from './get-sort-text-prefix';
import { upperCamelToCamelCase } from '../utils';
import { splitCompletionItemList } from './split-completion-item-list';

/**
 * Get function to modify completion item.
 * @param cursorVariableInfo
 * @param inferMode
 * @param document
 * @returns function to modify completion item
 */
export const completionItemModifier = (
  cursorVariableInfo: CursorVariableInfo,
  inferMode: InferMode,
  document: TextDocument,
) => {
  if (inferMode.mode === INFER_MODE.NAME) {
    return modifyCompletionItemInferNameMode(
      cursorVariableInfo,
      inferMode,
      document,
    );
  } else {
    return modifyCompletionItemInferTypeMode(cursorVariableInfo);
  }
};

/**
 * Modify completion item in infer name mode.
 * range is modified to include the variable name for name inference.
 * filterText and insertText are modified for the modified range.
 * label is modified to just add the prefix "(auto-naming)" to detail.
 * sortText is modified to sort the completion items by the variable name when having no leading word (prefix).
 * See {@link CompletionItem.sortText} for more details.
 * @param cursorVariableInfo
 * @param inferMode
 * @param document
 * @returns function to modify completion item
 */
const modifyCompletionItemInferNameMode =
  (
    cursorVariableInfo: CursorVariableInfo,
    inferMode: NameInferMode,
    document: TextDocument,
  ) =>
  (items: CompletionItem[]) => {
    const [priorityItems, normalItems] = splitCompletionItemList(items);
    [priorityItems, normalItems].map((items, index) => {
      items.forEach((item: CompletionItem): void => {
        const [originalLabel, originalLabelDetail, originalLabelDescription] =
          typeof item.label === 'string'
            ? [item.label, undefined, undefined]
            : [item.label.label, item.label.detail, item.label.description];

        item.label = {
          label: originalLabel,
          detail: `(auto-naming)${originalLabelDetail ?? ''}`,
          description: originalLabelDescription,
        };
        item.range = new Range(
          document.positionAt(cursorVariableInfo.variableStartsAt),
          document.positionAt(cursorVariableInfo.variableStartsAt),
        );
        item.filterText = `${cursorVariableInfo.variableName}${cursorVariableInfo.precedingCodeSegment}${originalLabel}`;
        item.insertText = `${upperCamelToCamelCase(originalLabel)}${
          cursorVariableInfo.precedingCodeSegment
        }${originalLabel}`;
        item.sortText =
          getSortTextPrefix(
            originalLabel,
            cursorVariableInfo.variableName,
            index === 0,
          ) + originalLabel;
      });
    });

    return [...priorityItems, ...normalItems];
  };

/**
 * Modify completion item in infer type mode.
 * Only sortText is modified to sort the completion items by the variable name when having no leading word (prefix).
 * See {@link CompletionItem.sortText} for more details.
 * @param cursorVariableInfo
 * @returns function to modify completion item
 */
const modifyCompletionItemInferTypeMode =
  (cursorVariableInfo: CursorVariableInfo) => (items: CompletionItem[]) => {
    const [priorityItems, normalItems] = splitCompletionItemList(items);
    [priorityItems, normalItems].map((items, index) => {
      items.forEach((item: CompletionItem): void => {
        const label =
          typeof item.label === 'string' ? item.label : item.label.label;
        item.sortText =
          getSortTextPrefix(
            label,
            cursorVariableInfo.variableName,
            index === 0,
          ) + label;
      });
    });
    return [...priorityItems, ...normalItems];
  };
