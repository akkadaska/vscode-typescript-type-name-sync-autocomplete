import { languages, type ExtensionContext } from 'vscode';
import { completionItemProvider } from './completion-item-provider';

/**
 * Activate extension.
 * @param context
 */
export const activate = (context: ExtensionContext) => {
  const provideCompletionItems = completionItemProvider();
  const provider = languages.registerCompletionItemProvider(
    'typescript',
    {
      provideCompletionItems,
    },
    ':',
    ' ',
  );
  context.subscriptions.push(provider);
};

/**
 * Deactivate extension.
 */
export const deactivate = () => {};
