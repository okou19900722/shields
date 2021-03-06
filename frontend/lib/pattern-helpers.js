import pathToRegexp from 'path-to-regexp'

// Given a patternToRegex `pattern` with multiple-choice options like
// `foo|bar|baz`, return an array with the options. If it can't be described
// as multiple-choice options, return `undefined`.
const basicChars = /^[A-za-z0-9-]+$/
export function patternToOptions(pattern) {
  const split = pattern.split('|')
  if (split.some(part => !part.match(basicChars))) {
    return undefined
  } else {
    return split
  }
}

// Removes regexp for named parameters.
export function removeRegexpFromPattern(pattern) {
  const tokens = pathToRegexp.parse(pattern)
  const simplePattern = tokens
    .map(token => {
      if (typeof token === 'string') {
        return token
      } else {
        const { delimiter, optional, repeat, name, pattern } = token
        if (typeof name === 'number') {
          return `${delimiter}(${pattern})`
        } else {
          let modifier = ''
          if (optional && !repeat) {
            modifier = '?'
          } else if (!optional && repeat) {
            modifier = '+'
          } else if (optional && repeat) {
            modifier = '*'
          }
          return `${delimiter}:${name}${modifier}`
        }
      }
    })
    .join('')
  return simplePattern
}
