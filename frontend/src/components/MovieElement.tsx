import { useEffect, useState } from 'react';
import Movie from '../types/Movie';
import { useAuthContext } from '../hooks/contextsHooks/useAuthContext';
import { useUserMoviesContext } from '../hooks/contextsHooks/useUserMoviesContext';

type props = {
  key: number,
  movie: Movie,
  rating: number,
  addDate: Date
}

const MovieElement = (props: props) => {
  const [ error, setError ] = useState("")
  const { state: userState } = useAuthContext()
  const { dispatch } = useUserMoviesContext()
  const { movie, addDate } = props
  const [ rating, setRating ] = useState(props.rating)
  const [ disableEdit, setDisableEdit ] = useState(true)
  const overviewMaxLength = window.innerWidth/5 // la lunghezza della descrizione troncata così dipende dalla dimensione dello schermo

  // quando cambio il rating, devo aggiornare il rating che mi viene passato da props
  // variabile creata con useState non si aggiorna in automatico se dipende da props
  useEffect(() => { 
    setRating(props.rating)
  }, [props.rating])

  // function per rimuovere un film (lo rimuove dalla watchlist dell'utente + il suo rating dal film, globale)
  const removeMovie = async() => {
    let movieId = movie._id
    setError("")
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/delete-movie/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userState.user?.access_token}`,
        'Content-Type': 'application/json'
      },
    })
    const json = await response.json()

    if(!response.ok) {
      setError(json.message)
      return
    }
    if(response.ok) {
      dispatch({type: 'REMOVE', payload: json})
    }
  }

    // function per modificare il rating di un film (lo modifica sia nella watchlist dell'utente, sia globalmente nel film)
    const editRating = async() => {
    let movieId = movie._id
    setError("")
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/edit-movie/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userState.user?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({newRating: rating})
    })
    const json = await response.json()

    if(!response.ok) {
      setError(json.message)
      return
    }
    if(response.ok) {
      dispatch({type: 'EDIT', payload: json})
    }
  }

  return (
    <>
      { /* Movie info */}
      <div className="d-flex w-100 gap-3 p-sm-3 p-2 border rounded film-entry" aria-current="true" data-bs-toggle="modal" data-bs-target={`#movie-${movie._id}`}>
        {movie.image_url && <img src={`${import.meta.env.VITE_MOVIEDB_IMG_URL}${movie.image_url}`} alt="Movie poster" width="" height="120" className="align-self-center" />}
        <div className="d-flex flex-column gap-1 w-100">
            <div className="d-flex flex-column flex-sm-row w-100 gap-1 justify-content-between align-items-sm-center">
              <h6 className="mb-0">{movie.title}</h6>
              <h6 className="mb-0 text-success text-nowrap">{`My Rating: ${props.rating}`}</h6>
            </div>
            <div className="d-flex flex-column flex-sm-row w-100 gap-1 justify-content-between align-items-sm-center">
              <small className=" mb-0 opacity-50 text-nowrap">{`Released: ${movie.release_date}`}</small>
              <small className="opacity-50 text-nowrap">{`Watched: ${`${addDate.getFullYear()}-${addDate.getMonth()}-${addDate.getDate()}`}`}</small>
            </div>
            <p className="mb-0 opacity-75 text-wrap">{movie.overview!.length > overviewMaxLength ? movie.overview?.substring(0, overviewMaxLength)+"..." : movie.overview}</p>
            {error && <span className="text-danger">{error}</span>}
        </div>
      </div>

      {/* Modal for edit */}
      <div className="modal fade" id={`movie-${movie._id}`} tabIndex={-1} aria-labelledby="optionsMovieModal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Remove or edit rating</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-sm-3 p-2">
              <div className="d-flex flex-column p-sm-3 p-2 gap-3 border rounded">
                <div className="d-flex gap-sm-3 gap-1 text-center" aria-current="true">
                  {movie.image_url && <img src={`${import.meta.env.VITE_MOVIEDB_IMG_URL}${movie.image_url}`} alt="Movie poster" width="80" height="120" className="flex-shrink-0" />}
                  <div className="d-flex flex-column w-100 justify-content-between">
                    <h6 className="mb-0">{movie.title}</h6>
                    <small className="opacity-50 text-nowrap">{movie.release_date}</small>
                    <h6 className="mb-0 text-success text-nowrap">{`My Rating: ${props.rating}`}</h6>
                    <div className="rating" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRating(+e.target.value); setDisableEdit(false) }}>
                      <input type="radio" name="rating" value="5" id={`movie-${movie._id}-rating-5`} /><label htmlFor={`movie-${movie._id}-rating-5`}>☆</label>
                      <input type="radio" name="rating" value="4" id={`movie-${movie._id}-rating-4`} /><label htmlFor={`movie-${movie._id}-rating-4`}>☆</label>
                      <input type="radio" name="rating" value="3" id={`movie-${movie._id}-rating-3`} /><label htmlFor={`movie-${movie._id}-rating-3`}>☆</label>
                      <input type="radio" name="rating" value="2" id={`movie-${movie._id}-rating-2`} /><label htmlFor={`movie-${movie._id}-rating-2`}>☆</label>
                      <input type="radio" name="rating" value="1" id={`movie-${movie._id}-rating-1`} /><label htmlFor={`movie-${movie._id}-rating-1`}>☆</label>
                    </div>
                    {error && <span className="text-danger">{error}</span>}                    
                  </div>
                </div>
                <p className="mb-0 opacity-75 text-wrap text-start">{movie.overview}</p>
              </div>
            </div>
            <div className="modal-footer gap-2">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={removeMovie}>Remove</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss={disableEdit ? "" : "modal"} onClick={editRating} disabled={disableEdit}>Edit rating</button>
            </div>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default MovieElement