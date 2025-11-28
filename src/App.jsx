import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import RouteManager from "./routes/RouteManager";

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita recargar datos al cambiar de pestaña
      retry: 1, // Reintentar 1 vez en caso de error
      staleTime: 5 * 60 * 1000, // 5 minutos de caché
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <RouteManager />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
