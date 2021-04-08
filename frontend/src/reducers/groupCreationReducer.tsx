import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GroupCreationState {
  bookTitle: string | null,
  bookAuthor: string | null,
  bookYear: number | null,
  bookIsbn: string | null,
  bookOLID: string | null
}

export const initialState = {
  bookTitle: null,
  bookAuthor: null,
  bookYear: null,
  bookIsbn: null,
  bookOLID: null
} as GroupCreationState

const groupCreationSlice = createSlice({
  name: 'groupCreationForm',
  initialState,
  reducers: {
    formUpdateTitle(state, action: PayloadAction<string>) {
      state.bookTitle = action.payload
    },
    formUpdateAuthor(state, action: PayloadAction<string>) {
      state.bookAuthor = action.payload
    },
    formUpdateYear(state, action: PayloadAction<number>) {
      state.bookYear = action.payload
    },
    formUpdateIsbn(state, action: PayloadAction<string>) {
      state.bookIsbn = action.payload
    },
    formUpdateOLID(state, action: PayloadAction<string>) {
      state.bookOLID = action.payload
    }
  }
})

export const { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } = groupCreationSlice.actions

export default groupCreationSlice.reducer

export const groupFormSelector = (state: { groupCreationStore: GroupCreationState }): GroupCreationState => state.groupCreationStore