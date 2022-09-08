
const hre = require("hardhat");

const ethers = hre.ethers;

async function main() {
    const [deployer] = await ethers.getSigners();
    const chainId = 9000;  
  
    const NEVMOS = await ethers.getContractFactory("NEvmos");
    const nevmos = await NEVMOS.attach("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54");

    //const nevmosNew = await NEVMOS.attach("0x5fF141cd9fb7A3137d43f3116F99a78Ab46FE5e4");

    const Comptroller = await ethers.getContractFactory("Comptroller");
    // proxy address inside attach function
    const unitroller = await Comptroller.attach("0x75eBe50E115bBe9F0399bab18Fe4719b7409c488");

    const r = await unitroller.oracle();
    console.log('oracle is : ' + r);
    /*await unitroller._setPriceOracle("0x7191e2DE1DaDcb643C9e98F72d04bBBa66f58071");

    unitroller.on("NewPriceOracle", (oldOracle, newOracle) => {
        console.log(oldOracle, newOracle);
    })*/ 

    // TRYING TO DEBUG BORROW FUNC ...
    const amount = await ethers.utils.parseEther("3");
    //const allowed = await unitroller.borrowAllowed("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54", "0xE3678E00F1a669EBDCb146c66DbD43dBb2f4A1d9", amount)
    //const data = "0xda3d454c000000000000000000000000faa9bb1e7602ab9a9aaea86cccbb6b3ddeabbc54000000000000000000000000e3678e00f1a669ebdcb146c66dbd43dbb2f4a1d900000000000000000000000000000000000000000000000029a2241af62c0000"
    //const dataS = await ethers.utils.defaultAbiCoder.decode(['uint256'], ethers.utils.hexDataSlice(data, 1))
    //console.log('is allowed ? : ' + JSON.stringify(allowed));
   // console.log(dataS);
    //const enoughCash = await nevmos.getCash();
    //console.log(' has enough cash ? : ' + enoughCash);
    //const TestNael = await ethers.getContractFactory("TestNael");
    //const testNael = await TestNael.attach("0xed15Bf27df70B98625414b5E651f10EFB4589Ed8");

    //const res = await testNael.isAllowed("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54", "0xE3678E00F1a669EBDCb146c66DbD43dBb2f4A1d9", amount);
    //console.log("res from TEST is : ", res);
    //const isInside = await unitroller.markets("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54");
    //const Oracle = await ethers.getContractFactory("PriceOracle");
    //const oracle = await Oracle.attach("0xd928133afE68dB739b322C38e8B895a3686E4597");
    //const resStored = await nevmos.borrowBalanceStored("0xE3678E00F1a669EBDCb146c66DbD43dBb2f4A1d9");
    //console.log('balance stored result : '+ resStored);
    
    //const price = await oracle.getUnderlyingPrice("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54");

    //console.log(price);
    //await unitroller._setMarketSupplyCaps(["0x5fF141cd9fb7A3137d43f3116F99a78Ab46FE5e4"], [ethers.utils.parseEther('1000')]);
  
    /*const supplyCap = await unitroller.supplyCaps("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54");
    console.log("supply cap of Lalalend evmos: "+ supplyCap); 
    const borrowCap = await unitroller.borrowCaps("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54");
    console.log("borrowCap is "+ borrowCap);
    */
    //await unitroller._supportMarket("0x5fF141cd9fb7A3137d43f3116F99a78Ab46FE5e4");
    //const arr_res = await unitroller.enterMarkets(["0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54"]);
    //console.log(arr_res[0]);
    /*unitroller.on("MarketListed",nToken => {
        console.log(nToken);
    })*/
    //const market = await unitroller.markets("0xfaa9Bb1E7602AB9A9aAea86cCcbB6B3ddeAbbc54");
    //console.log("market is listed : "+ market.isListed); 
    /*console.log("Attempting to mint evmos lalalend tokens ");
    
    await nevmos.mint({ value : ethers.utils.parseEther("30")});

    nevmos.on("Mint", (minter, actualMintAmount, mintTokens)=> {
        console.log(minter, actualMintAmount, mintTokens);
    })*/
    
    /*console.log("Attempting to borrow evmos tokens ");
    
    await nevmos.borrow(ethers.utils.parseEther("3"), {
        gasLimit: 1000000,
      });

    nevmos.on("Borrow", (borrower, borrowAmount, accountBorrowsNew, totalBorrowsNew) => {
        console.log(borrower, borrowAmount, accountBorrowsNew, totalBorrowsNew);
    })*/
    //console.log("Attempting to borrow evmos tokens ");
    
    //await nevmosNew.borrow(ethers.utils.parseEther("0.012"));

    /*nevmosNew.on("Borrow", (borrower, borrowAmount, accountBorrowsNew, totalBorrowsNew) => {
        console.log(borrower, borrowAmount, accountBorrowsNew, totalBorrowsNew);
    })*/
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  