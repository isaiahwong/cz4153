import {ethers} from "hardhat";
import { expect } from "chai";
import crypto from "crypto";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {Registrar} from "../../typechain-types";
import {move, moveTime} from "../util/time";

const AUCTION_DURATION = 3 * 60; // 3 minutes
let registrar: Registrar;
let registrarOwner: SignerWithAddress;
let buyer: SignerWithAddress;

function randomSecret() {
    return (
        '0x' + crypto.randomBytes(24).toString('hex')
    )
}

before(async () => {
    const accounts = await ethers.getSigners();
    registrarOwner = accounts[0];
    buyer = accounts[2];


    // Deploy Registrar
    const registrarFactory = await ethers.getContractFactory("Registrar");
    registrar = await registrarFactory.connect(registrarOwner).deploy("ntu_registrar", "ntu.dns", "ntu", AUCTION_DURATION);
});

it("should allow commit and reveal", async () => {
    const subdomain = ethers.keccak256(ethers.toUtf8Bytes("student"));
    const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
    const value = ethers.parseEther("0.01");
    const commitment = await registrar.connect(buyer).makeSubdomainCommitment(subdomain, secret, value);

    const commitTx = await registrar.connect(buyer).commit(subdomain, commitment, {value});
    await commitTx.wait();

    // Ensure registrar has the correct balance
    expect(await ethers.provider.getBalance(registrar.target)).to.equal(value);

    // Advance time
    await moveTime(AUCTION_DURATION + 1);

    const revealTx = await registrar.connect(buyer).revealRegister(subdomain, secret, value);
    await revealTx.wait();
});