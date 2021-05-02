import { string } from "prop-types"

export interface LoginData {
  username: string,
  password: string
}

export interface RegisterData {
  username: string,
  password: string,
  displayName: string,
  email: string,
}

export interface GroupCreationData {
  bookTitle: string | null,
  bookAuthor: string | null,
  bookYear: number | null,
  bookIsbn: string | null,
  bookPageCount: number | null,
  bookOLID: string | null
}

export interface UserObject {
  username: string,
  displayName: string,
  id: string,
  token: string
}

// What the API returns for other users' info
export interface User {
  id: string,
  displayName: string,
  email: string,
  nameColor: string,
  createdAt: Date,
  updatedAt: Date
}

// What non-members can see
export interface NonMemberGroup {
  id: string,
  bookTitle: string,
  bookAuthor: string,
  bookYear: number,
  bookIsbn: string,
  bookOLID: string,
  bookPageCount: number,
  createdAt: Date,
  updatedAt: Date,
  AdminID: string,
  members: Array<User>
}

// What members can see
export interface MemberGroup extends NonMemberGroup {
  posts: Array<ParentPost>
}

export interface Post {
  id: string,
  text: string,
  createdAt: Date,
  updatedAt: Date,
  GroupId: string,
  UserId: string
}

export interface ReplyPost extends Post {
  parent: string
}

export interface ParentPost extends Post {
  title: string,
  replies: Array<ReplyPost>
}