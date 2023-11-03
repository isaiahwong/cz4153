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
  "0x60806040523480156200001157600080fd5b50604051620019b2380380620019b2833981810160405281019062000037919062000149565b80620000546724c92036a314e10860c01b620000c160201b60201c565b620000706794b94ec1d364e36b60c01b620000c160201b60201c565b6200008c6762e6ee8f55cc0fbd60c01b620000c160201b60201c565b6200009d81620000c460201b60201c565b50620000ba677c4d0847fbd590b060c01b6200010660201b60201c565b506200017b565b50565b620000e067d6ef33e6817f9aad60c01b620000c160201b60201c565b620000fc67a3d726359b19881b60c01b620000c160201b60201c565b8060018190555050565b50565b600080fd5b6000819050919050565b62000123816200010e565b81146200012f57600080fd5b50565b600081519050620001438162000118565b92915050565b60006020828403121562000162576200016162000109565b5b6000620001728482850162000132565b91505092915050565b611827806200018b6000396000f3fe6080604052600436106100915760003560e01c80637a5a69e3116100595780637a5a69e3146101b5578063acc532fd146101f2578063e3ce094d1461022f578063ee060ded1461024b578063fb456c5e1461028a57610091565b8063369e67d61461009657806342c80f05146100d357806348eda45d1461011057806369dcfe8b1461014d57806378cb51af1461018a575b600080fd5b3480156100a257600080fd5b506100bd60048036038101906100b891906114a4565b6102c7565b6040516100ca919061151a565b60405180910390f35b3480156100df57600080fd5b506100fa60048036038101906100f59190611535565b61033c565b604051610107919061157d565b60405180910390f35b34801561011c57600080fd5b5061013760048036038101906101329190611535565b61039a565b604051610144919061157d565b60405180910390f35b34801561015957600080fd5b50610174600480360381019061016f9190611535565b610433565b60405161018191906115a7565b60405180910390f35b34801561019657600080fd5b5061019f610647565b6040516101ac91906115d1565b60405180910390f35b3480156101c157600080fd5b506101dc60048036038101906101d79190611535565b61068d565b6040516101e9919061157d565b60405180910390f35b3480156101fe57600080fd5b5061021960048036038101906102149190611535565b610739565b60405161022691906115d1565b60405180910390f35b610249600480360381019061024491906115ec565b61092d565b005b34801561025757600080fd5b50610272600480360381019061026d919061162c565b610978565b6040516102819392919061167f565b60405180910390f35b34801561029657600080fd5b506102b160048036038101906102ac9190611535565b6109d3565b6040516102be91906115d1565b60405180910390f35b60006102dd67768185894e46d44160c01b610a2f565b6102f1677990d6ce7208166760c01b610a2f565b610305674cfd07d4bdc98a5360c01b610a2f565b8484848460405160200161031c9493929190611740565b604051602081830303815290604052805190602001209050949350505050565b6000610352675dc4901f926f73d760c01b610a2f565b6103666779b2c44952c8a9bf60c01b610a2f565b61037a67361a31bc48d36cd660c01b610a2f565b426002600084815260200190815260200160002060020154109050919050565b60006103b067a4c1b7d03a2cbaaa60c01b610a2f565b6103c467e0c61af61fd1460660c01b610a2f565b6103d867e9cc2a7b0cadd6fb60c01b610a2f565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008481526020019081526020016000205414159050919050565b600061044967aed69dd8dcd7982060c01b610a2f565b8161045e67e886a3ab1c8058aa60c01b610a2f565b6104726787ef80a673b3e25160c01b610a2f565b61048667c19f8c9e7d19b25860c01b610a2f565b61048f8161068d565b6104ed576104a7677df873c66b5b729360c01b610a2f565b6104bb67fbb2580bc208bc6160c01b610a2f565b6040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61050167ef94c0c554214ec460c01b610a2f565b61051567aa08abe4f6b74de160c01b610a2f565b610529670f0e98f68a45201560c01b610a2f565b6105328161033c565b6105905761054a67151a369d6337885e60c01b610a2f565b61055e67481a372b1f446afd60c01b610a2f565b6040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6105a467a9758281f089ed6460c01b610a2f565b6105b8678bfea4cdc147623c60c01b610a2f565b6105cc674b5598077ea03e4060c01b610a2f565b6105e0675dd1b0e6a85d03d460c01b610a2f565b6105f467b7bd047be06a9e5c60c01b610a2f565b6106086748ff463c8e6be49c60c01b610a2f565b6002600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16915050919050565b600061065d67da02fe005a3dc44460c01b610a2f565b6106716725fa84122ab618c760c01b610a2f565b61068567ccf254689b8b9f2160c01b610a2f565b600154905090565b60006106a367984f03cdf50fe06e60c01b610a2f565b6106b7675ce8ab4b72748c3260c01b610a2f565b6106cb67d91309bf6ff5856a60c01b610a2f565b600073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600061074f67bd9a4c812861195d60c01b610a2f565b8161076467e886a3ab1c8058aa60c01b610a2f565b6107786787ef80a673b3e25160c01b610a2f565b61078c67c19f8c9e7d19b25860c01b610a2f565b6107958161068d565b6107f3576107ad677df873c66b5b729360c01b610a2f565b6107c167fbb2580bc208bc6160c01b610a2f565b6040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61080767ef94c0c554214ec460c01b610a2f565b61081b67aa08abe4f6b74de160c01b610a2f565b61082f670f0e98f68a45201560c01b610a2f565b6108388161033c565b6108965761085067151a369d6337885e60c01b610a2f565b61086467481a372b1f446afd60c01b610a2f565b6040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6108aa67a9758281f089ed6460c01b610a2f565b6108be678bfea4cdc147623c60c01b610a2f565b6108d267d0fa568d639b3e8d60c01b610a2f565b6108e667a0d80fa9fd49144960c01b610a2f565b6108fa675598aeabbbcb7ae460c01b610a2f565b61090e67494d203d7cbcb8a560c01b610a2f565b6002600084815260200190815260200160002060010154915050919050565b61094167cde80e8e1e08fc5760c01b610a32565b61095567187e9731bb193f4f60c01b610a32565b61096967beae7a017f2d34e260c01b610a32565b610974828234610a35565b5050565b600080600061099167ed949868686b8d1260c01b610a32565b6109a5673b906c9b7ae7a10460c01b610a32565b6109b9672cacacdd2cf4c1cd60c01b610a32565b6109c4868686610e6b565b92509250925093509350939050565b60006109e9673f7055695ce3ef8560c01b610a2f565b6109fd677b88126cb1fdc1bb60c01b610a2f565b610a11679394bda985ac8fae60c01b610a2f565b60026000838152602001908152602001600020600201549050919050565b50565b50565b610a49673a0c4a87fecf963560c01b610a2f565b610a5d672bd3254976dae93260c01b610a2f565b610a7167502a1be2113b979860c01b610a2f565b610a7a8261039a565b15610ad957610a9367abba8d76b9c900a560c01b610a2f565b610aa767f27214e4a690dc3760c01b610a2f565b6040517f3e0827ab00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610aed674c643f751f2ab73f60c01b610a2f565b610b0167b2a3ab68f0b181ad60c01b610a2f565b610b156706986bfe9a22980160c01b610a2f565b610b1e8361068d565b610b6c57610b36671698a272f036882a60c01b610a2f565b610b4a67c10cc7502f6ff78960c01b610a2f565b610b5e67140cd04f84fa9ee260c01b610a2f565b610b67836112e8565b610b81565b610b8067fe18242c64945aaa60c01b610a2f565b5b610b95673c9c11fc393f04d060c01b610a2f565b610ba9674026e1daa65135b260c01b610a2f565b610bb28361033c565b15610c1157610bcb67ac224039435d53fc60c01b610a2f565b610bdf67167ae430415d1b9c60c01b610a2f565b6040517f04a5e67c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610c2567534a264b587c364a60c01b610a2f565b610c3967958e8a717acac99a60c01b610a2f565b610c4d67bb566f90f7e0a50260c01b610a2f565b60008111610caf57610c6967cc801ca06947219860c01b610a2f565b610c7d67e61db34e172e76de60c01b610a2f565b6040517fa0d26eb600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610cc367ad0adb5e279f200060c01b610a2f565b610cd76707ef384b7c22c6b060c01b610a2f565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002081905550610d3f67d2bc92c8b37d4da860c01b610a2f565b610d5367eda1e4b4f87c4fba60c01b610a2f565b6002600084815260200190815260200160002060010154811115610e5157610d856727d7a5009a5b578060c01b610a2f565b610d9967217bfbece521340a60c01b610a2f565b336002600085815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610e02670e19f748a78ec90b60c01b610a2f565b806002600085815260200190815260200160002060010181905550610e31671a47dcfeeb3e0fcd60c01b610a2f565b816002600085815260200190815260200160002060030181905550610e66565b610e65677cc72df97ee8c02760c01b610a2f565b5b505050565b6000806000610e84672028666160a8e15660c01b610a2f565b610e9867ce31f210b2b073c460c01b610a2f565b610eac677b53ee604583044960c01b610a2f565b6000610eba338888886102c7565b9050610ed06777b15dd3eda0981560c01b610a2f565b610ee467c1e8ef3d4f5bbb5960c01b610a2f565b610eed8761068d565b610f4b57610f0567f69773df0202c39d60c01b610a2f565b610f19675eb2567c35147bc860c01b610a2f565b6040517fe6759c6700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610f5f67350d71ce63fe72b160c01b610a2f565b610f736715ff0248a17d606060c01b610a2f565b610f8767888d747a983a14fb60c01b610a2f565b610f908761033c565b610fee57610fa8678879f3b20fffeb6560c01b610a2f565b610fbc679930a00304a2017260c01b610a2f565b6040517f9eafe1b700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61100267ed0bde6a519c817060c01b610a2f565b61101667e1e1978c699efb0860c01b610a2f565b61102a67a7f360f11c28552f60c01b610a2f565b6110338161039a565b6110915761104b676a6295a6751e02d560c01b610a2f565b61105f679d560aa44d748bab60c01b610a2f565b6040517f99d1f42800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6110a56770286c23e28b90fb60c01b610a2f565b6110b9677ae1344eeaff529e60c01b610a2f565b6110cd6784b7ba4f678ad19260c01b610a2f565b60006110e367c928643844970b6a60c01b610a2f565b6110f767db9df4668f28dbb060c01b610a2f565b81600260008a815260200190815260200160002060030154146112025761112867566685b5af11bac360c01b610a2f565b61113c67daba56d51aea9ae060c01b610a2f565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008381526020019081526020016000205490506111a267ad5096049c9f358e60c01b610a2f565b6111b66757f4c8a4f11090d260c01b610a2f565b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156111fc573d6000803e3d6000fd5b50611217565b61121667533f21d86725dd5c60c01b610a2f565b5b61122b6740d0f383e83f965f60c01b610a2f565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008381526020019081526020016000206000905561129267aa4f17d70aba54aa60c01b610a2f565b6112a66756352dde4e76f69960c01b610a2f565b81600260008a8152602001908152602001600020600301541481600260008b815260200190815260200160002060030154945094509450505093509350939050565b6112fc67c898fa74e0f77d2660c01b610a2f565b61131067d26b723f8f72b8c360c01b610a2f565b6000600260008381526020019081526020016000206001018190555061134067b0d608ecf67f895c60c01b610a2f565b60006002600083815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506113aa67faf898b5fb9f233460c01b610a2f565b600154426113b891906117bd565b600260008381526020019081526020016000206002018190555050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611405826113da565b9050919050565b611415816113fa565b811461142057600080fd5b50565b6000813590506114328161140c565b92915050565b6000819050919050565b61144b81611438565b811461145657600080fd5b50565b60008135905061146881611442565b92915050565b6000819050919050565b6114818161146e565b811461148c57600080fd5b50565b60008135905061149e81611478565b92915050565b600080600080608085870312156114be576114bd6113d5565b5b60006114cc87828801611423565b94505060206114dd87828801611459565b93505060406114ee87828801611459565b92505060606114ff8782880161148f565b91505092959194509250565b61151481611438565b82525050565b600060208201905061152f600083018461150b565b92915050565b60006020828403121561154b5761154a6113d5565b5b600061155984828501611459565b91505092915050565b60008115159050919050565b61157781611562565b82525050565b6000602082019050611592600083018461156e565b92915050565b6115a1816113fa565b82525050565b60006020820190506115bc6000830184611598565b92915050565b6115cb8161146e565b82525050565b60006020820190506115e660008301846115c2565b92915050565b60008060408385031215611603576116026113d5565b5b600061161185828601611459565b925050602061162285828601611459565b9150509250929050565b600080600060608486031215611645576116446113d5565b5b600061165386828701611459565b935050602061166486828701611459565b92505060406116758682870161148f565b9150509250925092565b6000606082019050611694600083018661156e565b6116a160208301856115c2565b6116ae604083018461150b565b949350505050565b60008160601b9050919050565b60006116ce826116b6565b9050919050565b60006116e0826116c3565b9050919050565b6116f86116f3826113fa565b6116d5565b82525050565b6000819050919050565b61171961171482611438565b6116fe565b82525050565b6000819050919050565b61173a6117358261146e565b61171f565b82525050565b600061174c82876116e7565b60148201915061175c8286611708565b60208201915061176c8285611708565b60208201915061177c8284611729565b60208201915081905095945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006117c88261146e565b91506117d38361146e565b92508282019050808211156117eb576117ea61178e565b5b9291505056fea264697066735822122003e1f9326641eb896444d88f8cf5265d01e5601b4d12fdbc0555e413c6be6c6d64736f6c63430008130033";

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
