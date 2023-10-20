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

    async getHighestCommitment(owner: string, tld: string, domain: string) {
        const commitments = await this.getCommitments(owner, tld, domain);
        if (commitments.length === 0) return null;
        return commitments.reduce((prev, current) => {
            return prev.value > current.value ? prev : current;
        });
    }

    // async getCommit(owner: string, tld: string, subdomain: string) {
    //     const key = this.getKey(subdomain, tld);
    //     const commitments = await this.store.getItem<Record<string, Commitment>>(owner);
    //     if (!commitments || !(key in commitments)) {
    //         return null
    //     }
    //
    //     return commitments[key];
    // }

}

export default new CommitmentStore("commitment");