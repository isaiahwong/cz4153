import {Store} from "./store";

export interface Commitment {
    owner: string;
    tld: string;
    domain: string;
    secret: string;
    value: string;
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
        let commitments = await this.store.getItem<Record<string, Commitment[]>>(commitment.owner);
        if (!commitments) {
            commitments = {};
        }
        const key = this.getKey(commitment.domain, commitment.tld);

        if (!(key in commitments)) commitments[key] = [];

        return this.store.setItem(commitment.owner, {
            ...commitments,
            [key]: [...commitments[key], commitment],
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
        const commitments = await this.store.getItem<Record<string, Commitment[]>>(owner);
        if (!commitments || !(key in commitments)) {
            return []
        }

        return commitments[key];
    }

    // Hacky work around for storing failed bids
    async getHighestCommitment(owner: string, tld: string, domain: string) {
        const key = this.getHighKey(domain, tld);
        const commitments = await this.store.getItem<Record<string, Commitment>>(owner);
        if (!commitments || !(key in commitments)) {
            return
        }

        return commitments[key];
    }

    // Hacky work around for storing failed bids
    async storeHighestCommitment(owner: string, tld: string, domain: string) {
        const getHighestCommitment = await this._getHighestCommitment(owner, tld, domain);
        if (!getHighestCommitment) return;

        let commitments = await this.store.getItem<Record<string, Commitment[]>>(getHighestCommitment.owner);
        if (!commitments) {
            commitments = {};
        }

        const key = this.getHighKey(getHighestCommitment.domain, getHighestCommitment.tld);

        return this.store.setItem(getHighestCommitment.owner, {
            ...commitments,
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
        if (commitments.length === 0) return ;
        return commitments.reduce((prev, current) => {
            return prev.value > current.value ? prev : current;
        });
    }
}

export default new CommitmentStore("commitment");