/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IRegistrar,
  IRegistrarInterface,
} from "../../../contracts/registrar/IRegistrar";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "domainHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tld",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "domain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "DomainAuctionStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "tldHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "domainHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tld",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "domain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expires",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "refund",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "highestBid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "highestCommitment",
        type: "bytes32",
      },
    ],
    name: "DomainBidFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "tldHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "domainHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tld",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "domain",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expires",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DomainRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
    ],
    name: "auctionDeadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
    ],
    name: "auctionHighestBid",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
    ],
    name: "auctionHighestBidder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "domain",
        type: "string",
      },
      {
        components: [
          {
            internalType: "string",
            name: "secret",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        internalType: "struct IRegistrar.CommitParam[]",
        name: "commitments",
        type: "tuple[]",
      },
    ],
    name: "batchRevealRegister",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "domain",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "secret",
        type: "bytes32",
      },
    ],
    name: "commit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domain",
        type: "bytes32",
      },
    ],
    name: "expiry",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAuctionDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domain",
        type: "bytes32",
      },
    ],
    name: "getDomainCurrentVersion",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domain",
        type: "bytes32",
      },
    ],
    name: "getDomainFutureVersion",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
    ],
    name: "hasAuctionExpired",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "commitment",
        type: "bytes32",
      },
    ],
    name: "hasCommitment",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domain",
        type: "bytes32",
      },
    ],
    name: "hasDomainExpired",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domain",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "secret",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "makeDomainCommitment",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domain",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "secret",
        type: "bytes32",
      },
    ],
    name: "makeDomainPreCommitment",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "precommitment",
        type: "bytes32",
      },
    ],
    name: "precommit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "domain",
        type: "string",
      },
      {
        components: [
          {
            internalType: "string",
            name: "secret",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        internalType: "struct IRegistrar.CommitParam",
        name: "param",
        type: "tuple",
      },
    ],
    name: "revealRegister",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "domain",
        type: "string",
      },
    ],
    name: "setCName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IRegistrar__factory {
  static readonly abi = _abi;
  static createInterface(): IRegistrarInterface {
    return new Interface(_abi) as IRegistrarInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IRegistrar {
    return new Contract(address, _abi, runner) as unknown as IRegistrar;
  }
}
