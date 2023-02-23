import React from "react";

function Loading() {
  return (
    <div className="row justify-content-center">
      <div className="col-7 dashboard-text">
        <img
          style={{ width: "60%" }}
          src="https://cryptojumper.io/wp-content/uploads/2022/05/Spinner-1s-324px.gif"
          alt="loading..."
        />
      </div>
    </div>
  );
}

export default Loading;
