require('dotenv').config()
const hre = require("hardhat");
const BicMetatx = require('../abi/BicMetatx.json')
const Web3 = require('web3')
const { signMetaTransaction } = require('./utils/signMetaTransaction')
const domain = require("domain");
const {printCallTrace} = require("hardhat/internal/hardhat-network/stack-traces/debug");
const { BigNumber } = require('ethers')

async function main() {
  const admin = '0xA450ffc9564E6F9f97D3903ecCdD40265a4F2AE2'
  const account2 = '0xb4faF11047d05B4e2a2362B6D7529010e0D30aE4'
  const account3 = '0xA85b93f1066c074eb34463e1fd795aDC5291BEF6'
  const bicMetatxAddress = '0x300e59c79422b6Aa2d21D82EB56360a94208fb48'

  const web3 = new Web3(process.env.BSC_URL)
  const contract = new web3.eth.Contract(BicMetatx, bicMetatxAddress)

  const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "verifyingContract", type: "address" },
    { name: "salt", type: "bytes32"}
  ]

  const nonce = await contract.methods.getNonce(account2).call()
  const version = await contract.methods.ERC712_VERSION().call()
  const chainId = await contract.methods.getChainId().call();

  let domainData = {
    name: 'BicMetatx',
    version: version,
    verifyingContract: bicMetatxAddress,
    salt: '0x' + web3.utils.toHex(chainId).substring(2).padStart(64, '0')
  }

  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "functionSignature", type: "bytes" }
  ]

  let message = {}
  message.nonce = parseInt(nonce)
  message.from = account2
  message.functionSignature = contract.methods.transferTo(account3, 50000000).encodeABI()

  const dataToSign = {
    types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType
    },
    domain: domainData,
    primaryType: "MetaTransaction",
    message: message
  }

  let { r, s, v } = await signMetaTransaction(dataToSign, process.env.BSC_ACCOUNT2)

  // call on SCAN
  console.log(account2)
  console.log(message.functionSignature)
  console.log(r)
  console.log(s)
  console.log(v)

  // web3 to sign and send Tx
  // await contract.methods.executeMetaTransaction(account2,    --->> wrong. cannot call like this
  //                                               message.functionSignature,
  //                                               r,
  //                                               s,
  //                                               v).call({from: admin})
  // console.log('flag')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
