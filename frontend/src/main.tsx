import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { UserMoviesContextProvider } from './context/UserMoviesContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <UserMoviesContextProvider>
      <App />
    </ UserMoviesContextProvider>
  </ AuthContextProvider>
)
