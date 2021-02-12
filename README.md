# cz-cc

[![build](https://github.com/Lchemist/cz-cc/workflows/build/badge.svg)](https://github.com/Lchemist/cz-cc/actions?query=workflow%3Abuild)
[![NPM](https://img.shields.io/npm/v/cz-cc.svg)](https://www.npmjs.com/package/cz-cc)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
[![Conventional Changelog](https://img.shields.io/badge/changelog-conventional-brightgreen.svg)](https://conventional-changelog.github.io)

A [commitizen](https://www.npmjs.com/package/commitizen) adaptor that follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

![DEMO](https://files.rayx.io/images/cz-cc.demo.gif)

## ✨ Features

* Supports semantic emoji in commit subject message
* Customizable questions (disable any question)
* Searchable choices for type & scope
* Customizable type values, descriptions and associated emojis
* Customizable scope values
* Better CLI prompts
* 0 modification required when migrating from [cz-conventional-changelog](https://www.npmjs.com/package/cz-conventional-changelog)

## 🎨 Default Commit Types

| type     | emoji | description                                                                                     |
|----------|-------|-------------------------------------------------------------------------------------------------|
| feat     | ✨     | A new feature                                                                                   |
| fix      | 🐛     | A bug fix                                                                                       |
| chore    | 🔧     | Changes that do not modify src or test files                                                    |
| refactor | 🧹     | Changes that neither fix a bug nor add a feature (renaming variable, file structure changes...) |
| style    | 💄     | Changes that do not affect the meaning of the code (white-space, formatting, semi-colons...)    |
| test     | ✅     | Adding missing tests or correcting existing tests                                               |
| perf     | ⚡️     | Changes that improves performance                                                               |
| docs     | 📝     | Documentation only changes                                                                      |
| ci       | 👷     | Changes to CI config files and scripts                                                          |
| build    | 🔨     | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm) |
| revert   | ⏪     | Reverts a previous commit                                                                       |
| break    | 💥     | A breaking change (alias to feat)                                                               |
| init     | 🎉     | Initial commit (alias to feat)                                                                  |

## 🔨 Usage (globally installed commitizen)

1. Install commitizen

```bash
# npm
npm install -g commitizen
# yarn
yarn global add commitizen
```

2. Initialize cz-cc adaptor

```bash
# npm
commitizen init cz-cc
# yarn
commitizen init cz-cc --yarn
```

3. Start commitizen CLI

```bash
cz
```

## 🔨 Usage (locally installed commitizen)

1. Install commitizen & cz-cc

```bash
# npm
npm install -D commitizen cz-cc
# yarn
yarn add -D commitizen cz-cc
```

2. Add following config to `package.json`

```json5
{
  // ...
  "scripts": {
    // ...
    "commit": "cz"
  },
  // ...
  "config": {
    "commitizen": {
      "path": "cz-cc"
    }
  }
}
```
    
3. Start commitizen CLI

```bash
# npm
npm run commit
# yarn
yarn run commit
```

## ⚙️ Configuration

cz-cc fully supports the configurations of [cz-conventional-changelog](https://www.npmjs.com/package/cz-conventional-changelog).

Additionally, the native configuration options of cz-zz are as follows:

```json5
{
  // ... package.json
  "config": {
    // Default configurations:
    "commitizen": {
      // ...
      // Set to `false` to disable emoji.
      "useEmoji": true,
      // If `true`, whenever commit includes a breaking change, an exclamation mark will be inserted before the colon in commit header.
      // @example feat(core)!: replace algorithm entirely
      "useExclamationMark": false,
      // Maximum amount of characters allowed in the commit header.
      // @note Default to 50/72 formatting style.
      "maxHeaderLength": 50,
      // Maximum amount of characters per line in the commit body and commit footer(s).
      // @note Default to 50/72 formatting style.
      "maxLineLength": 72,
      // Minimal amount of characters allowed for the commit subject.
      "minSubjectLength": 4,
      // Questions to be prompted, remove key to disable that question.
      "questions": ["type", "scope", "subject", "body", "breaking", "issues"],
      // Types to be presented in the default selection list (the list before user enters any search input).
      "defaultTypes": ["feat", "fix", "chore", "refactor", "style", "test", "perf", "docs", "ci", "build", "break"],
      // Scopes to be presented in the selection list.
      // @note Empty array will prompts an input, allows user to enter any string as value of the scope.
      "scopes": [],
      // All available types for user selection.
      // @note The entries that are not part of the `defaultTypes` will be presented when user searches for the entry key.
      "types": {
        // ...
        "init": {
          "emoji": "🎉",
          "value": "feat",
          "description": "Initial commit (alias to feat)"
        },
        "fix": {
          "emoji": "🐛",
          "value": "fix",
          "description": "A bug fix"
        }
        // ...
      }
    }
  }
}
```

## 📜 License

[Apache License 2.0](/LICENSE)
