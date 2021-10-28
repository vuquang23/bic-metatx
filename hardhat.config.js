require('dotenv').config()
require("@nomiclabs/hardhat-waffle")
require('@nomiclabs/hardhat-etherscan')
require('hardhat-contract-sizer')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [
        process.env.ETHEREUM_ACCOUNT
      ]
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [
        process.env.ETHEREUM_ACCOUNT
      ]
    },
    bsc: {
      url: process.env.BSC_URL,
      accounts: [
        process.env.BSC_ACCOUNT
      ]
    },
    dev: {
      url: process.env.DEV,
      accounts: [
        process.env.BSC_ACCOUNT
      ]
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  }
}
