import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/contextsHooks/useAuthContext'

function Navbar() {
  const { logout } = useLogout()
  const { state } = useAuthContext()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navbar bg-dark-subtle navbar-expand-sm" aria-label="Navbar"> {/* data-bs-theme="dark" */}
      <div className="container-fluid">
        <Link className="navbar-brand ms-sm-2" to="/">MyWatchList</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          {state.user && 
                <span className="navbar-text ms-sm-auto ms-4 username-navbar">{state.user.username}</span>
          }
          <ul className={`navbar-nav me-sm-2 my-2 my-sm-0 ${!state.user ? "ms-auto" : ""}`}>
            {!state.user && (
              <>
              <li className="nav-item">
                <Link className="nav-link ms-sm-auto ms-4" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link ms-4" to="/register">Register</Link>
              </li>
              </>
            )}
            {state.user && (
              <li className="nav-item">
                <button className="nav-link ms-4 border rounded" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar