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
  username: string | null,
  displayName: string | null,
  id: string | null,
  token: string | null
}