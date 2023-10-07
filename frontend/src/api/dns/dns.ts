import {DNSRegistry, DNSRegistry__factory} from "../typechain-types";

export interface TLD {
    name: string;
    owner: string;
}

export class DNSContract {
    dnsRegistry: DNSRegistry;

     EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

    constructor(address: string, provider?: any) {
        this.dnsRegistry = DNSRegistry__factory.connect(address, provider);
    }

    async getTLDs(): Promise<TLD[]> {
        const filter = this.dnsRegistry.filters.NewDomainOwner(this.EMPTY_BYTES32);
        const events = (await this.dnsRegistry.queryFilter(filter)).map<TLD>(e => ({
            name: e.args[2],
            owner: e.args[3]
        }));
        return events;
    }
}