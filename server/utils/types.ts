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