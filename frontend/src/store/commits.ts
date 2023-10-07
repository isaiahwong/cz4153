import {Store} from "./store";

export interface Commitment {
    owner: string;
    tld: string;
    subdomain: string;
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
        let commitments = await this.store.getItem<Record<string, Commitment>>(commitment.owner);
        if (!commitments) {
            commitments = {};
        }
        return this.store.setItem(commitment.owner, {
            ...commitments,
            [this.getKey(commitment.subdomain, commitment.tld)]: commitment
        });
    }

    async deleteCommit(commitment: Commitment) {
        const key = this.getKey(commitment.subdomain, commitment.tld);
        const commitments = await this.store.getItem<Record<string, Commitment>>(commitment.owner);
        if (!commitments || !(key in commitments)) {
            return
        }
        delete commitments[key];
        return this.store.setItem(commitment.owner, commitments);
    }

    async getCommit(owner: string, tld: string, subdomain: string) {
        const key = this.getKey(subdomain, tld);
        const commitments = await this.store.getItem<Record<string, Commitment>>(owner);
        if (!commitments || !(key in commitments)) {
            return null
        }

        return commitments[key];
    }

}

export default new CommitmentStore("commitment");