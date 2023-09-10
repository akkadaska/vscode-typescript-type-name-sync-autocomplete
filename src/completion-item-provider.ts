import {
  commands,
  CompletionList,
  type CompletionItem,
  type Position,
  type TextDocument,
} from 'vscode';
import { getCursorVariableInfo } from './node/get-cursor-variable-info';
import { detectInferMode } from './detect-infer-mode';
import { completionItemModifier } from './completion-item-modifier';

/**
 * Creates and returns a function to provide completion items.
 * @returns Completion items provider function.
 */
export const completionItemProvider = () => {
  /**
   * Flag to check if completion items are being loaded.
   * Prevents multiple concurrent loads due to async nature of the provider.
   * Without this, VSCode may call the function repeatedly, leading to an infinite loop.
   */
  let isLoading = false;

  return async (
    document: TextDocument,
    position: Position,
  ): Promise<CompletionItem[]> => {
    if (isLoading) {
      return [];
    }
    isLoading = true;
    try {
      const code = document.getText();
      const cursorVariableInfo = getCursorVariableInfo(
        code,
        document.offsetAt(position) - 1,
      );
      if (cursorVariableInfo === undefined) {
        return [];
      }
      const inferMode = detectInferMode(cursorVariableInfo.variableName);

      const itemList = await commands
        .executeCommand<CompletionList>(
          'vscode.executeCompletionItemProvider',
          document.uri,
          position,
        )
        .then((completionList) => completionList.items);

      const modifyCompletionItem = completionItemModifier(
        cursorVariableInfo,
        inferMode,
        document,
      );
      return modifyCompletionItem(itemList);
    } catch (error) {
      console.error('Error fetching completion items:', error);
      return [];
    } finally {
      isLoading = false;
    }
  };
};
