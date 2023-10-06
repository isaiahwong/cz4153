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
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();

        // Once we have the address, we can initialize the application.

        // First we check the network
        this._checkNetwork();

        this._initialize(signer.address);

    }

    _initialize(userAddress: string) {
        // This method initializes the dapp

        this.setState({
            selectedAddress: userAddress,
        });
    }

    // This method checks if the selected network is Localhost:8545
    _checkNetwork() {
        // if (window.ethereum.networkVersion !== App.HARDHAT_NETWORK_ID) {
        //     this._switchChain();
        // }
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
