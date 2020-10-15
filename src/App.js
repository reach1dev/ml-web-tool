import React, { useEffect, useState } from 'react';
import { AuthContext } from './context/auth';
import './App.scss';
import Board from './containers/Board';
import 'react-toastify/dist/ReactToastify.css';
import Header from './containers/Header';

export default function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <div className="App">
        <Header/>
        <Board/>
      </div>
    </AuthContext.Provider>
  );
}

