import {DNSRegistry, DNSRegistry__factory} from "../typechain-types";
import {ethers} from "ethers";

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