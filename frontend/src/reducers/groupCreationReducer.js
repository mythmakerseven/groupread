const initialState = {
  bookTitle: '',
  bookAuthor: '',
  bookYear: '',
  bookIsbn: ''
}

export const formUpdateTitle = title => {
  return dispatch => {
    dispatch({
      type: 'FORM_UPDATE_TITLE',
      data: title
    })
  }
}

export const formUpdateAuthor = author => {
  return dispatch => {
    dispatch({
      type: 'FORM_UPDATE_AUTHOR',
      data: author
    })
  }
}

export const formUpdateYear = year => {
  return dispatch => {
    dispatch({
      type: 'FORM_UPDATE_YEAR',
      data: year
    })
  }
}

export const formUpdateIsbn = isbn => {
  return dispatch => {
    dispatch({
      type: 'FORM_UPDATE_ISBN',
      data: isbn
    })
  }
}

const groupCreationReducer = (state = initialState, action) => {
  switch(action.type) {
  case 'FORM_UPDATE_TITLE':
    return { ...state, bookTitle: action.data }
  case 'FORM_UPDATE_AUTHOR':
    return { ...state, bookAuthor: action.data }
  case 'FORM_UPDATE_YEAR':
    return { ...state, bookYear: action.data }
  case 'FORM_UPDATE_ISBN':
    return { ...state, bookIsbn: action.data }
  default:
    return state
  }
}

export default groupCreationReducer