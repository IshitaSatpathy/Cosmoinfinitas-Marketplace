import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketAddress } from "../config";

import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketAddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

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
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded overflow-hidden shadow-lg transform transition duration-500 hover:scale-110"
            >
              <a href="#">
                <div className="relative">
                  <img
                    className="w-full h-48"
                    src={nft.image}
                    alt="Sunset in the mountains"
                  />
                </div>
              </a>
              <div className="px-6 py-4">
                <a
                  href="#"
                  className="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out"
                >
                  {nft.name}
                </a>
                <p className="text-gray-500 text-sm">{nft.description}</p>
              </div>
              <div className="px-6 py-4 flex flex-row items-center">
                <span
                  href="#"
                  className="py-1 text-sm font-regular text-white-900 mr-1 flex flex-row items-center"
                >
                  <span className="ml-1 mb-2">
                    <b>Price:</b>{" "}
                  </span>
                  <div className="eth-btn pb-10">
                    <div className="eth-icon-wrapper">
                      <img
                        className="eth-icon-svg"
                        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg"
                      />
                    </div>
                    <p className="btn-text">
                      <b>{nft.price} ETH</b>
                    </p>
                  </div>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
