/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");

// const fs = require("fs");
// const privateKey = fs.readFileSync(".secret").toString();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/61c239f5a0a2471a9964f7c2d97392ba",
      accounts: [`0x${process.env.ACCOUNT_KEY}`],
    },
    mainnet: {
      url: "https://polygon-mainnet.infura.io/v3/a3215e5799f2462c80c17402290f9253",
    },
  },
  solidity: "0.8.4",
};
