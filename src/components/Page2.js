import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

import { STAKING, NFT } from "../utils/contracts";
import loading from "./Loading";

function Page2(props) {
  const [datas1, setDatas1] = useState([]);
  const [modalData, setModalData] = useState(null);

  const setData_f1 = async () => {
    setDatas1(props.unstakedData);
  };

  useEffect(() => {
    if (props.unstakedData) {
      setData_f1();
    }
  }, [loading]);

  const handleStake = async (nftId) => {
    if (!window.ethereum) return;
    props.setStakeLoading(true);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(STAKING.address, STAKING.abi, signer);

    try {
      const nftContract = new ethers.Contract(NFT.address, NFT.abi, signer);
      const account = (await provider.listAccounts())[0];
      if (!(await nftContract.isApprovedForAll(account, STAKING.address))) {
        const tx = await nftContract.setApprovalForAll(STAKING.address, true);
        await tx.wait();
      }
      const tx = await contract.stake(nftId);
      await tx.wait();
      props.setStakeLoading(false);

      window.alert("Staking successful!");
      window.location.reload();
    } catch (err) {
      window.location.reload();
      console.log(err);
    }
  };

  const getPrize = async (tokenId) => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let contract = new ethers.Contract(STAKING.address, STAKING.abi, provider);
    let rewards;
    if (await contract.isLegend(tokenId)) {
      rewards = ethers.utils.formatEther(await contract.legendRewards());
    } else {
      rewards = ethers.utils.formatEther(await contract.standardRewards());
    }

    return rewards.toString();
  };

  const renderedCards1 = datas1.map((data, key) => {
    return (
      <div
        key={key}
        className="col-4 mb-4"
        style={{ width: "33.3333%", height: "242px" }}
      >
        <div className="card">
          <div className="card-body pt-0">
            <div className="row d-flex align-item s-center">
              <div className="col-4 p-0">
                <div className="imageDiv4">
                  <div className="imageDiv3">
                    <img className="img-fluid " src={data.img} alt="" />
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="d-flex flex-column">
                  <span className="collectionText">{data.name}</span>
                </div>
              </div>
            </div>
            <div className="row d-flex flex-column pe-2 ps-2">
              <div className="d-flex justify-content-between align-items-center detailCrd">
                <span>Prize</span>
                <span>{data.prize} Boyz</span>
              </div>
              <div className="d-flex justify-content-between align-items-center detailCrd2">
                <span>Actions</span>
                <button
                  className="btn unstakeBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal1"
                  onClick={() => setModalData(data)}
                >
                  Stake
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="exampleModal1"
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
                  <p className="modalText">Stake item ?</p>
                </div>
              </div>
              <div className="modal-footer" style={{}}>
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
                      handleStake(modalData.txId);
                    }
                  }}
                  data-bs-dismiss="modal"
                  className="btn btn-unstake-modal btn-sm"
                >
                  Stake
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return <>{renderedCards1}</>;
}

export default Page2;
