import { Request } from 'express'

export interface UserObject {
  id: string,
  username: string,
  displayName: string,
  passwordHash: string,
  email: string,
  nameColor: string
}

export interface PostObject {
  id: string,
  parent: string,
  title: string,
  text: string,
  createdAt: Date,
  updatedAt: Date,
  GroupId: string,
  UserId: string,
  replies: PostObject[] | null
}

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
export type SanitizedUser = Omit<UserObject, 'passwordHash' | 'email'>