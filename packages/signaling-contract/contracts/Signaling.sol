// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import './ISignaling.sol';



contract Signaling is ISignaling {

    // offerer -> offer
    mapping (address => Signal) offers;
    // answerer -> offerer -> answer
    mapping (address => mapping(address => Signal)) answers;

    function setOffer(bytes memory offer) external override {
        Signal memory signal = Signal(offer, block.timestamp);
        offers[msg.sender] = signal;
        emit proposeOffer(msg.sender, signal);
    }

    function setAnswer(
        bytes memory answer,
        address offerer
    ) external override {
        Signal memory signal = Signal(answer, block.timestamp);
        answers[msg.sender][offerer] = signal;
        emit proposeAnswer(msg.sender, offerer, signal);
    }

    function getOffer(
        address offerer
    ) external view override returns (Signal memory) {
        return offers[offerer];
    }

    function getAnswer(
        address answerer,
        address offerer
    ) external view override returns (Signal memory) {
        return answers[answerer][offerer];
    }
}
