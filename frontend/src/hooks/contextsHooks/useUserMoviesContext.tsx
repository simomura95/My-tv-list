import { UserMoviesContext } from "../../context/UserMoviesContext"
import { useContext } from "react"

export const useUserMoviesContext = () => {
  const context = useContext(UserMoviesContext)

  if(!context) {
    throw Error('useUserMoviesContext must be used inside a UserMoviesContextProvider')
  }

  return context
}