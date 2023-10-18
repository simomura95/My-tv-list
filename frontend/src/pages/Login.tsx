import { useState } from "react"
import { useLogin } from "../hooks/useLogin"

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <div className='form-signin w-100 m-auto py-5'>
      <form className='login' onSubmit={handleSubmit}>
        <h1>Log in</h1>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            id="usernameInput"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <label htmlFor="usernameInput">Username</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            id="passwordInput"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-100 py-2 mt-3">Log in</button>
        {isLoading && <div>Login could take a couple of minutes the first time</div>}
        {error && <div className="text-danger">{error}</div>}
      </form>
    </div>
  )
}

export default Login