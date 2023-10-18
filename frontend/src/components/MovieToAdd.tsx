import { useEffect, useState } from "react";
import { useUserMoviesContext } from "../hooks/contextsHooks/useUserMoviesContext";
import Movie from "../types/Movie"
import { useAuthContext } from "../hooks/contextsHooks/useAuthContext";

type props = {
  key: number;
  movie: Movie
}

const MovieToAdd = (props: props) => {
  const { state, dispatch } = useUserMoviesContext()
  const { state: userState } = useAuthContext()
  const [ error, setError ] = useState("")
  const [ movieIsPresent, setMovieIsPresent ] = useState(state.watchlist.some(userMovie => userMovie.movie._id === props.movie._id))
  const [ rating, setRating ] = useState(0)
  const { _id, title, overview, release_date, image_url, moviedb_id, ratings } = props.movie
  const overviewMaxLength = window.innerWidth/5 // la lunghezza della descrizione troncata così dipende dalla dimensione dello schermo

  useEffect(() => {
    setMovieIsPresent(state.watchlist.some(userMovie => userMovie.movie._id === props.movie._id))
  }, [props.movie])

  const addMovieUser = async() => {
    setError("")
    let movieId: string = _id
    if (rating < 1 || rating > 5) {
      setError('Select a rating')
      return
    }

    // se l'ho recuperato da movieDB, devo prima aggiungerlo al mio db locale
    if (!movieId) { 
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/movies`, {
        method: 'POST',
        headers: {
          // 'Authorization': `Bearer ${userState.user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          overview: overview,
          release_date: release_date,
          image_url: image_url,
          moviedb_id: moviedb_id
        }) // da moviedb
      })
      const json = await response.json()
  
      if(!response.ok) {
        setError(json.message)
        return
      }
      if(response.ok) {
        movieId = json._id
      }  
    }
    
    // aggiungo il film alla watchlist dell'utente, con il rating
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/add-movie/${movieId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userState.user?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({rating})
    })
    const json = await response.json()
    json.addDate = new Date(json.addDate)

    if(!response.ok) {
      setError(json.message)
      return
    }
    if(response.ok) {
      dispatch({type: 'ADD', payload: json})
      setMovieIsPresent(true)
    }
  }

  return (
    <div className="d-flex flex-column p-sm-3 p-2 gap-3 border rounded">
      {/* Scheda del film */}
      <div className="d-flex w-100 gap-3" aria-current="true">
        {image_url && <img src={`${import.meta.env.VITE_MOVIEDB_IMG_URL}${image_url}`} alt="Movie poster" width="" height="120" className="align-self-center" />}
        <div className="d-flex flex-column gap-1 w-100">
          <div className="d-flex flex-column flex-sm-row w-100 gap-1 justify-content-between align-items-sm-center">
            <h6 className="mb-0 me-sm-auto">{title}</h6>
            {ratings && ratings.length > 0 && <h6 className="mb-0 text-success text-nowrap">{`Global rating: ${ratings.reduce((a, b) => a + b, 0) / ratings.length}`}</h6>}
          </div>
          <small className="opacity-50 text-nowrap">{release_date}</small>
        <p className="mb-0 opacity-75 text-wrap">{overview!.length > overviewMaxLength ? overview?.substring(0, overviewMaxLength)+"..." : overview}</p>
        {error && [5,4,3,2,1].includes(rating) && <span className="text-danger">{error}</span>} {/* per non propagare l'errore in caso di rating mancante */}
        </div>
      </div>

        {/* Bottone e modale per aggiungere il film */}
        {!movieIsPresent &&           
            <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target={`#movie-${moviedb_id}`}>Add</button>}

            <div className="modal fade" id={`movie-${moviedb_id}`} tabIndex={-1} aria-labelledby="addMovieModal" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">Add movie</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body p-sm-3 p-2">
                    <div className="d-flex flex-column p-sm-3 p-2 gap-3 border rounded">
                      <div className="d-flex gap-sm-3 gap-1 text-center" aria-current="true">
                        {image_url && <img src={`${import.meta.env.VITE_MOVIEDB_IMG_URL}${image_url}`} alt="Movie poster" width="80" height="120" />}
                        <div className="d-flex flex-column w-100 justify-content-between">
                          <h6 className="mb-0">{title}</h6>
                          <small className="opacity-50 text-nowrap">{release_date}</small>
                          {ratings && ratings.length > 0 && <span className="mb-0 text-success text-nowrap">{`Global rating: ${ratings.reduce((a, b) => a + b, 0) / ratings.length}`}</span>}
                          <div className="rating" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setRating(+e.target.value); setError('')}}>
                            <input type="radio" name="rating" value="5" id={`movie-${moviedb_id}-rating-5`} /><label htmlFor={`movie-${moviedb_id}-rating-5`}>☆</label>
                            <input type="radio" name="rating" value="4" id={`movie-${moviedb_id}-rating-4`} /><label htmlFor={`movie-${moviedb_id}-rating-4`}>☆</label>
                            <input type="radio" name="rating" value="3" id={`movie-${moviedb_id}-rating-3`} /><label htmlFor={`movie-${moviedb_id}-rating-3`}>☆</label>
                            <input type="radio" name="rating" value="2" id={`movie-${moviedb_id}-rating-2`} /><label htmlFor={`movie-${moviedb_id}-rating-2`}>☆</label>
                            <input type="radio" name="rating" value="1" id={`movie-${moviedb_id}-rating-1`} /><label htmlFor={`movie-${moviedb_id}-rating-1`}>☆</label>
                          </div>
                          {error && <span className="text-danger">{error}</span>}
                        </div>
                      </div>
                      <p className="mb-0 opacity-75 text-wrap">{overview}</p>
                    </div>
                  </div>


                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss={[5,4,3,2,1].includes(rating) ? "modal" : ""} onClick={addMovieUser}>Add</button>
                  </div>
                </div>
              </div>
            </div>
          
        { movieIsPresent && 
          <button className="btn btn-info disabled">Already added</button>}
  </div>
  )
}

export default MovieToAdd