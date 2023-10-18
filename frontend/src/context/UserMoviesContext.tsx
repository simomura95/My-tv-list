import { ReactNode, createContext, useEffect, useReducer, useState} from 'react'
import { useAuthContext } from '../hooks/contextsHooks/useAuthContext';
import UserMovie from '../types/UserMovie';

// definisco tipi
type UserWatchlistState = {
  watchlist: UserMovie[];
};

type UserMoviesAction = {
  type: 'SET';
  payload: UserMovie[];
} | {
  type: 'ADD' | 'REMOVE' | 'EDIT';
  payload: UserMovie;
}

type UserMoviesContextProviderProps = {
  children: ReactNode;
};


// creo contesto con stato iniziale definito
const initialState: UserWatchlistState = { watchlist: [] }
export const UserMoviesContext = createContext<{ state: UserWatchlistState; dispatch: React.Dispatch<UserMoviesAction>, isLoading: boolean, error: string }>({
  state: initialState,
  dispatch: () => null,
  isLoading: false,
  error: ""
});

// creo reducer
const UserMoviesReducer = (state: UserWatchlistState, action: UserMoviesAction): UserWatchlistState => {
  switch (action.type) {
    case 'SET':
      return { watchlist: action.payload };
    case 'ADD':
        return { watchlist: [...state.watchlist, action.payload!] };
    case 'REMOVE':
      if (state.watchlist) {
        return { watchlist: state.watchlist.filter(userMovie => userMovie.movie._id !== action.payload.movie._id) };
      } else {
        return state;
      }
    case 'EDIT':
      return { watchlist: state.watchlist.map(userMovie => {
        if (userMovie.movie._id === action.payload.movie._id){
          return { ...userMovie, rating: action.payload.rating }
        } else {
          return userMovie
        }
      })};
    default:
      return state;
  }
};

// creo il provider
export const UserMoviesContextProvider: React.FC<UserMoviesContextProviderProps> = ({ children }) => {
  const [ state, dispatch ] = useReducer(UserMoviesReducer, initialState);
  const { state: userState } = useAuthContext()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ error, setError ] = useState("")

  useEffect(() => {
    async function findUserMovies() {
      setIsLoading(true)
      setError("")
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/movies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userState.user!.access_token}` // HomeAuth è accessibile solo se user è autenticato, inoltre chiamo la function solo se ce l'ho, quindi c'è di sicuro
        }
      })
      const json = await response.json()
      json.forEach((movie: UserMovie) => movie.addDate = new Date(movie.addDate)) // le date sono recuperate come stringhe dai json
  
      if (!response.ok) {
        setIsLoading(false)
        setError(json.error)
      }
      if (response.ok) {
        if (json.length > 0) {
          dispatch({type: 'SET', payload: json})
        }
        setIsLoading(false)
      }
    }
  
    if (userState.user) {
      findUserMovies()
    }
  }, [userState.user])

  return (
    <UserMoviesContext.Provider value={{ state, dispatch, isLoading, error }}>
      {children}
    </UserMoviesContext.Provider>
  );
};