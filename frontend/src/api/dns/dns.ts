import {DNSRegistry, DNSRegistry__factory, IRegistrar__factory} from "../typechain-types";
import {ethers, JsonRpcSigner, namehash} from "ethers";

export interface TLD {
    name: string;
    owner: string;
}

export class DNSContract {
    address: string;
    EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

    constructor(address: string, provider?: any) {
        this.address = address;
    }

    removeTLD(tld: string, domain: string) {
        return  domain.replace(tld, '').replace('.', '');
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

    async commit(provider: any, signer: JsonRpcSigner, secret: string, tld: string, subdomain: string, value: number) {
        const dnsRegistry = DNSRegistry__factory.connect(this.address, provider);
        const registryAddr = await dnsRegistry.addr(namehash(tld))
        const registrar = IRegistrar__factory.connect(registryAddr, provider);
        secret = ethers.keccak256(ethers.toUtf8Bytes(secret));

        const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));
        await registrar.connect(signer).commit(subdomainHash, secret, {value: ethers.parseEther(value.toString())});
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
}