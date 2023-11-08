import {ethers, upgrades, userConfig} from "hardhat";
import crypto from "crypto";
import fs from "fs/promises";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {DNSRegistry, Registrar} from "../frontend/src/api/typechain-types";

const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

export function randomSecret() {
    return (
        '0x' + crypto.randomBytes(24).toString('hex')
    )
}

export async function writeContractAddresses(contracts: Record<string, string>, prefix?: string) {
    const paths = userConfig.client;

    const json = {...contracts};
    await Promise.all(
        paths.map((p) =>
            fs.writeFile(`${p}/addresses${prefix}.json`, JSON.stringify(json, null, 2), "utf8")
        )
    );
}

export async function upgradeDNS(deployer: SignerWithAddress, address: string) {
    const DnsFactory = await ethers.getContractFactory("DNSRegistry");
    // @ts-ignore
    return upgrades.upgradeProxy(address, DnsFactory, {from: deployer});
}

export async function upgradeRegistrar(deployer: SignerWithAddress, address: string) {
    const Registrar = await ethers.getContractFactory("Registrar");
    // @ts-ignore
    return upgrades.upgradeProxy(address, Registrar, {from: deployer});
}

export async function deployDNS(deployer: SignerWithAddress): Promise<DNSRegistry> {
    const DnsFactory = await ethers.getContractFactory("DNSRegistry");
    // @ts-ignore
    return upgrades.deployProxy(DnsFactory, [deployer.address]);
}

export async function deployRegistrar(
    deployer: SignerWithAddress,
    dns: DNSRegistry,
    tld: string,
    auctionDuration: number,
): Promise<Registrar> {
    const fqdn = ethers.namehash(tld)
    const RegistrarFactory = await ethers.getContractFactory("Registrar");

    const registrar = await upgrades.deployProxy(
        // @ts-ignore
        RegistrarFactory,
        [tld, `${tld}.dns`, fqdn, auctionDuration, dns.target],
    );
    registrar.transferOwnership(deployer.address);

    // Set registrar as owner of TLD
    await (await dns.setSubDomain(
        EMPTY_BYTES32,
        tld,
        registrar.target,
    )).wait();

    // @ts-ignore
    return registrar;
}