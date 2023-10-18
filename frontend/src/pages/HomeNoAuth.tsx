import { Link } from "react-router-dom"

const HomeNoAuth = () => {
  return (
    <div className="px-4 py-5 my-5 text-center">
      <h1 className="display-5 fw-bold text-body-emphasis">MyWatchList</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">Keep track and rate all films as you watch them</p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Link className="btn btn-primary btn-lg px-4 gap-3" to="/register">Register</Link>
          <Link className="btn btn-outline-secondary btn-lg px-4" to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default HomeNoAuth