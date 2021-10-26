import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketAddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { withRouter } from "next/router";
const s = {
  color: "white",
  paddingTop: "350px",
  textAlign: "center",
};

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/61c239f5a0a2471a9964f7c2d97392ba"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketAddress, Market.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="mt-50 py-50 text-3xl text-gray-600" style={s}>
        No items in marketplace
      </h1>
    );
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid gap-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4 mb-16 p-10">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="bg-white rounded-md overflow-hidden relative shadow-md transform transition duration-500 hover:scale-110"
            >
              <div>
                <img
                  className="w-full max-h-55 object-fill"
                  src={nft.image}
                  alt="Recipe Title"
                />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 ">
                  <h2 className="text-2xl text-green-400">{nft.name}</h2>
                  <h3 className="content-end text-gray-400 text-xl justify-items-end pl-20">
                    Price:
                  </h3>
                </div>
                <div className="flex justify-between mt-2 mb-4 text-gray-500">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 border-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="ml-1 lg:text-xl ">0</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="ml-1 lg:text-xl">{nft.price} ETH</span>
                  </div>
                </div>
                <p className="mb-4 text-gray-500">{nft.description}</p>
                <button
                  className="text-white bg-blue-600 p-4 rounded-md w-full uppercase"
                  onClick={() => buyNft(nft)}
                >
                  Buy NFT
                </button>
              </div>
              <div className="absolute top-0 right-0 mt-4 mr-4 bg-green-400 text-white rounded-full pt-1 pb-1 pl-4 pr-5 text-xs uppercase">
                <span>New</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
