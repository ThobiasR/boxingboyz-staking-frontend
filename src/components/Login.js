import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getInfo } from "../utils/getInfo";
import { MainContext, useContext } from "./context";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Mobile from "./Mobile";
import Ipad from "./Ipad";
import Loading from "./Loading";
import NoItems from "./NoItems";

// import logo from '../../public/assets/img/general/load.gif'

function Login() {
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [showStakedPage, setShowStakedPage] = useState(false);
  const [showUnStakedPage, setShowUnStakedPage] = useState(false);

  const {
    setUnstaked,
    staked,
    unstaked,
    setStaked,
    setErrorMessage,
    setDefaultAccount,
    setUserBalance,
    setConnButtonText,
    defaultAccount,
    connButtonText,
  } = useContext(MainContext);

  const connectWalletHandler = () => {
    // setLoading(true)
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          const text1 = result[0].slice(0, 5);
          const text2 = result[0].slice(-5, -1);
          setConnButtonText(text1 + "....." + text2);
          getAccountBalance(result[0]);
          getEthersData(result[0]);
          setLoading(false);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const getEthersData = async (address) => {
    try {
      setIsWalletLoading(true);
      await getInfo(address)
        .then((res) => {
          setIsWalletLoading(false);
          setUnstaked(res.unstakedNfts);
          setStaked(res.stakedNfts);
          setUserBalance(res.tokenBalance);
        })
        .catch((err) => console.error(err));
    } catch {
      setIsWalletLoading(false);
      console.log("error");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
    getEthersData(newAccount);
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  if (window.ethereum !== undefined) {
    // listen for account changes
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);
  }

  //dimension

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [unstaked, staked, loading]);

  useEffect(() => {
    // console.log({ unstaked, staked });
    if (staked) {
      if (staked.length > 0) setShowStakedPage(true);
    } else {
      setShowStakedPage(false);
    }
    if (unstaked) {
      if (unstaked.length > 0) setShowUnStakedPage(true);
    } else {
      setShowUnStakedPage(false);
    }
  }, [unstaked, staked]);

  const isMobile = width <= 568;
  const isIpad = width >= 568 && width <= 1000;

  return (
    <React.Fragment>
      {isIpad ? (
        <Ipad />
      ) : isMobile ? (
        <Mobile />
      ) : (
        <div className="container-fluid m-0 p-0 pgCont position-relative">
          <div className="container-fluid pgcnt2"></div>
          <div className="container pt-5">
            <div className="row justify-content-between align-items-center">
              <div className="col p-0">
                <div>
                  <img
                    className="img-fluid"
                    src="/assets/img/logo/logo.png"
                    alt="boxing-boyz-logo"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.open("http://boxingboyz.com", "_self")
                    }
                  />
                </div>
              </div>

              <div className="col p-0 d-flex justify-content-end">
                <div className="d-inline">
                  <button
                    onClick={connectWalletHandler}
                    className="btn btn-metamask d-flex justify-content-start align-items-center"
                  >
                    <img
                      className="img-fluid pe-2 ps-2"
                      src="./assets/img/general/image4.png"
                      alt=""
                    />
                    <span>{connButtonText}</span>
                    {connButtonText && (
                      // <div className="log d-flex justify-content-center align-items-center ms-3">
                      //   <img src="./assets/img/general/login.png" alt="" />
                      // </div>
                      <div className="d-flex justify-content-center align-items-center ms-3"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {defaultAccount === null ? (
            <div className="container d-flex align-items-center justify-content-center textDash">
              <div className="row justify-content-center">
                <div className="col-7 dashboard-text">
                  <span>Connect your wallet to see staking dashboard</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="container-fluid pgCont p-0 m-0 ">
              {stakeLoading ? (
                <Loading />
              ) : (
                <div className="container d-flex align-items-center justify-content-center pt-5 ">
                  <div className="row justify-content-center">
                    <ul
                      className="nav nav-tabs mb-3"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-home"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          Staked NFTs
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profile"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          Stake NFT
                        </button>
                      </li>
                    </ul>
                    <div
                      className="tab-content d-flex justify-content-center align-items-center pt-5"
                      id="pills-tabContent"
                    >
                      <div
                        className="tab-pane fade show active pt-5"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                        style={{ width: "1088px" }}
                      >
                        {showStakedPage ? (
                          <div className="row d-flex align-items-center justify-content-center">
                            <Page1
                              stakedData={staked}
                              stakeLoading={stakeLoading}
                              setStakeLoading={setStakeLoading}
                            />
                          </div>
                        ) : (
                          <>
                            {isWalletLoading ? (
                              <Loading />
                            ) : (
                              <NoItems type="staked" />
                            )}
                          </>
                        )}
                      </div>

                      <div
                        className="tab-pane fade  pt-5"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                        style={{ width: "1088px" }}
                      >
                        {showUnStakedPage ? (
                          <div className="row d-flex align-items-center justify-content-center">
                            <Page2
                              unstakedData={unstaked}
                              stakeLoading={stakeLoading}
                              setStakeLoading={setStakeLoading}
                            />
                          </div>
                        ) : (
                          <>
                            {isWalletLoading ? (
                              <Loading />
                            ) : (
                              <NoItems type="unstaked" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )

          // <Page1 unstaked={unstaked}/>
          }
        </div>
      )}
    </React.Fragment>
  );
}

export default Login;
