const hre = require("hardhat");

async function main() {
  const BicMetatx = await hre.ethers.getContractFactory("BicMetatx");
  const bicMetatx = await BicMetatx.deploy('0xA450ffc9564E6F9f97D3903ecCdD40265a4F2AE2', '0x71275af1882cde87a15c597cd14e18a97091e983');
  await bicMetatx.deployed();
  console.log("deployed to:", bicMetatx.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
