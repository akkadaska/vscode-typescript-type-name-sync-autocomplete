# TypeScript Type-Name-Sync Autocomplete
VSCode extension that seamlessly syncs and autocompletes TypeScript variable names and types, turning declarations into `const apple: Apple.`

![Sync type and name](https://raw.githubusercontent.com/akkadaska/vscode-typescript-type-name-sync-autocomplete/main/assets/sync.png)

**Supported Syntax**
- Type annotation :`const apple: Apple ...`
- New expression: `const apple = new Apple ...`

## Features
### Infer type from variable name (Sorting of suggestions relevance to variable name)

After typing `:` following a variable name, the autocomplete suggestions will sort types based on the similarity to the variable name. For instance, if you have a type `MyService` and you start typing `myService: `, the extension will push `MyService` to the top of the suggestions list.

![Infer type from variable name](https://raw.githubusercontent.com/akkadaska/vscode-typescript-type-name-sync-autocomplete/main/assets/type-infer.gif)

### Inter variable name from type (Automatic variable naming with magic word)
If you're not sure about a variable name, you can use a magic word `_` as a placeholder. When you pick a type from the suggestions list after this magic word, the extension will replace the placeholder with an appropriate variable name. For example, typing `_: MyService` and selecting `MyService` from the suggestions will transform the code to `myService: MyService`.

![Infer name from type](https://raw.githubusercontent.com/akkadaska/vscode-typescript-type-name-sync-autocomplete/main/assets/name-infer.gif)

# Installation
1. Open VSCode
2. Go to Extensions
3. Search for "TypeScript Type-Name-Sync Autocomplete"
4. Install and Reload VSCode

## Usage
Start typing a variable declaration in your TypeScript file.
After the variable name, type `:` to get type suggestions sorted based on the variable name.
Alternatively, use the magic word `_` as your variable name and choose a type from the suggestions to get an automatic variable name based on the type.

## Contributions
Contributions, issues, and feature requests are welcome! [GitHub repository is here!](https://github.com/akkadaska/vscode-typescript-type-name-sync-autocomplete)

# License
&copy; Daisuke Akazawa, 2023-. Licensed under a [MIT license](https://raw.githubusercontent.com/akkadaska/vscode-typescript-type-name-sync-autocomplete/main/LICENSE).