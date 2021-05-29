import { Request } from 'express'

export interface ReplyObject {
  parent: string,
  text: string
}

export interface RequestWithToken extends Request {
  token: string | null
}

export interface NewScheduledPost {
  id: string,
  title: string,
  text: string,
  createdAt: Date,
  updatedAt: Date,
  UserId: string,
  GroupId: string
}

// Missing the passwordHash and email properties so the
// frontend can safely request the info of other users
export interface SanitizedUser {
  id: string,
  username: string,
  displayName: string,
  createdAt: Date,
  nameColor: string
}