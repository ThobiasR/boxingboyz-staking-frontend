import { ethers } from "ethers";
import { NFT, TOKEN, STAKING } from "./contracts";

const createImage = (id) => {
  return (
    "https://ipfs.io/ipfs/QmVRrFWqgvokgys4y7tbyDyKrckKKtE2JRupq2o4sEyBej/" +
    id +
    ".png"
  );
};

const createName = (id) => {
  return "Boxing boy # " + id;
};

export const getInfo = async (address) => {
  try {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    // instantiate contracts
    const nftContract = new ethers.Contract(NFT.address, NFT.abi, signer);
    const tokenContract = new ethers.Contract(TOKEN.address, TOKEN.abi, signer);
    const stakingContract = new ethers.Contract(
      STAKING.address,
      STAKING.abi,
      signer
    );

    // get information
    let tokenBalance;

    let allNftIds = [];
    const nftBalance = await nftContract.balanceOf(address);
    for (let i = 0; i < nftBalance; i++) {
      const nft = await nftContract.tokenOfOwnerByIndex(address, i);
      allNftIds.push(nft);
    }

    const stakedNftIds = await stakingContract.allStakedTokensByOwner(address);
    let unstakedNfts = [];

    for (let i = 0; i < allNftIds.length; i++) {
      if (!stakedNftIds.includes()) {
        const uri = await nftContract.tokenURI(allNftIds[i]);
        let img = createImage(allNftIds[i]);
        let name = createName(allNftIds[i]);
        unstakedNfts.push({
          id: allNftIds[i].toString(),
          txId: allNftIds[i],
          uri,
          name,
          img,
        });
      }
    }

    // in this list, every staked nft has their own info like; stake time, current rewards etc.
    let stakedNfts = [];
    for (let i = 0; i < stakedNftIds.length; i++) {
      const [
        stakeStartTime,
        claimableRewards,
        nextRewards,
      ] = await stakingContract.getAllInfo(stakedNftIds[i]);
      const uri = await nftContract.tokenURI(stakedNftIds[i]);
      let img = createImage(stakedNftIds[i]);
      let name = createName(stakedNftIds[i]);

      stakedNfts.push({
        id: stakedNftIds[i].toString(),
        txId: stakedNftIds[i],
        stakeStartTime: stakeStartTime.toString(),
        claimableRewards: toNormal(claimableRewards),
        nextRewards: toNormal(nextRewards),
        uri,
        img,
        name,
      });
    }

    return { stakedNfts, unstakedNfts, tokenBalance };
  } catch (error) {
    console.log({ error });
  }
};

const toNormal = (number) => {
  return ethers.utils.formatEther(number.toString());
};
