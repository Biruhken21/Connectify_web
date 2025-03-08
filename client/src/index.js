import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
/* the authcontextprovider used to reach the current user anywhere is this app*/
import { AuthContextProvider } from "./context/AuthContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
       <App />
    </AuthContextProvider>
  </React.StrictMode>
);

