import remark from 'remark'
import html from 'remark-html'

export const parseMarkdown = async (text: String): Promise<String> => {
  // remark-html sanitizes on its own, no need for another plugin
  const parsedText = await remark()
    .use(html)
    .process(text)
  
  return parsedText.toString()
}

export const getDisplayName = (userID, groupMembers) => {
  const userMatch = groupMembers.find(m => m.id === userID)
  if (!userMatch) return 'unknown'
  return userMatch.displayName
}

export default {
  parseMarkdown,
  getDisplayName
}