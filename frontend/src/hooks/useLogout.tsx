import { useAuthContext } from "./contextsHooks/useAuthContext"
import { useUserMoviesContext } from "./contextsHooks/useUserMoviesContext"

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: userMovieDispatch } = useUserMoviesContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action, empty all contexts
    dispatch({ type: 'LOGOUT' })
    userMovieDispatch({type: 'SET', payload: []})
  }

  return {logout}
}