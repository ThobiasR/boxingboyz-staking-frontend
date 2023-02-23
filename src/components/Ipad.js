import React from 'react';

function Ipad(props) {
    return (

        <div className="container-fluid m-0 p-0 pgContipad position-relative">
            <div className="container pt-5">
                <div className="row justify-content-between align-items-center">
                    <div className="col p-0">
                        <div>
                            <img className="img-fluid" src="/assets/img/logo/logo.png" alt="boxing-boyz-logo" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid pgcnt2ipad ">
                <div className="container d-flex align-items-center justify-content-center textDash">
                    <div className="row justify-content-center">
                        <div className="col-7 dashboard-text">
                            <img className="img-fluid mb-4" src="./assets/img/general/Group 11003.png" alt="" />
                            <p className="mb-0 ipadP">
                                Staking dashboard is only available for desktop
                            </p>
                            <button className="btn stakeBtn mt-5">Main Page</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default Ipad;