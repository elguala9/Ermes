// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

struct Signal {
    bytes signal;
    uint256  creationTime;
}

interface ISignalingMultiOffer {
    event proposeOffer(address indexed peer, address indexed offerer, Signal offer);
    event proposeAnswer(address indexed offerer, address indexed answerer, Signal answer);

    function setOffer(bytes memory offer, address peer) external;
    function setAnswer(bytes memory answer, address peer) external;

    function getOffer(address offerer, address answerer) external view returns (Signal memory);
    function getAnswer(address offerer, address answerer) external view returns (Signal memory);
}
