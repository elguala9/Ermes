// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import './ISignalingMultiOffer.sol';

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SignalingMultiOffer is ISignalingMultiOffer, UUPSUpgradeable, OwnableUpgradeable{

    // offerer -> answerer -> offer
    mapping (address => mapping(address => Signal)) offers;
    // answerer -> offerer -> answer
    mapping (address => mapping(address => Signal)) answers;

    uint32 version;
    uint256[50] _gap;

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
    }


    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        version++;
    }

    modifier requireOffer(address offerer, address answerer){
        require(offers[offerer][answerer].creationTime > 0, "No offer found");
        _;
    }

    function setOffer(bytes memory offer, address peer) external override {
        Signal memory signal = Signal(offer, block.timestamp);
        offers[msg.sender][peer] = signal;
        emit proposeOffer(peer, msg.sender, signal);
    }

    function setAnswer(
        bytes memory answer,
        address offerer
    ) external override requireOffer(offerer, msg.sender){
        Signal memory signal = Signal(answer, block.timestamp);
        answers[msg.sender][offerer] = signal;
        emit proposeAnswer(offerer, msg.sender, signal);
    }

    function getOffer(
        address offerer,
        address answerer
    ) external view override returns (Signal memory) {
        return offers[offerer][answerer];
    }

    function getAnswer(
        address answerer,
        address offerer
    ) external view override returns (Signal memory) {
        return answers[answerer][offerer];
    }
}
