import {Store} from "./store";

export interface Domain {
    name: string;
    available: boolean;
}

class DomainStore extends Store {
    constructor(name: string) {
        super(name);
    }

    async setDomain(domain: Domain) {
        return this.store.setItem(domain.name, domain.available);
    }

    async getDomain(domain: string): Promise<Domain> {
        const avail = await this.store.getItem<boolean>(domain);
        if (avail === null) {
            return {
                name: domain,
                available: true
            }
        }
        return {
            name: domain,
            available: avail
        }
    }


    async getDomains() {
        const domains = []
        const domainNames = await this.store.keys();

        for (const domainName of domainNames) {
            domains.push(await this.getDomain(domainName));
        }

        return domains;
    }

    async getDomainsMap(tld: string) {
        const domains: Record<string, boolean> = {}
        const domainNames = await this.store.keys();

        for (const domainName of domainNames) {
            if (domainName.split(".").pop() !== tld) {
                continue;
            }
            domains[domainName] = (await this.getDomain(domainName)).available;
        }

        return domains;
    }
}

export default new DomainStore("domain");