import localForage from "localforage";

export abstract class Store {
    protected  name: string;
    protected store: LocalForage;

    constructor(name: string) {
        this.name = name
        this.store = localForage.createInstance({
            name,
        })
    }

    clear() {
        return this.store.clear();
    }
}