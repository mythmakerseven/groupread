export interface LoginData {
  loginUsername: string,
  loginPassword: string
}

export interface RegisterData {
  registerUsername: string,
  registerPassword: string,
  registerDisplayName: string,
  registerEmail: string,
}

export interface GroupCreationData {
  bookTitle: string | null,
  bookAuthor: string | null,
  bookYear: number | null,
  bookIsbn: string | null,
  bookPageCount: number | null,
  bookOLID: string | null
}