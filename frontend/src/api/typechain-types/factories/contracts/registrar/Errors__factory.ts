/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  Errors,
  ErrorsInterface,
} from "../../../contracts/registrar/Errors";

const _abi = [
  {
    inputs: [],
    name: "AuctionDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "AuctionExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "AuctionNotExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "BidExists",
    type: "error",
  },
  {
    inputs: [],
    name: "BidTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "CommitmentDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "DomainNotExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBid",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidGovernance",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566050600b82828239805160001a6073146043577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220f806bfb031a8b7402bc1df16283d18068010dfd0ae0b71b9514d30e453c5647c64736f6c63430008140033";

type ErrorsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ErrorsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Errors__factory extends ContractFactory {
  constructor(...args: ErrorsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Errors & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Errors__factory {
    return super.connect(runner) as Errors__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ErrorsInterface {
    return new Interface(_abi) as ErrorsInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Errors {
    return new Contract(address, _abi, runner) as unknown as Errors;
  }
}
