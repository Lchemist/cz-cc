/*!
Copyright 2021 Yusipeng Xuan

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export default Object.freeze({
  useEmoji: true,
  useExclamationMark: false,
  maxHeaderLength: 50,
  minSubjectLength: 4,
  maxLineLength: 72,
  questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues'],
  defaultTypes: ['feat', 'fix', 'chore', 'refactor', 'style', 'test', 'perf', 'docs', 'ci', 'build', 'break'],
  scopes: [],
  types: {
    feat: {
      emoji: '✨',
      value: 'feat',
      description: 'A new feature',
    },
    fix: {
      emoji: '🐛',
      value: 'fix',
      description: 'A bug fix',
    },
    chore: {
      emoji: '🔧',
      value: 'chore',
      description: 'Changes that do not modify src or test files',
    },
    refactor: {
      emoji: '🧹',
      value: 'refactor',
      description: 'Changes that neither fix a bug nor add a feature (renaming variable, file structure changes...)',
    },
    style: {
      emoji: '💄',
      value: 'style',
      description: 'Changes that do not affect the meaning of the code (white-space, formatting, semi-colons...)',
    },
    test: {
      emoji: '✅',
      value: 'test',
      description: 'Adding missing tests or correcting existing tests',
    },
    perf: {
      emoji: '⚡',
      value: 'perf',
      description: 'Changes that improves performance',
    },
    docs: {
      emoji: '📝',
      value: 'docs',
      description: 'Documentation only changes',
    },
    ci: {
      emoji: '👷',
      value: 'ci',
      description: 'Changes to CI config files and scripts',
    },
    build: {
      emoji: '🔨',
      value: 'build',
      description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    },
    break: {
      emoji: '💥',
      value: 'feat',
      description: 'A breaking change (alias to feat)',
    },
    init: {
      emoji: '🎉',
      value: 'feat',
      description: 'Initial commit (alias to feat)',
    },
    revert: {
      emoji: '⏪',
      value: 'revert',
      description: 'Reverts a previous commit',
    },
  }
})
