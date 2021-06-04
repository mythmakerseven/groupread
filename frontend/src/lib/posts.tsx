import remark from 'remark'
import html from 'remark-html'
import {
  User
} from '../types'

export const parseMarkdown = async (text: string): Promise<string> => {
  // remark-html sanitizes on its own, no need for another plugin
  const parsedText = await remark()
    .use(html)
    .process(text)

  return parsedText.toString()
}

// TODO: How about an array called knownUsers stored in the redux state,
// so getting a list of users adds them to the list, so this function would
// then be able to look up names through that instead of needing the
// groupMembers argument
export const getDisplayName = (userID: string, groupMembers: Array<User>): string => {
  const userMatch = groupMembers.find(m => m.id === userID)

  // This condition should never fire, but that will change if the ability to leave groups is added
  // see https://github.com/mythmakerseven/groupread/issues/44
  if (!userMatch) return 'unknown'

  return userMatch.displayName
}

export const truncate = (text: string): string => {
  return (text.length > 80)
    ? `${text.substring(0, 80)}...`
    : text
}

export default {
  parseMarkdown,
  getDisplayName,
  truncate
}