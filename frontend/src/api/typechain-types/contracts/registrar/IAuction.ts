/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IAuctionInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "auctionDeadline"
      | "auctionHighestBid"
      | "auctionHighestBidder"
      | "getAuctionDuration"
      | "hasAuctionExpired"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "auctionDeadline",
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
    functionFragment: "getAuctionDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hasAuctionExpired",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "auctionDeadline",
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
  decodeFunctionResult(
    functionFragment: "getAuctionDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasAuctionExpired",
    data: BytesLike
  ): Result;
}

export interface IAuction extends BaseContract {
  connect(runner?: ContractRunner | null): IAuction;
  waitForDeployment(): Promise<this>;

  interface: IAuctionInterface;

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

  auctionDeadline: TypedContractMethod<[label: BytesLike], [bigint], "view">;

  auctionHighestBid: TypedContractMethod<[label: BytesLike], [bigint], "view">;

  auctionHighestBidder: TypedContractMethod<
    [label: BytesLike],
    [string],
    "view"
  >;

  getAuctionDuration: TypedContractMethod<[], [bigint], "view">;

  hasAuctionExpired: TypedContractMethod<[label: BytesLike], [boolean], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "auctionDeadline"
  ): TypedContractMethod<[label: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "auctionHighestBid"
  ): TypedContractMethod<[label: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "auctionHighestBidder"
  ): TypedContractMethod<[label: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getAuctionDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "hasAuctionExpired"
  ): TypedContractMethod<[label: BytesLike], [boolean], "view">;

  filters: {};
}
