import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes'
import './App.css'

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}

export default App
