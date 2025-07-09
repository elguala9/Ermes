import { type ContractRunner } from "ethers";
import type { ISignaling, ISignalingInterface } from "../../contracts/ISignaling";
export declare class ISignaling__factory {
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
            readonly name: "offer";
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
    static createInterface(): ISignalingInterface;
    static connect(address: string, runner?: ContractRunner | null): ISignaling;
}
