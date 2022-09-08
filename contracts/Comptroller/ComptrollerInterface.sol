pragma solidity ^0.5.16;

import "./../NTokens/NToken.sol";
import "./../Oracle/PriceOracle.sol";

contract ComptrollerInterfaceG1 {
    /// @notice Indicator that this is a Comptroller contract (for inspection)
    bool public constant isComptroller = true;

    /*** Assets You Are In ***/

    function enterMarkets(address[] calldata nTokens) external returns (uint[] memory);
    function exitMarket(address nToken) external returns (uint);

    /*** Policy Hooks ***/

    function mintAllowed(address nToken, address minter, uint mintAmount) external returns (uint);
    function mintVerify(address nToken, address minter, uint mintAmount, uint mintTokens) external;

    function redeemAllowed(address nToken, address redeemer, uint redeemTokens) external returns (uint);
    function redeemVerify(address nToken, address redeemer, uint redeemAmount, uint redeemTokens) external;

    function borrowAllowed(address nToken, address borrower, uint borrowAmount) external returns (uint);
    function borrowVerify(address nToken, address borrower, uint borrowAmount) external;

    function repayBorrowAllowed(
        address nToken,
        address payer,
        address borrower,
        uint repayAmount) external returns (uint);
    function repayBorrowVerify(
        address nToken,
        address payer,
        address borrower,
        uint repayAmount,
        uint borrowerIndex) external;

    function liquidateBorrowAllowed(
        address nTokenBorrowed,
        address nTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount) external returns (uint);
    function liquidateBorrowVerify(
        address nTokenBorrowed,
        address nTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount,
        uint seizeTokens) external;

    function seizeAllowed(
        address nTokenCollateral,
        address nTokenBorrowed,
        address liquidator,
        address borrower,
        uint seizeTokens) external returns (uint);
    function seizeVerify(
        address nTokenCollateral,
        address nTokenBorrowed,
        address liquidator,
        address borrower,
        uint seizeTokens) external;

    function transferAllowed(address nToken, address src, address dst, uint transferTokens) external returns (uint);
    function transferVerify(address nToken, address src, address dst, uint transferTokens) external;

    /*** Liquidity/Liquidation Calculations ***/

    function liquidateCalculateSeizeTokens(
        address nTokenBorrowed,
        address nTokenCollateral,
        uint repayAmount) external view returns (uint, uint);
    function setMintedSEBOf(address owner, uint amount) external returns (uint);
}

contract ComptrollerInterfaceG2 is ComptrollerInterfaceG1 {
    function liquidateSEBCalculateSeizeTokens(
        address nTokenCollateral,
        uint repayAmount) external view returns (uint, uint);
}

contract ComptrollerInterface is ComptrollerInterfaceG2 {
    function markets(address) external view returns (bool, uint);
    function oracle() external view returns (PriceOracle);
    function getAccountLiquidity(address) external view returns (uint, uint, uint);
    function getAssetsIn(address) external view returns (NToken[] memory);
    function claimMia(address) external;
    function miaAccrued(address) external view returns (uint);
    function miaSpeeds(address) external view returns (uint);
    function getAllMarkets() external view returns (NToken[] memory);
    function miaSupplierIndex(address, address) external view returns (uint);
    function miaInitialIndex() external view returns (uint224);
    function miaBorrowerIndex(address, address) external view returns (uint);
    function miaBorrowState(address) external view returns (uint224, uint32);
    function miaSupplyState(address) external view returns (uint224, uint32);
}

interface ISEBVault {
    function updatePendingRewards() external;
}

interface IComptroller {
    function liquidationIncentiveMantissa() external view returns (uint);
    /*** Treasury Data ***/
    function treasuryAddress() external view returns (address);
    function treasuryPercent() external view returns (uint);
}