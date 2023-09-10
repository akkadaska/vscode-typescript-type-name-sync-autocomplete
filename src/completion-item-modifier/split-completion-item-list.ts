import type { CompletionItem } from 'vscode';

/**
 * Split completion item list into two lists.
 * @param items
 * @returns
 */
export const splitCompletionItemList = (
  items: CompletionItem[],
): readonly [CompletionItem[], CompletionItem[]] => {
  const labelList = items.map((item) =>
    typeof item.label === 'string' ? item.label : item.label.label,
  );
  for (let i = 0; i < items.length - 1; i++) {
    if (labelList[i] > labelList[i + 1]) {
      return [items.slice(0, i + 1), items.slice(i + 1)];
    }
  }
  return [[], items];
};
