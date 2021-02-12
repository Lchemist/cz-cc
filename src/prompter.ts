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

// @ts-ignore
import { configLoader } from 'commitizen'
// @ts-ignore
import autocompletePrompt from 'inquirer-autocomplete-prompt'
import chalk from 'chalk'
import wrap from 'word-wrap'
import defaultConfig from './config'

type Config = Omit<Partial<typeof defaultConfig>, 'scopes'> & {
  scopes: string[]
  disableScopeLowerCase?: boolean
  disableSubjectLowerCase?: boolean
  maxHeaderWidth?: number
  maxLineWidth?: number
  defaultType?: string
  defaultScope?: string
  defaultSubject?: string
  defaultBody?: string
  defaultIssues?: string
}

type Answers = {
  type: keyof typeof defaultConfig.types
  scope?: string
  subject: string
  body?: string
  isBreaking: boolean
  breakingBody?: string
  breaking?: string
  isIssueAffected: boolean
  issuesBody?: string
  issues?: string
}

// Compatibility support for cz-conventional-changelog
const {
  CZ_TYPE,
  CZ_SCOPE,
  CZ_SUBJECT,
  CZ_BODY,
  CZ_ISSUES,
  DISABLE_SCOPE_LOWERCASE,
  DISABLE_SUBJECT_LOWERCASE,
  CZ_MAX_HEADER_WIDTH,
  CZ_MIN_SUBJECT_LENGTH,
  CZ_MAX_LINE_WIDTH,
} = process.env

const config: Config = configLoader.load() ?? {}

const options = {
  useEmoji: config.useEmoji ?? defaultConfig.useEmoji,
  useExclamationMark: config.useExclamationMark ?? defaultConfig.useExclamationMark,
  questions: config.questions ?? defaultConfig.questions,
  defaultTypes: config.defaultTypes ?? defaultConfig.defaultTypes,
  scopes: config.scopes ?? defaultConfig.scopes,
  types: config.types ?? defaultConfig.types,
  defaultType: CZ_TYPE ?? config.defaultType,
  defaultScope: CZ_SCOPE ?? config.defaultScope,
  defaultSubject: CZ_SUBJECT ?? config.defaultSubject,
  defaultBody: CZ_BODY ?? config.defaultBody,
  defaultIssues: CZ_ISSUES ?? config.defaultIssues,
  disableScopeLowerCase: DISABLE_SCOPE_LOWERCASE ?? config.disableScopeLowerCase,
  disableSubjectLowerCase: DISABLE_SUBJECT_LOWERCASE ?? config.disableSubjectLowerCase,
  /** Max amount of characters in commit header message. */
  maxHeaderWidth: CZ_MAX_HEADER_WIDTH ? parseInt(CZ_MAX_HEADER_WIDTH) : config.maxHeaderLength ?? config.maxHeaderWidth ?? defaultConfig.maxHeaderLength,
  minSubjectLength: CZ_MIN_SUBJECT_LENGTH ? parseInt(CZ_MIN_SUBJECT_LENGTH) : config.minSubjectLength ?? defaultConfig.minSubjectLength,
  /** Amount of characters per line in commit body & footer(s). Exceeding characters will be wrapped into new line. */
  maxLineWidth: CZ_MAX_LINE_WIDTH ? parseInt(CZ_MAX_LINE_WIDTH) : config.maxLineLength ?? config.maxLineWidth ?? defaultConfig.maxLineLength
}

const getTypeListWidth = (typeList: string[]) => {
  let longestLength = 0
  typeList.forEach(str => {
    if (str.length > longestLength) longestLength = str.length
  })
  return longestLength + 2
}

const getMaxSubjectLength = (type: Answers['type'], scope: Answers['scope']) =>
  options.maxHeaderWidth - type.length - 2 - (scope ? scope.length + 2 : 0) - (options.useEmoji ? 2 : 0)

const processSubject = (text: string) => {
  const trimmedSubject = text.replace(/(^[\s]+|[\s\.]+$)/g, '')
  if (!trimmedSubject) return ''
  return options.disableSubjectLowerCase ? trimmedSubject : `${trimmedSubject[0].toLowerCase()}${trimmedSubject.slice(1)}`
}

