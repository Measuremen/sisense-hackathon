import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CssBaseline from '@mui/material/CssBaseline/CssBaseline'
import { SisenseContextProvider } from '@sisense/sdk-ui';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SisenseContextProvider
      url={import.meta.env.VITE_URL}
      token={import.meta.env.VITE_TOKON}
      >
      <DndProvider backend={HTML5Backend}>
        <CssBaseline />
        <App />
      </DndProvider>
    </SisenseContextProvider>
  </React.StrictMode>,
)
