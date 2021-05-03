import remark from 'remark'
import html from 'remark-html'
import {
  User
} from '../types'

export const parseMarkdown = async (text: String): Promise<String> => {
  // remark-html sanitizes on its own, no need for another plugin
  const parsedText = await remark()
    .use(html)
    .process(text)
  
  return parsedText.toString()
}

export const getDisplayName = (userID: string, groupMembers: Array<User>) => {
  const userMatch = groupMembers.find(m => m.id === userID)
  if (!userMatch) return 'unknown'
  return userMatch.displayName
}

export default {
  parseMarkdown,
  getDisplayName
}