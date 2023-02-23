import React from "react";

const NoItems = ({ type }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-7 dashboard-text">
        <h1 style={{ textAlign: "center" }}>
          {type === "unstaked"
            ? "There is no BoxingBoyz in your wallet"
            : "There is no staked BoxingBoyz"}
        </h1>
      </div>
    </div>
  );
};

export default NoItems;
