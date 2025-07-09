import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Signaling, SignalingInterface } from "../../contracts/Signaling";
type SignalingConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Signaling__factory extends ContractFactory {
    constructor(...args: SignalingConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Signaling & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Signaling__factory;
    static readonly bytecode = "0x60a060405230608052348015610013575f80fd5b506080516111d361003a5f395f81816107d70152818161080001526109ba01526111d35ff3fe6080604052600436106100b8575f3560e01c80638da5cb5b11610071578063ddf7c0ce1161004c578063ddf7c0ce14610215578063eb75c41014610234578063f2fde38b14610253575f80fd5b80638da5cb5b1461015b578063ad3cb1cc146101a1578063c4d66de8146101f6575f80fd5b80634f1ef286116100a15780634f1ef2861461011257806352d1902d14610125578063715018a614610147575f80fd5b8063224c06b8146100bc5780634c0b2d94146100dd575b5f80fd5b3480156100c7575f80fd5b506100db6100d6366004610e42565b610272565b005b3480156100e8575f80fd5b506100fc6100f7366004610e97565b6102f9565b6040516101099190610f15565b60405180910390f35b6100db610120366004610f46565b6103d9565b348015610130575f80fd5b506101396103f8565b604051908152602001610109565b348015610152575f80fd5b506100db610426565b348015610166575f80fd5b507f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b039091168152602001610109565b3480156101ac575f80fd5b506101e96040518060400160405280600581526020017f352e302e3000000000000000000000000000000000000000000000000000000081525081565b6040516101099190610f91565b348015610201575f80fd5b506100db610210366004610fa3565b610439565b348015610220575f80fd5b506100db61022f366004610fbc565b610574565b34801561023f575f80fd5b506100fc61024e366004610fa3565b6106a1565b34801561025e575f80fd5b506100db61026d366004610fa3565b610776565b60408051808201825282815242602080830191909152335f9081529081905291909120815182919081906102a69082611081565b5060208201518160010155905050336001600160a01b03167f9c647382d7799e7e4b4c67ed15f6a91fddfd228ec1949b2eae5f05ca58d61158826040516102ed9190610f15565b60405180910390a25050565b604080518082018252606081525f60208083018290526001600160a01b0386811683526001825284832090861683529052829020825180840190935280549192918290829061034790610ffe565b80601f016020809104026020016040519081016040528092919081815260200182805461037390610ffe565b80156103be5780601f10610395576101008083540402835291602001916103be565b820191905f5260205f20905b8154815290600101906020018083116103a157829003601f168201915b50505050508152602001600182015481525050905092915050565b6103e16107cc565b6103ea82610883565b6103f482826108c2565b5050565b5f6104016109af565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b61042e6109f8565b6104375f610a6c565b565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff165f811580156104835750825b90505f8267ffffffffffffffff16600114801561049f5750303b155b9050811580156104ad575080155b156104e4576040517ff92ee8a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561051857845468ff00000000000000001916680100000000000000001785555b61052186610ae9565b831561056c57845468ff000000000000000019168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6001600160a01b0381165f9081526020819052604090206001015481906105fc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f4e6f206f6666657220666f756e6400000000000000000000000000000000000060448201526064015b60405180910390fd5b60408051808201825284815242602080830191909152335f908152600182528381206001600160a01b038716825290915291909120815182919081906106429082611081565b5060208201518160010155905050336001600160a01b0316836001600160a01b03167f5ecfe35cd7e8831a41cd757bcde8154a54a57dae4bfd09f34ae1aa0cce0778af836040516106939190610f15565b60405180910390a350505050565b60408051808201909152606081525f60208201526001600160a01b0382165f908152602081905260409081902081518083019092528054829082906106e590610ffe565b80601f016020809104026020016040519081016040528092919081815260200182805461071190610ffe565b801561075c5780601f106107335761010080835404028352916020019161075c565b820191905f5260205f20905b81548152906001019060200180831161073f57829003601f168201915b505050505081526020016001820154815250509050919050565b61077e6109f8565b6001600160a01b0381166107c0576040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081525f60048201526024016105f3565b6107c981610a6c565b50565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148061086557507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166108597f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b031614155b156104375760405163703e46dd60e11b815260040160405180910390fd5b61088b6109f8565b6002805463ffffffff16905f6108a08361113d565b91906101000a81548163ffffffff021916908363ffffffff1602179055505050565b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa92505050801561091c575060408051601f3d908101601f191682019092526109199181019061116b565b60015b61094457604051634c9c8ce360e01b81526001600160a01b03831660048201526024016105f3565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc81146109a0576040517faa1d49a4000000000000000000000000000000000000000000000000000000008152600481018290526024016105f3565b6109aa8383610afa565b505050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104375760405163703e46dd60e11b815260040160405180910390fd5b33610a2a7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b031614610437576040517f118cdaa70000000000000000000000000000000000000000000000000000000081523360048201526024016105f3565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300805473ffffffffffffffffffffffffffffffffffffffff1981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a3505050565b610af1610b4f565b6107c981610bb6565b610b0382610bbe565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b905f90a2805115610b47576109aa8282610c41565b6103f4610cb3565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff16610437576040517fd7e6bcf800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61077e610b4f565b806001600160a01b03163b5f03610bf357604051634c9c8ce360e01b81526001600160a01b03821660048201526024016105f3565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b60605f80846001600160a01b031684604051610c5d9190611182565b5f60405180830381855af49150503d805f8114610c95576040519150601f19603f3d011682016040523d82523d5f602084013e610c9a565b606091505b5091509150610caa858383610ceb565b95945050505050565b3415610437576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b606082610d0057610cfb82610d63565b610d5c565b8151158015610d1757506001600160a01b0384163b155b15610d59576040517f9996b3150000000000000000000000000000000000000000000000000000000081526001600160a01b03851660048201526024016105f3565b50805b9392505050565b805115610d735780518082602001fd5b6040517fd6bda27500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b634e487b7160e01b5f52604160045260245ffd5b5f82601f830112610dc8575f80fd5b813567ffffffffffffffff80821115610de357610de3610da5565b604051601f8301601f19908116603f01168101908282118183101715610e0b57610e0b610da5565b81604052838152866020858801011115610e23575f80fd5b836020870160208301375f602085830101528094505050505092915050565b5f60208284031215610e52575f80fd5b813567ffffffffffffffff811115610e68575f80fd5b610e7484828501610db9565b949350505050565b80356001600160a01b0381168114610e92575f80fd5b919050565b5f8060408385031215610ea8575f80fd5b610eb183610e7c565b9150610ebf60208401610e7c565b90509250929050565b5f5b83811015610ee2578181015183820152602001610eca565b50505f910152565b5f8151808452610f01816020860160208601610ec8565b601f01601f19169290920160200192915050565b602081525f825160406020840152610f306060840182610eea565b9050602084015160408401528091505092915050565b5f8060408385031215610f57575f80fd5b610f6083610e7c565b9150602083013567ffffffffffffffff811115610f7b575f80fd5b610f8785828601610db9565b9150509250929050565b602081525f610d5c6020830184610eea565b5f60208284031215610fb3575f80fd5b610d5c82610e7c565b5f8060408385031215610fcd575f80fd5b823567ffffffffffffffff811115610fe3575f80fd5b610fef85828601610db9565b925050610ebf60208401610e7c565b600181811c9082168061101257607f821691505b60208210810361103057634e487b7160e01b5f52602260045260245ffd5b50919050565b601f8211156109aa57805f5260205f20601f840160051c8101602085101561105b5750805b601f840160051c820191505b8181101561107a575f8155600101611067565b5050505050565b815167ffffffffffffffff81111561109b5761109b610da5565b6110af816110a98454610ffe565b84611036565b602080601f8311600181146110e2575f84156110cb5750858301515b5f19600386901b1c1916600185901b17855561056c565b5f85815260208120601f198616915b82811015611110578886015182559484019460019091019084016110f1565b508582101561112d57878501515f19600388901b60f8161c191681555b5050505050600190811b01905550565b5f63ffffffff80831681810361116157634e487b7160e01b5f52601160045260245ffd5b6001019392505050565b5f6020828403121561117b575f80fd5b5051919050565b5f8251611193818460208701610ec8565b919091019291505056fea26469706673582212208c38fb3ded2843dae8684c9dd30d4d81cc5f452e9ea86b15261e5cd41800ccce64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "target";
            readonly type: "address";
        }];
        readonly name: "AddressEmptyCode";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "ERC1967InvalidImplementation";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ERC1967NonPayable";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "FailedCall";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidInitialization";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotInitializing";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "OwnableInvalidOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "OwnableUnauthorizedAccount";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "UUPSUnauthorizedCallContext";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "slot";
            readonly type: "bytes32";
        }];
        readonly name: "UUPSUnsupportedProxiableUUID";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "version";
            readonly type: "uint64";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "Upgraded";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "offerer";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "answerer";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "bytes";
                readonly name: "signal";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "creationTime";
                readonly type: "uint256";
            }];
            readonly indexed: false;
            readonly internalType: "struct Signal";
            readonly name: "answer";
            readonly type: "tuple";
        }];
        readonly name: "proposeAnswer";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "offerer";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "bytes";
                readonly name: "signal";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "creationTime";
                readonly type: "uint256";
            }];
            readonly indexed: false;
            readonly internalType: "struct Signal";
            readonly name: "offer";
            readonly type: "tuple";
        }];
        readonly name: "proposeOffer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "UPGRADE_INTERFACE_VERSION";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "answerer";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "offerer";
            readonly type: "address";
        }];
        readonly name: "getAnswer";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "bytes";
                readonly name: "signal";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "creationTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Signal";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "offerer";
            readonly type: "address";
        }];
        readonly name: "getOffer";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "bytes";
                readonly name: "signal";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "creationTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Signal";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "proxiableUUID";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "answer";
            readonly type: "bytes";
        }, {
            readonly internalType: "address";
            readonly name: "offerer";
            readonly type: "address";
        }];
        readonly name: "setAnswer";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "offer";
            readonly type: "bytes";
        }];
        readonly name: "setOffer";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "upgradeToAndCall";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }];
    static createInterface(): SignalingInterface;
    static connect(address: string, runner?: ContractRunner | null): Signaling;
}
export {};
