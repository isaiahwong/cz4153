import {Store} from "./store";

export interface Commitment {
    owner: string;
    tld: string;
    domain: string;
    secret: string;
    value: string;
    timestamp: number;
}

class CommitmentStore extends Store {
    constructor(name: string) {
        super(name);
    }

    getKey(subdomain: string, tld: string) {
        return `${subdomain}.${tld}`;
    }

    getHighKey(subdomain: string, tld: string) {
        return `${subdomain}.${tld}.high`;
    }

    async addCommit(commitment: Commitment) {
        let commitmentStore = await this.store.getItem<Record<string, Commitment[]>>(commitment.owner);
        if (!commitmentStore) {
            commitmentStore = {};
        }
        const key = this.getKey(commitment.domain, commitment.tld);

        if (!(key in commitmentStore)) commitmentStore[key] = [];

        return this.store.setItem(commitment.owner, {
            ...commitmentStore,
            [key]: [...commitmentStore[key], commitment],
        });
    }

    async deleteCommitment(owner: string, tld: string, domain: string) {
        const key = this.getKey(domain, tld);
        const commitments = await this.store.getItem<Record<string, Commitment>>(owner);
        if (!commitments || !(key in commitments)) {
            return
        }
        delete commitments[key];
        return this.store.setItem(owner, commitments);
    }

    async getCommitments(owner: string, tld: string, domain: string) {
        const key = this.getKey(domain, tld);
        const commitmentStore = await this.store.getItem<Record<string, Commitment[]>>(owner);
        if (!commitmentStore || !(key in commitmentStore)) {
            return []
        }

        return commitmentStore[key];
    }

    async getAllUserCommits(
        owner: string
    ): Promise<Array<{ tld: string; subdomain: string }>> {
        const commitments = await this.store.getItem<Record<string, Commitment>>(
            owner
        );
        if (!commitments) {
            return [];
        }

        // Extract TLDs and subdomains from commitments
        const committedTLDsAndSubdomains: Array<{
            tld: string;
            subdomain: string;
        }> = [];
        for (const key of Object.keys(commitments)) {
            // hack workaround for ignoring the high key
            if (key.includes("high")) continue;
            const [subdomain, tld] = key.split(".");
            committedTLDsAndSubdomains.push({ tld, subdomain });
        }
        return committedTLDsAndSubdomains;
    }

    // Hacky work around for storing failed bids
    async getHighestCommitment(owner: string, tld: string, domain: string) {
        const key = this.getHighKey(domain, tld);
        const commitmentStore = await this.store.getItem<Record<string, Commitment>>(owner);
        if (!commitmentStore || !(key in commitmentStore)) {
            return
        }

        return commitmentStore[key];
    }

    // Hacky work around for storing failed bids
    async storeHighestCommitment(owner: string, tld: string, domain: string) {
        const getHighestCommitment = await this._getHighestCommitment(owner, tld, domain);
        if (!getHighestCommitment) return;
        console.log(getHighestCommitment)
        let commitmentStore = await this.store.getItem<Record<string, Commitment[]>>(getHighestCommitment.owner);
        if (!commitmentStore) {
            commitmentStore = {};
        }

        const key = this.getHighKey(getHighestCommitment.domain, getHighestCommitment.tld);

        return this.store.setItem(getHighestCommitment.owner, {
            ...commitmentStore,
            [key]: getHighestCommitment,
        });
    }

    // Hacky work around for storing failed bids
    async deleteHighestCommitment(owner: string, tld: string, domain: string) {
        const key = this.getHighKey(domain, tld);
        const commitments = await this.store.getItem<Record<string, Commitment>>(owner);

        if (!commitments || !(key in commitments)) {
            return
        }
        delete commitments[key];
        return this.store.setItem(owner, commitments);
    }

    async _getHighestCommitment(owner: string, tld: string, domain: string) {
        const commitments = await this.getCommitments(owner, tld, domain);
        if (commitments.length === 0) return;
        console.log(commitments)
        return commitments.reduce((prev, current) => {
            if (prev.value === current.value) {
                return prev.timestamp < current.timestamp ? prev : current;
            } else {
                return prev.value > current.value ? prev : current;
            }
        });
    }
}

export default new CommitmentStore("commitment");