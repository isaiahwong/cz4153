import {DNSRegistry__factory, IRegistrar__factory} from "../typechain-types";
import {ContractEventPayload, ethers, JsonRpcSigner, namehash} from "ethers";
import {dnsContract} from "../contract/contract";

export interface TLD {
    name: string;
    owner: string;
}

type DomainRegisteredCB = ((event: any, a1: any, a2: any) => void);

export class DNSContract {
    readonly address: string;
    readonly EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
    readonly EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

    constructor(address: string, provider?: any) {
        this.address = address;
    }

    removeTLD(tld: string, domain: string) {
        return domain.replace(tld, '').replace('.', '');
    }

    async isAvailable(provider: any, tld: string, subdomain: string) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const namehash = ethers.namehash(`${subdomain}.${tld}`);
        return dnsRegistry.available(namehash);
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

    async getAddr(provider: any, tld: string) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        return dnsRegistry.addr(namehash(tld))
    }

    async isExpired(provider: any, tld: string, subdomain: string) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));
        return registrar.hasSubdomainExpired(subdomainHash);
    }

    async commit(provider: any, signer: JsonRpcSigner, secret: string, tld: string, subdomain: string, value: string) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));
        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        await registrar.connect(signer).commit(subdomainHash, secret, {value: ethers.parseEther(value)});
    }

    async reveal(provider: any, signer: JsonRpcSigner, secret: string, tld: string, subdomain: string, value: string) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));
        await registrar.connect(signer).revealRegister(subdomain, secret, ethers.parseEther(value));
    }

    async getTLDs(provider: any): Promise<TLD[]> {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const filter = dnsRegistry.filters.NewDomainOwner(this.EMPTY_BYTES32);

        const events = (await dnsRegistry.queryFilter(filter,)).map<TLD>(e => ({
            name: e.args[2],
            owner: e.args[3]
        }));
        return events;
    }

    async getAuctionDuration(provider: any, tld: string) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        return registrar.getAuctionDuration();
    }

    async getAuctionDeadline(provider: any, tld: string, subdomain: string) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        return registrar.auctionDeadline(subdomainHash);
    }

    async querySubdomainRegistered(provider: any, tld: string, subdomain: string) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.SubdomainRegistered(undefined, tldHash, subdomainHash);
        return await registrar.queryFilter(filter);
    }

    async querySubdomainBidFailed(provider: any, tld: string, subdomain: string) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.SubdomainBidFailed(undefined, tldHash, subdomainHash);
        return await registrar.queryFilter(filter);
    }


    async onRegisteredDomains(provider: any, tld: string, subdomain: string, callback: DomainRegisteredCB) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.SubdomainRegistered(undefined, tldHash, subdomainHash);
        await registrar.on(filter, callback);
    }

    async offRegisteredDomains(provider: any, tld: string, subdomain: string, callback: DomainRegisteredCB) {
        const registryAddr = await this.getAddr(provider, tld);
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        const tldHash =ethers.keccak256(ethers.toUtf8Bytes(tld));
        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));

        const filter = registrar.filters.SubdomainRegistered(undefined, tldHash, subdomainHash);
        await registrar.off(filter, callback);
    }
}