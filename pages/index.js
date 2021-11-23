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

function LikeBtn({ likeCount }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center">
      <input type="checkbox" className={`checkbox`} checked={checked} />
      <label htmlFor="checkbox">
        <svg
          id="heart-svg"
          viewBox="467 392 58 57"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="Group"
            fill="none"
            fillRule="evenodd"
            transform="translate(467 392)"
          >
            <path
              d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
              id="heart"
              fill="#AAB8C2"
              onClick={() => {
                setChecked(!checked);
              }}
            />
            <circle
              id="main-circ"
              fill="#E2264D"
              opacity="0"
              cx="29.5"
              cy="29.5"
              r="1.5"
              onClick={() => {
                setChecked(!checked);
              }}
            />

            <g id="grp7" opacity="0" transform="translate(7 6)">
              <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2" />
              <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2" />
            </g>

            <g id="grp6" opacity="0" transform="translate(0 28)">
              <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2" />
              <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2" />
            </g>

            <g id="grp3" opacity="0" transform="translate(52 28)">
              <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2" />
              <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2" />
            </g>

            <g id="grp2" opacity="0" transform="translate(44 6)">
              <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2" />
              <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2" />
            </g>

            <g id="grp5" opacity="0" transform="translate(14 50)">
              <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2" />
              <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2" />
            </g>

            <g id="grp4" opacity="0" transform="translate(35 50)">
              <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2" />
              <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2" />
            </g>

            <g id="grp1" opacity="0" transform="translate(24)">
              <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
              <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
            </g>
          </g>
        </svg>
      </label>
      <span className="ml-1 lg:text-xl ">
        {checked ? likeCount + 1 : likeCount}
      </span>
    </div>
  );
}

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
    function heart() {
      document.getElementsByClassName("heartx").style.color = "red";
    }

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
              className="bg-gray-800 rounded-md overflow-hidden relative shadow-md transform transition duration-500 hover:scale-110"
            >
              <div>
                <img
                  className="w-full h-50 object-fill"
                  src={nft.image}
                  alt="Recipe Title"
                />
              </div>
              <div>
                <h3 className="content-end text-gray-400 text-xl justify-items-end pl-5 pt-2">
                  Seller Address:
                </h3>
                <p className="text-xs pt-2 pl-7">{nft.seller}</p>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-2 gap-4 ">
                  <h2 className="text-2sm text-green-400 pl-2">{nft.name}</h2>
                  <h3 className="content-end text-gray-400 text-xl justify-items-end pl-20">
                    Price:
                  </h3>
                </div>

                <div className="flex justify-between mt-2 mb-3 text-gray-500">
                  <LikeBtn likeCount={0} />

                  <div className="flex items-center pl-18">
                    <div className="eth-btn ">
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
                  </div>
                </div>
                <p className="mb-4 text-white-500">{nft.description}</p>
                <button
                  className="text-white bg-red-800 p-3 rounded-md w-full uppercase"
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
