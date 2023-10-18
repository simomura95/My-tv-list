import { Link } from 'react-router-dom'

const AddMovieButton = () => {
  return (
      <Link className='btn btn-lg btn-primary me-sm-auto mb-sm-auto px-sm-5' to='/add'>Add movie</Link>
  )
}

export default AddMovieButton