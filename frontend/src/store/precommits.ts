import {Store} from "./store";
import {Commitment} from "./commits";

class PrecommitmentStore extends Store {
    constructor(name: string) {
        super(name);
    }

    getKey(subdomain: string, tld: string) {
        return `${subdomain}.${tld}`;
    }

    async addCommit(commitment: Commitment) {
        let commitmentStore = await this.store.getItem<Record<string, Commitment>>(commitment.owner);
        if (!commitmentStore) {
            commitmentStore = {};
        }
        const key = this.getKey(commitment.domain, commitment.tld);

        return this.store.setItem(commitment.owner, {
            ...commitmentStore,
            [key]: commitment,
        });
    }

    async deleteCommitment(owner: string, tld: string, domain: string) {
        const key = this.getKey(domain, tld);
        const commitmentStore = await this.store.getItem<Record<string, Commitment>>(owner);
        if (!commitmentStore || !(key in commitmentStore)) {
            return
        }
        delete commitmentStore[key];
        return this.store.setItem(owner, commitmentStore);
    }

    async getCommitment(owner: string, tld: string, domain: string) {
        const key = this.getKey(domain, tld);
        const commitmentStore = await this.store.getItem<Record<string, Commitment>>(owner);
        if (!commitmentStore || !(key in commitmentStore)) {
            return null;
        }

        return commitmentStore[key];
    }
}

export default new PrecommitmentStore("precommitment");