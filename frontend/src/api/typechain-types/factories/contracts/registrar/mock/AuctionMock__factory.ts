/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  AuctionMock,
  AuctionMockInterface,
} from "../../../../contracts/registrar/mock/AuctionMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    name: "auctionExists",
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
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "commitment",
        type: "bytes32",
      },
    ],
    name: "commit",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "name",
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
    name: "makeCommitment",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
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
    name: "reveal",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200108b3803806200108b83398181016040528101906200003791906200009b565b8062000049816200005160201b60201c565b5050620000cd565b8060018190555050565b600080fd5b6000819050919050565b620000758162000060565b81146200008157600080fd5b50565b60008151905062000095816200006a565b92915050565b600060208284031215620000b457620000b36200005b565b5b6000620000c48482850162000084565b91505092915050565b610fae80620000dd6000396000f3fe6080604052600436106100915760003560e01c80637a5a69e3116100595780637a5a69e3146101b5578063acc532fd146101f2578063e3ce094d1461022f578063ee060ded1461024b578063fb456c5e1461028a57610091565b8063369e67d61461009657806342c80f05146100d357806348eda45d1461011057806369dcfe8b1461014d57806378cb51af1461018a575b600080fd5b3480156100a257600080fd5b506100bd60048036038101906100b89190610b68565b6102c7565b6040516100ca9190610bde565b60405180910390f35b3480156100df57600080fd5b506100fa60048036038101906100f59190610bf9565b610300565b6040516101079190610c41565b60405180910390f35b34801561011c57600080fd5b5061013760048036038101906101329190610bf9565b610322565b6040516101449190610c41565b60405180910390f35b34801561015957600080fd5b50610174600480360381019061016f9190610bf9565b61037e565b6040516101819190610c6b565b60405180910390f35b34801561019657600080fd5b5061019f61043e565b6040516101ac9190610c95565b60405180910390f35b3480156101c157600080fd5b506101dc60048036038101906101d79190610bf9565b610448565b6040516101e99190610c41565b60405180910390f35b3480156101fe57600080fd5b5061021960048036038101906102149190610bf9565b6104b7565b6040516102269190610c95565b60405180910390f35b61024960048036038101906102449190610cb0565b610557565b005b34801561025757600080fd5b50610272600480360381019061026d9190610cf0565b610565565b60405161028193929190610d43565b60405180910390f35b34801561029657600080fd5b506102b160048036038101906102ac9190610bf9565b610584565b6040516102be9190610c95565b60405180910390f35b6000848484846040516020016102e09493929190610e04565b604051602081830303815290604052805190602001209050949350505050565b6000426002600084815260200190815260200160002060020154109050919050565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008481526020019081526020016000205414159050919050565b60008161038a81610448565b6103c0576040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6103c981610300565b6103ff576040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16915050919050565b6000600154905090565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b6000816104c381610448565b6104f9576040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61050281610300565b610538576040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600084815260200190815260200160002060010154915050919050565b61056182826105a4565b5050565b6000806000610575868686610777565b92509250925093509350939050565b600060026000838152602001908152602001600020600201549050919050565b6105ad81610322565b156105e4576040517f3e0827ab00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6105ed82610448565b6105fb576105fa826109fc565b5b61060482610300565b1561063b576040517f04a5e67c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60003411610675576040517fa0d26eb600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002081905550600260008381526020019081526020016000206001015434111561077357336002600084815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503460026000848152602001908152602001600020600101819055508060026000848152602001908152602001600020600301819055505b5050565b600080600080610789338888886102c7565b905061079487610448565b6107ca576040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6107d387610300565b610809576040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61081281610322565b610848576040517f99d1f42800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600081600260008a81526020019081526020016000206003015414610967576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905060003373ffffffffffffffffffffffffffffffffffffffff16826040516108df90610e83565b60006040518083038185875af1925050503d806000811461091c576040519150601f19603f3d011682016040523d82523d6000602084013e610921565b606091505b5050905080610965576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161095c90610ef5565b60405180910390fd5b505b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008381526020019081526020016000206000905581600260008a8152602001908152602001600020600301541481600260008b815260200190815260200160002060030154945094509450505093509350939050565b6000600260008381526020019081526020016000206001018190555060006002600083815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060015442610a7c9190610f44565b600260008381526020019081526020016000206002018190555050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610ac982610a9e565b9050919050565b610ad981610abe565b8114610ae457600080fd5b50565b600081359050610af681610ad0565b92915050565b6000819050919050565b610b0f81610afc565b8114610b1a57600080fd5b50565b600081359050610b2c81610b06565b92915050565b6000819050919050565b610b4581610b32565b8114610b5057600080fd5b50565b600081359050610b6281610b3c565b92915050565b60008060008060808587031215610b8257610b81610a99565b5b6000610b9087828801610ae7565b9450506020610ba187828801610b1d565b9350506040610bb287828801610b1d565b9250506060610bc387828801610b53565b91505092959194509250565b610bd881610afc565b82525050565b6000602082019050610bf36000830184610bcf565b92915050565b600060208284031215610c0f57610c0e610a99565b5b6000610c1d84828501610b1d565b91505092915050565b60008115159050919050565b610c3b81610c26565b82525050565b6000602082019050610c566000830184610c32565b92915050565b610c6581610abe565b82525050565b6000602082019050610c806000830184610c5c565b92915050565b610c8f81610b32565b82525050565b6000602082019050610caa6000830184610c86565b92915050565b60008060408385031215610cc757610cc6610a99565b5b6000610cd585828601610b1d565b9250506020610ce685828601610b1d565b9150509250929050565b600080600060608486031215610d0957610d08610a99565b5b6000610d1786828701610b1d565b9350506020610d2886828701610b1d565b9250506040610d3986828701610b53565b9150509250925092565b6000606082019050610d586000830186610c32565b610d656020830185610c86565b610d726040830184610bcf565b949350505050565b60008160601b9050919050565b6000610d9282610d7a565b9050919050565b6000610da482610d87565b9050919050565b610dbc610db782610abe565b610d99565b82525050565b6000819050919050565b610ddd610dd882610afc565b610dc2565b82525050565b6000819050919050565b610dfe610df982610b32565b610de3565b82525050565b6000610e108287610dab565b601482019150610e208286610dcc565b602082019150610e308285610dcc565b602082019150610e408284610ded565b60208201915081905095945050505050565b600081905092915050565b50565b6000610e6d600083610e52565b9150610e7882610e5d565b600082019050919050565b6000610e8e82610e60565b9150819050919050565b600082825260208201905092915050565b7f526566756e64206661696c656400000000000000000000000000000000000000600082015250565b6000610edf600d83610e98565b9150610eea82610ea9565b602082019050919050565b60006020820190508181036000830152610f0e81610ed2565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610f4f82610b32565b9150610f5a83610b32565b9250828201905080821115610f7257610f71610f15565b5b9291505056fea264697066735822122033f2f974a52aebb9e300c221e84d07ce591f8c9fb2d6013ee301e4c2c766287864736f6c63430008130033";

type AuctionMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AuctionMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AuctionMock__factory extends ContractFactory {
  constructor(...args: AuctionMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    duration: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(duration, overrides || {});
  }
  override deploy(
    duration: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(duration, overrides || {}) as Promise<
      AuctionMock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): AuctionMock__factory {
    return super.connect(runner) as AuctionMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AuctionMockInterface {
    return new Interface(_abi) as AuctionMockInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): AuctionMock {
    return new Contract(address, _abi, runner) as unknown as AuctionMock;
  }
}
