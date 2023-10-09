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
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200145a3803806200145a83398181016040528101906200003791906200009b565b8062000049816200005160201b60201c565b5050620000cd565b8060018190555050565b600080fd5b6000819050919050565b620000758162000060565b81146200008157600080fd5b50565b60008151905062000095816200006a565b92915050565b600060208284031215620000b457620000b36200005b565b5b6000620000c48482850162000084565b91505092915050565b61137d80620000dd6000396000f3fe6080604052600436106100915760003560e01c80637a5a69e3116100595780637a5a69e3146101b5578063acc532fd146101f2578063e3ce094d1461022f578063ee060ded1461024b578063fb456c5e1461028957610091565b8063369e67d61461009657806342c80f05146100d357806348eda45d1461011057806369dcfe8b1461014d57806378cb51af1461018a575b600080fd5b3480156100a257600080fd5b506100bd60048036038101906100b89190610e37565b6102c6565b6040516100ca9190610ead565b60405180910390f35b3480156100df57600080fd5b506100fa60048036038101906100f59190610ec8565b6102ff565b6040516101079190610f10565b60405180910390f35b34801561011c57600080fd5b5061013760048036038101906101329190610ec8565b61040c565b6040516101449190610f10565b60405180910390f35b34801561015957600080fd5b50610174600480360381019061016f9190610ec8565b610468565b6040516101819190610f3a565b60405180910390f35b34801561019657600080fd5b5061019f610528565b6040516101ac9190610f64565b60405180910390f35b3480156101c157600080fd5b506101dc60048036038101906101d79190610ec8565b610532565b6040516101e99190610f10565b60405180910390f35b3480156101fe57600080fd5b5061021960048036038101906102149190610ec8565b6105a1565b6040516102269190610f64565b60405180910390f35b61024960048036038101906102449190610f7f565b610641565b005b34801561025757600080fd5b50610272600480360381019061026d9190610fbf565b61064f565b604051610280929190611012565b60405180910390f35b34801561029557600080fd5b506102b060048036038101906102ab9190610ec8565b610669565b6040516102bd9190610f64565b60405180910390f35b6000848484846040516020016102df94939291906110c5565b604051602081830303815290604052805190602001209050949350505050565b60006103566040518060400160405280601781526020017f61756374696f6e735b6c6162656c5d2e656e643a2025730000000000000000008152506002600085815260200190815260200160002060020154610689565b6103956040518060400160405280601381526020017f626c6f636b2e74696d657374616d703a2025730000000000000000000000000081525042610689565b6103ec6040518060400160405280600881526020017f656e64656420257300000000000000000000000000000000000000000000000081525042600260008681526020019081526020016000206002015410610725565b426002600084815260200190815260200160002060020154109050919050565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008481526020019081526020016000205414159050919050565b60008161047481610532565b6104aa576040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6104b3816102ff565b6104e9576040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16915050919050565b6000600154905090565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b6000816105ad81610532565b6105e3576040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6105ec816102ff565b610622576040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600084815260200190815260200160002060010154915050919050565b61064b82826107c1565b5050565b60008061065d858585610979565b91509150935093915050565b600060026000838152602001908152602001600020600201549050919050565b610721828260405160240161069f9291906111a3565b6040516020818303038152906040527fb60e72cc000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610c7b565b5050565b6107bd828260405160240161073b9291906111d3565b6040516020818303038152906040527fc3b55635000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610c7b565b5050565b6107ca8161040c565b15610801576040517f3e0827ab00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61080a82610532565b6108185761081782610c95565b5b610821826102ff565b15610858576040517f04a5e67c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60003411610892576040517fa0d26eb600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002081905550600260008381526020019081526020016000206001015434111561097557336002600084815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503460026000848152602001908152602001600020600101819055505b5050565b600080600061098a338787876102c6565b905061099586610532565b6109cb576040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6109d4866102ff565b610a0a576040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610a138161040c565b610a49576040517f99d1f42800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60003373ffffffffffffffffffffffffffffffffffffffff166002600089815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610bb4576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905060003373ffffffffffffffffffffffffffffffffffffffff1682604051610b2c90611234565b60006040518083038185875af1925050503d8060008114610b69576040519150601f19603f3d011682016040523d82523d6000602084013e610b6e565b606091505b5050905080610bb2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ba990611295565b60405180910390fd5b505b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000838152602001908152602001600020600090553373ffffffffffffffffffffffffffffffffffffffff166002600089815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161481935093505050935093915050565b610c9281610c8a610d32610d53565b63ffffffff16565b50565b6000600260008381526020019081526020016000206001018190555060006002600083815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060015442610d1591906112e4565b600260008381526020019081526020016000206002018190555050565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b610d5e819050919050565b610d66611318565b565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610d9882610d6d565b9050919050565b610da881610d8d565b8114610db357600080fd5b50565b600081359050610dc581610d9f565b92915050565b6000819050919050565b610dde81610dcb565b8114610de957600080fd5b50565b600081359050610dfb81610dd5565b92915050565b6000819050919050565b610e1481610e01565b8114610e1f57600080fd5b50565b600081359050610e3181610e0b565b92915050565b60008060008060808587031215610e5157610e50610d68565b5b6000610e5f87828801610db6565b9450506020610e7087828801610dec565b9350506040610e8187828801610dec565b9250506060610e9287828801610e22565b91505092959194509250565b610ea781610dcb565b82525050565b6000602082019050610ec26000830184610e9e565b92915050565b600060208284031215610ede57610edd610d68565b5b6000610eec84828501610dec565b91505092915050565b60008115159050919050565b610f0a81610ef5565b82525050565b6000602082019050610f256000830184610f01565b92915050565b610f3481610d8d565b82525050565b6000602082019050610f4f6000830184610f2b565b92915050565b610f5e81610e01565b82525050565b6000602082019050610f796000830184610f55565b92915050565b60008060408385031215610f9657610f95610d68565b5b6000610fa485828601610dec565b9250506020610fb585828601610dec565b9150509250929050565b600080600060608486031215610fd857610fd7610d68565b5b6000610fe686828701610dec565b9350506020610ff786828701610dec565b925050604061100886828701610e22565b9150509250925092565b60006040820190506110276000830185610f01565b6110346020830184610f55565b9392505050565b60008160601b9050919050565b60006110538261103b565b9050919050565b600061106582611048565b9050919050565b61107d61107882610d8d565b61105a565b82525050565b6000819050919050565b61109e61109982610dcb565b611083565b82525050565b6000819050919050565b6110bf6110ba82610e01565b6110a4565b82525050565b60006110d1828761106c565b6014820191506110e1828661108d565b6020820191506110f1828561108d565b60208201915061110182846110ae565b60208201915081905095945050505050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561114d578082015181840152602081019050611132565b60008484015250505050565b6000601f19601f8301169050919050565b600061117582611113565b61117f818561111e565b935061118f81856020860161112f565b61119881611159565b840191505092915050565b600060408201905081810360008301526111bd818561116a565b90506111cc6020830184610f55565b9392505050565b600060408201905081810360008301526111ed818561116a565b90506111fc6020830184610f01565b9392505050565b600081905092915050565b50565b600061121e600083611203565b91506112298261120e565b600082019050919050565b600061123f82611211565b9150819050919050565b7f526566756e64206661696c656400000000000000000000000000000000000000600082015250565b600061127f600d8361111e565b915061128a82611249565b602082019050919050565b600060208201905081810360008301526112ae81611272565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006112ef82610e01565b91506112fa83610e01565b9250828201905080821115611312576113116112b5565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052605160045260246000fdfea2646970667358221220932294d3758d68eb8778219ab64d99cad1c5fd862faa267872dfbdb3a88caf1864736f6c63430008130033";

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
