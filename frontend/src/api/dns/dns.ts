import {DNSRegistry__factory, IRegistrar__factory} from "../typechain-types";
import {ethers, JsonRpcSigner, namehash} from "ethers";
import localAddress from "../addresses.local.json";
import sepoliaAddress from "../addresses.sepolia.json";


export interface TLD {
    name: string;
    owner: string;
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

    removeTLD(tld: string, domain: string) {
        return domain.replace(tld, '').replace('.', '');
    }

    async getExpiry(provider: any, tld: string, subdomain: string) {
        const registrar = await this.getRegistrar(provider, tld);
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));
        return registrar.expiry(domainHash);
    }

    async isAvailable(provider: any, tld: string, subdomain: string) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const namehash = ethers.namehash(`${subdomain}.${tld}`);
        return dnsRegistry.available(namehash);
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

    async commit(provider: any, signer: JsonRpcSigner, secret: string, tld: string, subdomain: string, value: string) {
        const registrar = await this.getRegistrar(provider, tld);        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        await registrar.connect(signer).commit(domainHash, secret, {value: ethers.parseEther(value)});
    }

    async reveal(provider: any, signer: JsonRpcSigner, secret: string, tld: string, subdomain: string, value: string) {
        const registrar = await this.getRegistrar(provider, tld);
        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));
        await registrar.connect(signer).revealRegister(subdomain, secret, ethers.parseEther(value));
    }

    async getTLDs(provider: any): Promise<TLD[]> {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const filter = dnsRegistry.filters.NewDomainOwner(this.EMPTY_BYTES32);

        return (await dnsRegistry.queryFilter(filter,)).map<TLD>(e => ({
            name: e.args.domainPlainText,
            owner: e.args.owner,
        }));
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

    async hasCommitment(provider: any, signer: JsonRpcSigner, secret: string, tld: string, subdomain: string, value: string) {
        const registrar = await this.getRegistrar(provider, tld);
        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        return registrar.connect(signer).hasDomainCommitment(domainHash, secret, ethers.parseEther(value));
    }

    async getDomainBidFailed(provider: any, tld: string, subdomain: string) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.DomainBidFailed(undefined, tldHash, domainHash);
        return await registrar.queryFilter(filter);
    }

    async getDomainRegistered(provider: any, tld: string, owner: string | undefined, subdomain: string | undefined) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash =  (subdomain && ethers.keccak256(ethers.toUtf8Bytes(subdomain))) || undefined;

        const filter = registrar.filters.DomainRegistered(owner, tldHash, domainHash);
        return await registrar.queryFilter(filter);
    }


    async onRegisteredDomains(provider: any, tld: string, subdomain: string, callback: DomainRegisteredCB) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.DomainRegistered(undefined, tldHash, domainHash);
        await registrar.on(filter, callback);
    }

    async offRegisteredDomains(provider: any, tld: string, subdomain: string, callback: DomainRegisteredCB) {
        const registrar = await this.getRegistrar(provider, tld);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const domainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.DomainRegistered(undefined, tldHash, domainHash);
        await registrar.off(filter, callback);
    }
}

export const dnsContract = new DNSContract(localAddress.dns);

export const setDNSAddr = (chain: number) => {
    return dnsContract.changeAddress(chain);
}