import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { Signaling, SignalingInterface } from "../Signaling";
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
    static readonly bytecode = "0x608060405234801561000f575f80fd5b506106f18061001d5f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c8063224c06b81461004e5780634c0b2d9414610063578063ddf7c0ce1461008c578063eb75c4101461009f575b5f80fd5b61006161005c36600461042f565b6100b2565b005b610076610071366004610484565b610139565b60405161008391906104b5565b60405180910390f35b61006161009a366004610515565b610219565b6100766100ad366004610557565b6102bd565b60408051808201825282815242602080830191909152335f9081529081905291909120815182919081906100e690826105fb565b5060208201518160010155905050336001600160a01b03167f9c647382d7799e7e4b4c67ed15f6a91fddfd228ec1949b2eae5f05ca58d611588260405161012d91906104b5565b60405180910390a25050565b604080518082018252606081525f60208083018290526001600160a01b0386811683526001825284832090861683529052829020825180840190935280549192918290829061018790610577565b80601f01602080910402602001604051908101604052809291908181526020018280546101b390610577565b80156101fe5780601f106101d5576101008083540402835291602001916101fe565b820191905f5260205f20905b8154815290600101906020018083116101e157829003601f168201915b50505050508152602001600182015481525050905092915050565b60408051808201825283815242602080830191909152335f908152600182528381206001600160a01b0386168252909152919091208151829190819061025f90826105fb565b5060208201518160010155905050816001600160a01b0316336001600160a01b03167f5ecfe35cd7e8831a41cd757bcde8154a54a57dae4bfd09f34ae1aa0cce0778af836040516102b091906104b5565b60405180910390a3505050565b60408051808201909152606081525f60208201526001600160a01b0382165f9081526020819052604090819020815180830190925280548290829061030190610577565b80601f016020809104026020016040519081016040528092919081815260200182805461032d90610577565b80156103785780601f1061034f57610100808354040283529160200191610378565b820191905f5260205f20905b81548152906001019060200180831161035b57829003601f168201915b505050505081526020016001820154815250509050919050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f8301126103b5575f80fd5b813567ffffffffffffffff808211156103d0576103d0610392565b604051601f8301601f19908116603f011681019082821181831017156103f8576103f8610392565b81604052838152866020858801011115610410575f80fd5b836020870160208301375f602085830101528094505050505092915050565b5f6020828403121561043f575f80fd5b813567ffffffffffffffff811115610455575f80fd5b610461848285016103a6565b949350505050565b80356001600160a01b038116811461047f575f80fd5b919050565b5f8060408385031215610495575f80fd5b61049e83610469565b91506104ac60208401610469565b90509250929050565b5f602080835283516040602085015280518060608601525f5b818110156104ea578281018401518682016080015283016104ce565b505f60808287010152602086015160408601526080601f19601f830116860101935050505092915050565b5f8060408385031215610526575f80fd5b823567ffffffffffffffff81111561053c575f80fd5b610548858286016103a6565b9250506104ac60208401610469565b5f60208284031215610567575f80fd5b61057082610469565b9392505050565b600181811c9082168061058b57607f821691505b6020821081036105a957634e487b7160e01b5f52602260045260245ffd5b50919050565b601f8211156105f657805f5260205f20601f840160051c810160208510156105d45750805b601f840160051c820191505b818110156105f3575f81556001016105e0565b50505b505050565b815167ffffffffffffffff81111561061557610615610392565b610629816106238454610577565b846105af565b602080601f83116001811461065c575f84156106455750858301515b5f19600386901b1c1916600185901b1785556106b3565b5f85815260208120601f198616915b8281101561068a5788860151825594840194600190910190840161066b565b50858210156106a757878501515f19600388901b60f8161c191681555b505060018460011b0185555b50505050505056fea2646970667358221220a2508c02a33a5017a241c5e5df3e06b149b9756b4599aa9eed17d9dd67751ffb64736f6c63430008180033";
    static readonly abi: readonly [{
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
            readonly name: "answer";
            readonly type: "tuple";
        }];
        readonly name: "proposeOffer";
        readonly type: "event";
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
    }];
    static createInterface(): SignalingInterface;
    static connect(address: string, runner?: ContractRunner | null): Signaling;
}
export {};
