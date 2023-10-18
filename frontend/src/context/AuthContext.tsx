import { ReactNode, createContext, useReducer} from 'react'

// definisco tipi
interface User {
  access_token: string;
  username: string;
}

type AuthState = {
  user: User | null;
};

type AuthAction = {
  type: 'LOGIN' | 'LOGOUT';
  payload?: User; // Dati utente (opzionale)
};

type AuthContextProviderProps = {
  children: ReactNode;
};


// stato iniziale, a seconda di localStorage
const storedUser = localStorage.getItem('user')
let initialState: AuthState = { user: storedUser ? JSON.parse(storedUser) : null };

// creo contesto con stato iniziale definito
export const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> }>({
  state: initialState,
  dispatch: () => null,
});

// creo reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload || null };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

// creo il provider
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};