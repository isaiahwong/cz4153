import {DNSRegistry__factory, IRegistrar__factory} from "../typechain-types";
import {ethers, JsonRpcSigner, namehash} from "ethers";
import localAddress from "../addresses.local.json";
import sepoliaAddress from "../addresses.sepolia.json";
import {Commitment} from "../../store/commits";
import {getBlockTime} from "../../common/common";


export interface TLD {
    name: string;
    owner: string;
}

export interface Auction {
    domain: string;
    tld: string;
    duration: number;
    deadline: number;
}

export interface Domain {
    name: string;
    tld: string;
    owner: string;
    expires: number;
}

type DomainRegisteredCB = ((event: any, a1: any, a2: any) => void);

export enum Chain {
    local = 31337,
    sepolia = 11155111,
}

export class DNSContract {
    private address: string;
    readonly EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
    readonly EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

    constructor(address: string) {
        this.address = address;
    }

    async changeAddress(chain: number) {
        if (chain === Chain.sepolia.valueOf()) {
            this.address = sepoliaAddress.dns;
        } else {
            this.address = localAddress.dns;
        }
    }

    async getExpiry(provider: any, tld: string, subdomain: string) {
        const registrar = await this.getRegistrar(provider, tld);
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));
        return registrar.expiry(domainHash);
    }

    async isAvailable(provider: any, tld: string, domain: string) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const namehash = ethers.namehash(`${domain}.${tld}`);
        const registrar = await this.getRegistrar(provider, tld);
        const expired = await registrar.hasDomainExpired(ethers.keccak256(ethers.toUtf8Bytes(domain)));
        const auctionOnGoing = await this.isAuctionOngoing(provider, tld, domain);

        return ((await dnsRegistry.available(namehash)) && expired) || auctionOnGoing;
    }

    async getRegistrar(provider: any, tld: string) {
        const registryAddr = await this.getAddr(provider, tld);
        if (registryAddr === this.EMPTY_ADDRESS) {
            throw new Error(`TLD ${tld} is not registered`);
        }
        return IRegistrar__factory.connect(registryAddr, provider);
    }

    /**
     * Checks if a TLD is valid
     * @param provider
     * @param tld
     */
    async isValidTLD(provider: any, tld: string) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const namehash = ethers.namehash(tld);
        // Available TLD means it is not registered
        return !(await dnsRegistry.available(namehash));
    }

    async getAddr(provider: any, domain: string) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        return dnsRegistry.addr(namehash(domain))
    }

    async isExpired(provider: any, tld: string, domain: string) {
        const registrar = await this.getRegistrar(provider, tld);
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(domain));
        return registrar.hasDomainExpired(domainHash);
    }

    async setCName(provider: any, signer: JsonRpcSigner, tld: string, domain: string) {
        const registrar = await this.getRegistrar(provider, tld);
        await registrar.connect(signer).setCName(domain);
    }

    cname(provider: any, address: string) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        return dnsRegistry.cname(address);
    }

    async commit(provider: any, signer: JsonRpcSigner, secret: string, tld: string, domain: string, value: string) {
        const registrar = await this.getRegistrar(provider, tld);
        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));

        return await registrar.connect(signer).commit(domain, secret, {value: ethers.parseEther(value)});
    }

    async makeCommitment(provider: any, signer: JsonRpcSigner, secret: string, tld: string, domain: string, value: string) {
        const registrar = await this.getRegistrar(provider, tld);
        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(domain));

        return registrar.connect(signer).makeDomainCommitment(domainHash, secret, ethers.parseEther(value));
    }

    async reveal(provider: any, signer: JsonRpcSigner, secret: string, tld: string, subdomain: string, value: string) {
        const registrar = await this.getRegistrar(provider, tld);
        return await registrar.connect(signer).revealRegister(subdomain, secret, ethers.parseEther(value));
    }

    async batchReveal(provider: any, signer: JsonRpcSigner, commitments: Commitment[]) {
        const registrar = await this.getRegistrar(provider, commitments[0].tld);
        const params = commitments.map(c =>
            ({
                domain: c.domain,
                secret: c.secret,
                value: ethers.parseEther(c.value),
            })
        );
        return await registrar.connect(signer).batchRevealRegister(params);
    }

    async getTLDs(provider: any): Promise<TLD[]> {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const filter = dnsRegistry.filters.NewDomainOwner(this.EMPTY_BYTES32);

        return (await dnsRegistry.queryFilter(filter,)).map<TLD>(e => ({
            name: e.args.domainPlainText,
            owner: e.args.owner,
        }));
    }

    async getActiveAuctions(provider: any) {
        const tlds = await dnsContract.getTLDs(provider);
        const now = await getBlockTime(provider);
        return Promise.all(
            tlds.map((tld) => dnsContract.getAuctions(provider, tld.name))
        )
            .then((results) => results.flatMap((events) => events))
            .then((events) => events.map((event) => event.args))
            .then((args) => args.filter((arg) =>
                arg.deadline > BigInt(now)
            ))
            .then((args) => args.map<Auction>((arg) => ({
                domain: arg.domain,
                tld: arg.tld,
                duration: Number(arg.duration),
                deadline: Number(arg.deadline),
            })).sort((a, b) => a.tld > b.tld ? 1 : -1));
    }

    async getAuctions(provider: any, tld: string) {
        const registrar = await this.getRegistrar(provider, tld);
        const filter = registrar.filters.DomainAuctionStarted(undefined, undefined, undefined, undefined);
        return await registrar.queryFilter(filter);
    }

    async getAuctionDuration(provider: any, tld: string) {
        const registrar = await this.getRegistrar(provider, tld);
        return registrar.getAuctionDuration();
    }

    async getAuctionDeadline(provider: any, tld: string, subdomain: string) {
        const registrar = await this.getRegistrar(provider, tld);
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        return registrar.auctionDeadline(domainHash);
    }

    async isAuctionOngoing(provider: any, tld: string, domain: string) {
        const now = await getBlockTime(provider);
        const deadline = await this.getAuctionDeadline(provider, tld, domain);
        return deadline > BigInt(now);
    }

    async getDomainBidFailed(provider: any, tld: string, subdomain: string) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash = ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.DomainBidFailed(undefined, tldHash, domainHash);
        return await registrar.queryFilter(filter);
    }

    async getAllDomainRegistered(provider: any) {
        const tlds = await dnsContract.getTLDs(provider);
        const now = await getBlockTime(provider);
        return Promise.all(
            tlds.map((tld) =>
                dnsContract.getDomainRegistered(provider, tld.name, undefined, undefined)
            ))
            .then((results) => results.flatMap((events) => events))
            .then((events) => events.map((event) => event.args))
            .then((args) => args.filter((arg) =>
                arg.expires > BigInt(now)
            ))
            .then((args) => args.map<Domain>((arg) => ({
                name: arg.domain,
                tld: arg.tld,
                owner: arg.owner,
                expires: Number(arg.expires)
            })).sort((a, b) => a.tld > b.tld ? 1 : -1));
    }

    async getDomainRegistered(provider: any, tld: string, owner: string | undefined, subdomain: string | undefined) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash = ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash = (subdomain && ethers.keccak256(ethers.toUtf8Bytes(subdomain))) || undefined;

        const filter = registrar.filters.DomainRegistered(owner, tldHash, domainHash);
        return await registrar.queryFilter(filter);
    }

    async onRegisteredDomains(provider: any, tld: string, subdomain: string, callback: DomainRegisteredCB) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash = ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.DomainRegistered(undefined, tldHash, domainHash);
        await registrar.on(filter, callback);
    }

    async offRegisteredDomains(provider: any, tld: string, subdomain: string, callback: DomainRegisteredCB) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash = ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.DomainRegistered(undefined, tldHash, domainHash);
        await registrar.off(filter, callback);
    }
}

export const dnsContract = new DNSContract(localAddress.dns);

export const setDNSAddr = (chain: number) => {
    return dnsContract.changeAddress(chain);
}