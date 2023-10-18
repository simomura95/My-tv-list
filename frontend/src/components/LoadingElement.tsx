const LoadingElement = () => {
  return (
    <div>
      <button className="btn btn-primary mb-3" type="button" disabled>
        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Loading...</span>
      </button>
      <p>Loading lists could take a couple of minutes the first time</p>
    </div>
  )
}

export default LoadingElement