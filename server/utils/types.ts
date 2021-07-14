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

export interface GroupObject {
  id: string,
  bookTitle: string,
  bookAuthor: string,
  bookYear: number,
  bookIsbn: string,
  bookOLID: string,
  bookPageCount: string,
  AdminId: string,
  createdAt: Date,
  updatedAt: Date
}

export interface PostWithUser extends PostObject {
  User: UserObject
}

export interface SanitizedPostWithUser extends PostObject {
  User: SanitizedUser
}

export interface GroupWithMembers extends GroupObject {
  Users: SanitizedUser[]
}

export interface ReplyObject {
  parent: string,
  text: string
}

export type RequestWithToken = Request & {
  token?: string
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