import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import Loading from "./Loading";

import { STAKING } from "../utils/contracts";

function Page1(props) {
  const [datas, setDatas] = useState([]);
  //const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  const setData_f = async () => {
    setDatas(props.stakedData);
  };

  useEffect(() => {
    if (props.stakedData) {
      setData_f();
    }
  }, [props.stakedData]);

  const handleUnstake = async (nftId) => {
    if (!window.ethereum) {
      // props?.setStakeLoading(false);

      return;
    }
    props.setStakeLoading(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(STAKING.address, STAKING.abi, signer);

    try {
      const tx = await contract.unstake(nftId);
      await tx.wait();
      props.setStakeLoading(false);
      window.alert("Unstaking successful!");
      window.location.reload();
    } catch (err) {
      console.log(err);
      window.location.reload();
    }
  };

  const nextPrizeDate = (startTime) => {
    const now = Math.floor(new Date() / 1000);

    let next21Days = parseInt(startTime) + 1814400;
    let nextDate = next21Days;
    while (now > nextDate) {
      nextDate += 1814400;
    }
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    nextDate = new Date(nextDate * 1000);
    const day = nextDate.getDate();
    const month = months[nextDate.getMonth()];
    const hour = nextDate.getHours();
    const min = nextDate.getMinutes();

    const res = day + " " + month + " " + hour + ":" + min;

    return res;
  };

  const renderedCards = datas.map((data, key) => {
    const stakedDays = (
      (Math.floor(Date.now() / 1000) - data.stakeStartTime) /
      3600 /
      24
    ).toFixed(2);

    return (
      <div
        key={key}
        className="col-4 mb-4"
        style={{ width: "33.333%", height: "298px", marginLeft: "38px" }}
      >
        <div className="card" style={{ width: "389px", height: "292px" }}>
          <div
            className="card-body pt-0"
            style={{ width: "387px", height: "289px" }}
          >
            <div className="row d-flex align-items-center">
              <div className="col-4 p-0">
                <div className="imageDiv">
                  <div className="imageDiv2">
                    <img className="img-fluid " src={data.img} alt="" />
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="d-flex flex-column">
                  <span className="headText">Staked NFT</span>
                  <span className="collectionText">{data.name}</span>
                  <button
                    type="button"
                    className="btn btn-sm unstakeBtn"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => setModalData(data)}
                  >
                    Unstake
                  </button>
                </div>
              </div>
            </div>
            <div
              className="row d-flex flex-column pe-2 ps-2"
              style={{ justifyContent: "center !important" }}
            >
              <div className="d-flex justify-content-between align-items-center detailCrd">
                <span>Total Staked Days</span>
                <span>{stakedDays} DAYS</span>
              </div>
              <div className="d-flex justify-content-between align-items-center detailCrd">
                <span>claımable amount</span>
                <span>{data.claimableRewards} BOYZ</span>
              </div>
              <div className="d-flex justify-content-between align-items-center detailCrd">
                <span>Next Prıze Date</span>
                <span>{nextPrizeDate(data.stakeStartTime)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center detailCrd">
                <span>Next Prıze Amount</span>
                <span>{data.nextRewards} Boyz</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          data-bs-dismiss="modal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body pt-0">
                <div className="d-flex justify-content-center alertModal">
                  <img
                    className="img-fluid"
                    src="./assets/img/general/alert-circle.png"
                    alt=""
                  />
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <p className="modalHead">Are You Sure?</p>
                </div>
                <div className="d-flex justify-content-center text-center">
                  <p className="modalText">
                    If you unstake your NFT now, you will get the claimable
                    amount but lose your progress.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-close-stake btn-sm"
                  data-bs-dismiss="modal"
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (modalData) {
                      handleUnstake(modalData.txId);
                    }
                  }}
                  className="btn btn-unstake-modal btn-sm"
                >
                  Unstake
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return <>{renderedCards}</>;
}

export default Page1;
