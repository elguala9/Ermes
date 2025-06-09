// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface ISignaling {
    event proposeOffer(address indexed offerer);
    event offer(address indexed offerer, bytes answer);
    event proposeAnswer(address indexed offerer, address indexed answerer);
    event answer(address indexed offerer, address indexed answerer, bytes answer);

    function setOffer(bytes memory offer) external;
    function setAnswer(bytes memory answer, address offerer) external;

    function getOffer(address offerer) external view returns (bytes memory);
    function getAnswer(address answerer, address offerer) external view returns (bytes memory);
}
