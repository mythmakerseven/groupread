import express from 'express'

export interface ReplyObject {
  parent: string,
  text: string
}

export interface RequestWithToken extends express.Request {
  token: string | null
}