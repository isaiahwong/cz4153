import namehash from "eth-ens-namehash";
import {ethers, userConfig} from "hardhat";
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

    const json = { ...contracts };
    await Promise.all(
        paths.map((p) =>
            fs.writeFile(`${p}/addresses${prefix}.json`, JSON.stringify(json, null, 2), "utf8")
        )
    );
}

export async function deployDNS(deployer: SignerWithAddress): Promise<DNSRegistry> {
    const dnsFactory = await ethers.getContractFactory("DNSRegistry");
    return dnsFactory.connect(deployer).deploy();
}

export async function deployRegistrar(
    deployer: SignerWithAddress,
    dns: DNSRegistry,
    tld: string,
    auctionDuration: number,
): Promise<Registrar> {
    const fqdn = ethers.namehash(tld)
    const registrarFactory = await ethers.getContractFactory("Registrar");
    const registrar = await registrarFactory.connect(deployer).deploy(tld, `${tld}.dns`, fqdn, auctionDuration, dns.target);

    // Set registrar as owner of TLD
    await dns.setSubDomain(
        EMPTY_BYTES32,
        tld,
        registrar.target,
    );
    return registrar;
}