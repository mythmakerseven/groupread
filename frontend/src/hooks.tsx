import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from './store'

// See https://stackoverflow.com/questions/67531937/redux-toolkit-dispatching-thunk-type-missing
// The lack of a proper return type seems to be a bug with Redux Toolkit.

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector