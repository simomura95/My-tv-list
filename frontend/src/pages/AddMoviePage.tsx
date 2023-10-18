import { useState } from "react"
import Movie from "../types/Movie"
import MovieToAdd from "../components/MovieToAdd"
import MovieMovieDB from "../types/MovieMovieDB"

const AddMoviePage = () => {
  let movieArray: Movie[] = []
  const [ title, setTitle ] = useState("")
  const [ error, setError ] = useState("")
  const [ moviesFound, setMoviesFound ] = useState(movieArray)
  const [ enableMoviedbSearch, setEnableMoviedbSearch ] = useState(false)
  const [ allMoviesFetched, setAllMoviesFetched ] = useState(false)
  const [ moviedbPage, setMoviedbPage ] = useState(1)

  // function per trovare i film nel mio db, dato un titolo
  const findMovies = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/movies/title/${title}`, { // funziona anche con un titolo contenente spazi
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    const json = await response.json()

    if(!response.ok) {
      setError(json.message)
    }
    if(response.ok) {
      if (json.length === 0) {
        setError("No movie found in local database")
        setMoviesFound([])
      } else {
        // ordino per quantità di recensioni (=popolarità), e se pari, in ordine alfabetico
        const moviesFetched = json.sort((a: Movie, b: Movie) => {
          if (a.ratings.length !== b.ratings.length) {
            return a.ratings.length - b.ratings.length
          } else {
            return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1
          }
        })
        setMoviesFound(moviesFetched)
      }
      setEnableMoviedbSearch(true)
      setMoviedbPage(1)
      setAllMoviesFetched(false)
    }
  }

  // function per cercare altri film in MovieDB
  const searchMovieDB = async() => {
    setError("")
    
    const response = await fetch(`${import.meta.env.VITE_MOVIEDB_URL}/search/movie?query=${title}&include_adult=false&language=en-US&page=${moviedbPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MOVIEDB_TOKEN}`
      },
    })
    const json = await response.json()

    if(!response.ok) {
      setError(json.message)
    }
    if(response.ok) {
      let results: Movie[] = json.results.map((result: MovieMovieDB) => ({ // mi salvo i dati che mi interessano dai risultati di movieDB
        title: result.title,
        overview: result.overview,
        release_date: result.release_date,
        image_url: result.poster_path,
        moviedb_id: result.id,
      }))
      if (results.length < 20) { // se ho meno di 20 risultati, ho recuperato tutti i film da movieDB per questo titolo (ogni pagina ha 20 risultati): disabilito il pulsante
        setAllMoviesFetched(true)
      }
      let newMovies: Movie[] = []
      let isNew: boolean
      for (let i=0;i<results.length;i++) { // per ogni film tornato da movieDB...
        const movieMovieDB: Movie = results[i]
        isNew = true
        if (movieMovieDB.title === "" || movieMovieDB.release_date === "") { // se non ho titolo o data di rilascio, sono probabilmente film fittizi, inoltre sono required nel mio db; non li includo
          isNew = false;
          continue;
        }
        for (let j=0; j<moviesFound.length;j++) { // ...cerco eventuale corrispondenza nel mio db...
          const movieMyDB: Movie = moviesFound[j]
          if (movieMovieDB.moviedb_id === movieMyDB.moviedb_id) {
            isNew = false;
            break; // ... e se già presente nel db, utente ha cercato male e non lo considero;
          }
        }
        if (isNew) { // se non ho trovato corrispondenze, non ho il film nel mio db: lo aggiungo ai risultati della ricerca
          newMovies.push(movieMovieDB)
        }
      }
      setMoviesFound([...moviesFound, ...newMovies])
      setMoviedbPage(moviedbPage+1)
    }
  }

  const movieEntry = (movie: Movie, index: number) => {
    return (
      <MovieToAdd
        key={index}
        movie={movie}
      />
    )
  }

  return (
    <div className='container py-5 text-center text-sm-start'>
      <form onSubmit={findMovies}>
        <div className="d-flex flex-column mb-1">
          <label htmlFor="movie-title" className="form-label">Search for a movie</label>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <input
              type="text"
              className="form-control"
              id="movie-title"
              aria-describedby="movieTitle"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Movie title:"
            />
            <button type="submit" className="btn btn-primary px-sm-4" disabled={title === ""}>Search</button>
          </div>
        </div>
        {error && <div className="text-danger">{error}</div>}
      </form>
      {moviesFound && <div>
          <div className="d-flex flex-column gap-3 my-3">
            {moviesFound.map(movieEntry)}
          </div>
        </div>}
      { enableMoviedbSearch && <button className="btn btn-secondary" onClick={searchMovieDB} disabled={allMoviesFetched}>Find more movies from MovieDB</button>}
    </div>
  )
}

export default AddMoviePage