const questions = [
  {
    when: options.questions.includes('type'),
    type: 'autocomplete',
    name: 'type',
    message: "Select the type of change that you are committing:",
    source: (_: unknown, input: string) => Object.entries(options.types)
      .filter(([key]) => input ? key.includes(input) : Array.isArray(options.defaultTypes) ? options.defaultTypes.includes(key) : true)
      .map(([key, { emoji, value, description }]) => ({
        name: `${(key + ':').padEnd(getTypeListWidth(Object.keys(options.types)))} ${options.useEmoji ? emoji + ' ' : ''}${description}`,
        value: key,
        short: `${value}${options.useEmoji ? ' ' + emoji : ''}`
      })),
    default: options.defaultType
  },
  options.scopes?.length > 0 ? {
    type: 'autocomplete',
    name: 'scope',
    message: "Select the scope of change that you are committing:",
    source: (_: unknown, input: string) => input ? options.scopes?.filter(key => key.includes(input)) : options.scopes,
    default: options.defaultScope,
    when: options.questions.includes('scope'),
  } : {
    type: 'input',
    name: 'scope',
    message: `What is the scope of this change (e.g. component or file name): ${chalk.gray('[press enter to skip]')}\n`,
    default: options.defaultScope,
    filter: (scope: string) => options.disableScopeLowerCase ? scope?.trim() : scope?.trim().toLowerCase(),
    when: options.questions.includes('scope'),
    transformer: (scope: string) => ` ${chalk.cyan(scope)}`
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Write a short, imperative tense description of the change:',
    default: options.defaultSubject,
    validate: (subject: string, answers: Answers) => {
      const processedSubject = processSubject(subject)
      if (processedSubject.length === 0) return chalk.red('[ERROR] subject is required')
      if (processedSubject.length < options.minSubjectLength)
        return chalk.red(`[ERROR] subject length must be greater than or equal to ${options.minSubjectLength} characters`)
      const maxSubjectLength = getMaxSubjectLength(answers.type, answers.scope)
      if (processedSubject.length > maxSubjectLength)
        return chalk.red(`[ERROR] subject length must be less than or equal to ${maxSubjectLength} characters`)
      return true
    },
    transformer: (subject: string, answers: Answers) => {
      const { minSubjectLength } = options
      const subjectLength = subject.length
      const maxSubjectLength = getMaxSubjectLength(answers.type, answers.scope)
      let tooltip
      if (subjectLength < minSubjectLength) tooltip = `${minSubjectLength - subjectLength} more chars needed`
      else if (subjectLength > maxSubjectLength) tooltip = `${subjectLength - maxSubjectLength} chars over the limit`
      else tooltip = `${maxSubjectLength - subjectLength} more chars allowed`
      const tooltipColor = (subjectLength >= minSubjectLength && subjectLength <= maxSubjectLength) ? chalk.gray : chalk.red
      const subjectColor = (subjectLength >= minSubjectLength && subjectLength <= maxSubjectLength) ? chalk.cyan : chalk.red

      return `${tooltipColor.bold('[' + tooltip + ']')}\n  ${subjectColor(subject)}`
    },
    filter: (subject: string) => processSubject(subject),
    when: options.questions.includes('subject'),
  },
  {
    type: 'input',
    name: 'body',
    message: `Provide a longer description of the change: ${chalk.gray('[press enter to skip]')}\n`,
    default: options.defaultBody,
    when: options.questions.includes('body'),
    transformer: (body: string) => ` ${chalk.cyan(body)}`
  },
  {
    type: 'list',
    name: 'isBreaking',
    message: 'Are there any breaking changes?',
    choices: [{ name: 'NO', value: false }, { name: 'YES', value: true }],
    default: (answers: Answers) => answers.type === 'break',
    when: options.questions.includes('breaking'),
  },
  {
    type: 'input',
    name: 'breakingBody',
    message: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
    validate: (breakingBody: string) => {
      const bodyLength = breakingBody.trim().length
      if (bodyLength === 0) return chalk.red('[ERROR] body is required for BREAKING CHANGE')
      return true
    },
    when: (answers: Answers) => answers.isBreaking && !answers.body,
    transformer: (body: string) => ` ${chalk.cyan(body)}`
  },
  {
    type: 'input',
    name: 'breaking',
    message: 'Describe the breaking changes:\n',
    when: (answers: Answers) => answers.isBreaking,
    transformer: (footer: string) => ` ${chalk.cyan(footer)}`
  },

  {
    type: 'list',
    name: 'isIssueAffected',
    message: 'Does this change affect any open issues?',
    choices: [{ name: 'NO', value: false }, { name: 'YES', value: true }],
    default: options.defaultIssues,
    when: options.questions.includes('issues'),
  },
  {
    type: 'input',
    name: 'issuesBody',
    message: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
    when: (answers: Answers) => answers.isIssueAffected && !answers.body && !answers.breakingBody,
    transformer: (body: string) => ` ${chalk.cyan(body)}`
  },
  {
    type: 'input',
    name: 'issues',
    message: 'Add issue references (e.g. "fix #123", "refer #123".):\n',
    default: options.defaultIssues ?? undefined,
    when: (answers: Answers) => answers.isIssueAffected,
    transformer: (body: string) => ` ${chalk.cyan(body)}`,
  }
]

const prompter = (
  cz: { 
    registerPrompt: (type: string, plugin: unknown) => void
    prompt: (qs: typeof questions) => Promise<Answers>
  },
  commit: (message: string) => void
) => {
  cz.registerPrompt('autocomplete', autocompletePrompt)
  cz.prompt(questions)
    .then(({ type, scope, subject, body, breaking, breakingBody, issues, issuesBody }) => {
      const message = []
      const wrapOptions = {
        width: options.maxLineWidth,
        indent: '',
        trim: true,
      }
      const { value: typeValue, emoji } = options.types[type]
      message.push(`${typeValue}${scope ? '(' + scope + ')' : ''}${(breaking && options.useExclamationMark) ? '!' : ''}: ${options.useEmoji ? emoji + ' ' : ''}${subject}`)
      if (body) message.push(wrap(body, wrapOptions))
      else if (breakingBody) message.push(wrap(breakingBody, wrapOptions))
      else if (issuesBody) message.push(wrap(issuesBody, wrapOptions))
      if (breaking) message.push(wrap(`BREAKING CHANGE: ${breaking.trim().replace(/^BREAKING CHANGE: /g, '')}`, wrapOptions))
      if (issues) message.push(wrap(issues, wrapOptions))
      commit(message.join('\n\n'))
    })
}

export default prompter