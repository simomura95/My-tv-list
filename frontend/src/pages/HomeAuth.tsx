import { useUserMoviesContext } from '../hooks/contextsHooks/useUserMoviesContext'
import MovieElement from '../components/MovieElement'
import UserMovie from '../types/UserMovie'
import { useEffect, useState } from 'react'
import LoadingElement from '../components/LoadingElement'
import ErrorElement from '../components/ErrorElement'
import AddMovieButton from '../components/buttons/AddMovieButton'
import FilterButton from '../components/buttons/FilterButton'

const HomeAuth = () => {
  const { state, isLoading, error } = useUserMoviesContext()
  const [ filterTitle, setFilterTitle ] = useState('')
  const [ watchlist, setWatchlist ] = useState(state.watchlist)
  const [ orderBy, setOrderBy ] = useState('ADD_DATE')
  const [ orderDirection, setOrderDirection ] = useState(-1)  // -1 ascendente, 1 discendente per l'ordinamento

  // quando cambia qualcosa nella sezione filtro, oppure cambia la watchlist (un film viene aggiunto, tolto o modificato), aggiorno la watchlist e la sua visualizzazione
  useEffect(() => {
    let newWatchlist = state.watchlist.filter(userMovie => userMovie.movie.title.toLowerCase().includes(filterTitle.toLowerCase()))
    switch (orderBy) {
      case 'ADD_DATE':
        newWatchlist.sort((a, b) => (Number(a.addDate) - Number(b.addDate))*-orderDirection);
        break
      case 'TITLE':
        newWatchlist.sort((a, b) => a.movie.title.toLowerCase() < b.movie.title.toLowerCase() ? orderDirection : -orderDirection);
        break
      case 'RELEASE_DATE':
        newWatchlist.sort((a, b) => a.movie.release_date < b.movie.release_date ? orderDirection : -orderDirection);
        break
      case 'RATING':
        newWatchlist.sort((a, b) => {
          if (a.rating !== b.rating) {
            return (a.rating - b.rating)*-orderDirection
          } else {
            return a.movie.title.toLowerCase() < b.movie.title.toLowerCase() ? -1 : 1 // se rating è pari, uso ordine alfabetico crescente
          };
        })
        break
    }  
    setWatchlist(newWatchlist)
  }, [filterTitle, orderBy, orderDirection, state.watchlist])

  // funzione di supporto per creare le schede dei film
  const movieEntry = (userMovie: UserMovie, index: number) => {
    return (
      <MovieElement
        key = {index}
        movie = {userMovie.movie}
        rating = {userMovie.rating}
        addDate = {userMovie.addDate}
      />
    )
  }

    return (
      <div className='container py-5'>
        {isLoading && <LoadingElement />}
        {error && <ErrorElement error={error} />}
        {watchlist && !error && !isLoading && 
          <div>
            <div className='d-flex flex-sm-row flex-column gap-3'>
              <AddMovieButton />
              { watchlist.length > 0 && <FilterButton 
                filterTitle={filterTitle}
                setFilterTitle={setFilterTitle}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                orderDirection={orderDirection}
                setOrderDirection={setOrderDirection}            
              /> }
            </div>

            {/* Watch list */}
            { watchlist.length > 0 &&
              <div className="d-flex flex-column gap-3 mt-3 text-center text-sm-start">
               <span className="lead ">Click on a movie to view and edit it</span>
              {watchlist.map(movieEntry)}
            </div> }
          </div>}
      </div>
    )
  }

export default HomeAuth