import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers";

declare var window: any


class App extends React.Component<any, any> {
    static HARDHAT_NETWORK_ID = '31337';

    _provider: any;
    constructor(props: any) {
        super(props);
        this.state = {
            selectedAddress: undefined,
        };
    }

    componentDidMount() {
        this._connectWallet();
    }

    async _connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.

        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.request({method: 'eth_requestAccounts'});

        // Once we have the address, we can initialize the application.

        // First we check the network
        this._checkNetwork();

        this._initialize(selectedAddress);

    }

    async _switchChain() {
        const chainIdHex = `0x${App.HARDHAT_NETWORK_ID.toString()}`
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: chainIdHex}],
        });
        await this._initialize(this.state.selectedAddress);
    }

    async _initializeEthers() {

        this._provider = new ethers.BrowserProvider(window.ethereum);

        // Then, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        // this._token = new ethers.Contract(
        //     contractAddress.Token,
        //     TokenArtifact.abi,
        //     this._provider.getSigner(0)
        // );
    }

    _initialize(userAddress: string) {
        // This method initializes the dapp

        this.setState({
            selectedAddress: userAddress,
        });

        this._initializeEthers();
    }

    // This method checks if the selected network is Localhost:8545
    _checkNetwork() {
        if (window.ethereum.networkVersion !== App.HARDHAT_NETWORK_ID) {
            this._switchChain();
        }
    }

    render() {
        console.log(this.state.selectedAddress)
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <p
                        className="App-link"
                        onClick={this._connectWallet.bind(this)}
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </p>
                </header>
            </div>
        );
    }


}

export default App;
