/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace IRegistrar {
  export type RevealTypeStruct = {
    domain: string;
    secret: string;
    value: BigNumberish;
  };

  export type RevealTypeStructOutput = [
    domain: string,
    secret: string,
    value: bigint
  ] & { domain: string; secret: string; value: bigint };
}

export interface RegistrarInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "approve"
      | "auctionDeadline"
      | "auctionExists"
      | "auctionHighestBid"
      | "auctionHighestBidder"
      | "balanceOf"
      | "batchRevealRegister"
      | "canCommit"
      | "commit"
      | "expiry"
      | "getApproved"
      | "getAuctionDuration"
      | "getDomainCurrentVersion"
      | "getTLD"
      | "hasAuctionExpired"
      | "hasCommitment"
      | "hasDomainExpired"
      | "isApprovedForAll"
      | "isAuthorized"
      | "makeCommitment"
      | "makeDomainCommitment"
      | "name"
      | "owner"
      | "ownerOf"
      | "renounceOwnership"
      | "revealRegister"
      | "safeTransferFrom(address,address,uint256)"
      | "safeTransferFrom(address,address,uint256,bytes)"
      | "setApprovalForAll"
      | "setCName"
      | "setDuration"
      | "supportsInterface"
      | "symbol"
      | "tokenURI"
      | "transferFrom"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "ApprovalForAll"
      | "DomainAuctionStarted"
      | "DomainBidFailed"
      | "DomainRegistered"
      | "OwnershipTransferred"
      | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "auctionDeadline",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "auctionExists",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "auctionHighestBid",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "auctionHighestBidder",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "batchRevealRegister",
    values: [IRegistrar.RevealTypeStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "canCommit",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "commit",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "expiry", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAuctionDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDomainCurrentVersion",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "getTLD", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "hasAuctionExpired",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasCommitment",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasDomainExpired",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isAuthorized",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "makeCommitment",
    values: [AddressLike, BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "makeDomainCommitment",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "revealRegister",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(functionFragment: "setCName", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setDuration",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "auctionDeadline",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "auctionExists",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "auctionHighestBid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "auctionHighestBidder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "batchRevealRegister",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "canCommit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "commit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "expiry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAuctionDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDomainCurrentVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTLD", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hasAuctionExpired",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasDomainExpired",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isAuthorized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "makeCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "makeDomainCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revealRegister",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setCName", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    approved: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [owner: string, approved: string, tokenId: bigint];
  export interface OutputObject {
    owner: string;
    approved: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ApprovalForAllEvent {
  export type InputTuple = [
    owner: AddressLike,
    operator: AddressLike,
    approved: boolean
  ];
  export type OutputTuple = [
    owner: string,
    operator: string,
    approved: boolean
  ];
  export interface OutputObject {
    owner: string;
    operator: string;
    approved: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DomainAuctionStartedEvent {
  export type InputTuple = [
    domainHash: BytesLike,
    tld: string,
    domain: string,
    duration: BigNumberish,
    deadline: BigNumberish
  ];
  export type OutputTuple = [
    domainHash: string,
    tld: string,
    domain: string,
    duration: bigint,
    deadline: bigint
  ];
  export interface OutputObject {
    domainHash: string;
    tld: string;
    domain: string;
    duration: bigint;
    deadline: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DomainBidFailedEvent {
  export type InputTuple = [
    owner: AddressLike,
    tldHash: BytesLike,
    domainHash: BytesLike,
    tld: string,
    domain: string,
    expires: BigNumberish,
    refund: BigNumberish,
    highestBid: BigNumberish,
    highestCommitment: BytesLike
  ];
  export type OutputTuple = [
    owner: string,
    tldHash: string,
    domainHash: string,
    tld: string,
    domain: string,
    expires: bigint,
    refund: bigint,
    highestBid: bigint,
    highestCommitment: string
  ];
  export interface OutputObject {
    owner: string;
    tldHash: string;
    domainHash: string;
    tld: string;
    domain: string;
    expires: bigint;
    refund: bigint;
    highestBid: bigint;
    highestCommitment: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DomainRegisteredEvent {
  export type InputTuple = [
    owner: AddressLike,
    tldHash: BytesLike,
    domainHash: BytesLike,
    tld: string,
    domain: string,
    expires: BigNumberish,
    cost: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    owner: string,
    tldHash: string,
    domainHash: string,
    tld: string,
    domain: string,
    expires: bigint,
    cost: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    owner: string;
    tldHash: string;
    domainHash: string;
    tld: string;
    domain: string;
    expires: bigint;
    cost: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, tokenId: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Registrar extends BaseContract {
  connect(runner?: ContractRunner | null): Registrar;
  waitForDeployment(): Promise<this>;

  interface: RegistrarInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  approve: TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  auctionDeadline: TypedContractMethod<[domain: BytesLike], [bigint], "view">;

  auctionExists: TypedContractMethod<[label: BytesLike], [boolean], "view">;

  auctionHighestBid: TypedContractMethod<[label: BytesLike], [bigint], "view">;

  auctionHighestBidder: TypedContractMethod<
    [label: BytesLike],
    [string],
    "view"
  >;

  balanceOf: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  batchRevealRegister: TypedContractMethod<
    [commitments: IRegistrar.RevealTypeStruct[]],
    [void],
    "nonpayable"
  >;

  canCommit: TypedContractMethod<[domain: BytesLike], [boolean], "view">;

  commit: TypedContractMethod<
    [domainStr: string, secret: BytesLike],
    [string],
    "payable"
  >;

  expiry: TypedContractMethod<[domain: BytesLike], [bigint], "view">;

  getApproved: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  getAuctionDuration: TypedContractMethod<[], [bigint], "view">;

  getDomainCurrentVersion: TypedContractMethod<
    [domain: BytesLike],
    [string],
    "view"
  >;

  getTLD: TypedContractMethod<[], [string], "view">;

  hasAuctionExpired: TypedContractMethod<[label: BytesLike], [boolean], "view">;

  hasCommitment: TypedContractMethod<
    [commitment: BytesLike],
    [boolean],
    "view"
  >;

  hasDomainExpired: TypedContractMethod<[domain: BytesLike], [boolean], "view">;

  isApprovedForAll: TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;

  isAuthorized: TypedContractMethod<[domain: BytesLike], [boolean], "view">;

  makeCommitment: TypedContractMethod<
    [
      owner: AddressLike,
      name: BytesLike,
      secret: BytesLike,
      value: BigNumberish
    ],
    [string],
    "view"
  >;

  makeDomainCommitment: TypedContractMethod<
    [domain: BytesLike, secret: BytesLike, value: BigNumberish],
    [string],
    "view"
  >;

  name: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  ownerOf: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  revealRegister: TypedContractMethod<
    [domain: string, secret: string, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  "safeTransferFrom(address,address,uint256)": TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  "safeTransferFrom(address,address,uint256,bytes)": TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  setApprovalForAll: TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;

  setCName: TypedContractMethod<[domain: string], [void], "nonpayable">;

  setDuration: TypedContractMethod<
    [duration: BigNumberish],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  tokenURI: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "auctionDeadline"
  ): TypedContractMethod<[domain: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "auctionExists"
  ): TypedContractMethod<[label: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "auctionHighestBid"
  ): TypedContractMethod<[label: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "auctionHighestBidder"
  ): TypedContractMethod<[label: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "batchRevealRegister"
  ): TypedContractMethod<
    [commitments: IRegistrar.RevealTypeStruct[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "canCommit"
  ): TypedContractMethod<[domain: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "commit"
  ): TypedContractMethod<
    [domainStr: string, secret: BytesLike],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "expiry"
  ): TypedContractMethod<[domain: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getApproved"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getAuctionDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getDomainCurrentVersion"
  ): TypedContractMethod<[domain: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getTLD"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "hasAuctionExpired"
  ): TypedContractMethod<[label: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "hasCommitment"
  ): TypedContractMethod<[commitment: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "hasDomainExpired"
  ): TypedContractMethod<[domain: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isApprovedForAll"
  ): TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "isAuthorized"
  ): TypedContractMethod<[domain: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "makeCommitment"
  ): TypedContractMethod<
    [
      owner: AddressLike,
      name: BytesLike,
      secret: BytesLike,
      value: BigNumberish
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "makeDomainCommitment"
  ): TypedContractMethod<
    [domain: BytesLike, secret: BytesLike, value: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "ownerOf"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "revealRegister"
  ): TypedContractMethod<
    [domain: string, secret: string, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256)"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256,bytes)"
  ): TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setApprovalForAll"
  ): TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setCName"
  ): TypedContractMethod<[domain: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setDuration"
  ): TypedContractMethod<[duration: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "tokenURI"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "ApprovalForAll"
  ): TypedContractEvent<
    ApprovalForAllEvent.InputTuple,
    ApprovalForAllEvent.OutputTuple,
    ApprovalForAllEvent.OutputObject
  >;
  getEvent(
    key: "DomainAuctionStarted"
  ): TypedContractEvent<
    DomainAuctionStartedEvent.InputTuple,
    DomainAuctionStartedEvent.OutputTuple,
    DomainAuctionStartedEvent.OutputObject
  >;
  getEvent(
    key: "DomainBidFailed"
  ): TypedContractEvent<
    DomainBidFailedEvent.InputTuple,
    DomainBidFailedEvent.OutputTuple,
    DomainBidFailedEvent.OutputObject
  >;
  getEvent(
    key: "DomainRegistered"
  ): TypedContractEvent<
    DomainRegisteredEvent.InputTuple,
    DomainRegisteredEvent.OutputTuple,
    DomainRegisteredEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "ApprovalForAll(address,address,bool)": TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;
    ApprovalForAll: TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;

    "DomainAuctionStarted(bytes32,string,string,uint256,uint256)": TypedContractEvent<
      DomainAuctionStartedEvent.InputTuple,
      DomainAuctionStartedEvent.OutputTuple,
      DomainAuctionStartedEvent.OutputObject
    >;
    DomainAuctionStarted: TypedContractEvent<
      DomainAuctionStartedEvent.InputTuple,
      DomainAuctionStartedEvent.OutputTuple,
      DomainAuctionStartedEvent.OutputObject
    >;

    "DomainBidFailed(address,bytes32,bytes32,string,string,uint256,uint256,uint256,bytes32)": TypedContractEvent<
      DomainBidFailedEvent.InputTuple,
      DomainBidFailedEvent.OutputTuple,
      DomainBidFailedEvent.OutputObject
    >;
    DomainBidFailed: TypedContractEvent<
      DomainBidFailedEvent.InputTuple,
      DomainBidFailedEvent.OutputTuple,
      DomainBidFailedEvent.OutputObject
    >;

    "DomainRegistered(address,bytes32,bytes32,string,string,uint256,uint256,uint256)": TypedContractEvent<
      DomainRegisteredEvent.InputTuple,
      DomainRegisteredEvent.OutputTuple,
      DomainRegisteredEvent.OutputObject
    >;
    DomainRegistered: TypedContractEvent<
      DomainRegisteredEvent.InputTuple,
      DomainRegisteredEvent.OutputTuple,
      DomainRegisteredEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
