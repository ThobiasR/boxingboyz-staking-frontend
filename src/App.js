import React, { useState, useEffect } from "react";
import { MainContext } from "./components/context";

import Login from "./components/Login";

function App() {
  //ethers info
  const [unstaked, setUnstaked] = useState();
  const [staked, setStaked] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Metamask");

  const data = {
    setUnstaked,
    unstaked,
    setStaked,
    staked,
    setErrorMessage,
    setDefaultAccount,
    setUserBalance,
    setConnButtonText,
    errorMessage,
    defaultAccount,
    userBalance,
    connButtonText,
  };

  useEffect(() => {}, [unstaked, staked]);

  return (
    <MainContext.Provider value={data}>
      <Login />
    </MainContext.Provider>
  );
}

export default App;
