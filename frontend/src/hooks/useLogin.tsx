import { useState } from "react";
import { useAuthContext } from "./contextsHooks/useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {dispatch} = useAuthContext()

  const login = async(username: string, password: string) => {
    setIsLoading(true)
    setError("")

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    })
    const json = await response.json()

    if(!response.ok) {
      setIsLoading(false)
      setError(json.message)
    }
    if(response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}