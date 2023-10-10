/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "Auction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Auction__factory>;
    getContractFactory(
      name: "Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Errors__factory>;
    getContractFactory(
      name: "IAuction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAuction__factory>;
    getContractFactory(
      name: "IRegistrar",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRegistrar__factory>;
    getContractFactory(
      name: "AuctionMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AuctionMock__factory>;
    getContractFactory(
      name: "Registrar",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Registrar__factory>;
    getContractFactory(
      name: "DNSRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DNSRegistry__factory>;
    getContractFactory(
      name: "Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Errors__factory>;
    getContractFactory(
      name: "IDNS",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDNS__factory>;

    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ERC721",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "IERC721Metadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "Auction",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Auction>;
    getContractAt(
      name: "Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Errors>;
    getContractAt(
      name: "IAuction",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAuction>;
    getContractAt(
      name: "IRegistrar",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IRegistrar>;
    getContractAt(
      name: "AuctionMock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AuctionMock>;
    getContractAt(
      name: "Registrar",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Registrar>;
    getContractAt(
      name: "DNSRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DNSRegistry>;
    getContractAt(
      name: "Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Errors>;
    getContractAt(
      name: "IDNS",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDNS>;

    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC721>;
    deployContract(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Metadata>;
    deployContract(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721>;
    deployContract(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "Auction",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Auction>;
    deployContract(
      name: "Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Errors>;
    deployContract(
      name: "IAuction",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAuction>;
    deployContract(
      name: "IRegistrar",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IRegistrar>;
    deployContract(
      name: "AuctionMock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AuctionMock>;
    deployContract(
      name: "Registrar",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Registrar>;
    deployContract(
      name: "DNSRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DNSRegistry>;
    deployContract(
      name: "Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Errors>;
    deployContract(
      name: "IDNS",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDNS>;

    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ERC721",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC721>;
    deployContract(
      name: "IERC721Metadata",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Metadata>;
    deployContract(
      name: "IERC721",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721>;
    deployContract(
      name: "IERC721Receiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "ERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "Auction",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Auction>;
    deployContract(
      name: "Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Errors>;
    deployContract(
      name: "IAuction",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAuction>;
    deployContract(
      name: "IRegistrar",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IRegistrar>;
    deployContract(
      name: "AuctionMock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AuctionMock>;
    deployContract(
      name: "Registrar",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Registrar>;
    deployContract(
      name: "DNSRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DNSRegistry>;
    deployContract(
      name: "Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Errors>;
    deployContract(
      name: "IDNS",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDNS>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}