import {Store} from "./store";

export interface FQDN {
    name: string;
    available: boolean;
}

// Full Qualified Domain Name
class FQDNStore extends Store {
    constructor(name: string) {
        super(name);
    }

    async setFQDN(fqdn: FQDN) {
        return this.store.setItem(fqdn.name, fqdn.available);
    }

    async getFqdn(fqdn: string): Promise<FQDN> {
        const avail = await this.store.getItem<boolean>(fqdn);
        if (avail === null) {
            return {
                name: fqdn,
                available: true
            }
        }
        return {
            name: fqdn,
            available: avail
        }
    }


    async getFQDNs() {
        const domains = []
        const domainNames = await this.store.keys();

        for (const domainName of domainNames) {
            domains.push(await this.getFqdn(domainName));
        }

        return domains;
    }

    async getFQDNMaps(tld: string) {
        const domains: Record<string, boolean> = {}
        const domainNames = await this.store.keys();

        for (const domainName of domainNames) {
            if (domainName.split(".").pop() !== tld) {
                continue;
            }
            domains[domainName] = (await this.getFqdn(domainName)).available;
        }

        return domains;
    }
}

export default new FQDNStore("domain");