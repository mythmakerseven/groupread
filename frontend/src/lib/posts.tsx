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

// TODO: deprecated function, do not use for new stuff
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