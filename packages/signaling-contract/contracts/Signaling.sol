// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import './ISignaling.sol';



contract Signaling is ISignaling {

    mapping (address => bytes) offers;
    mapping (address => mapping(address => bytes)) answers;

    function setOffer(bytes memory offer) external override {
        offers[msg.sender] = offer;
    }

    function setAnswer(
        bytes memory answer,
        address offerer
    ) external override {
        answers[msg.sender][offerer] = answer;
        emit proposeAnswer(msg.sender, offerer);
    }

    function getOffer(
        address offerer
    ) external view override returns (uint256) {
        return offers[offerer]
    }

    function getAnswer(
        address offerer,
        address answerer
    ) external view override returns (uint256) {
        answers[msg.sender][offerer];ldkidnci
        
    }
}
