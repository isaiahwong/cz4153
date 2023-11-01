# CZ4153 - Decentralized DNS
The following repo defines the implementation of a decentralized DNS on the Ethereum blockchain. The DNS is fully decentralized featuring smart contracts and a frontend built with [React](https://react.dev/). 
### Members
- Isaiah Wong
- Jefferson Liew
- Ye Xin

# Contents
1. [Setting up Environment](#setting-up-environment)
2. [Quickstart](#quickstart-)
3. [Running Locally](#running-locally)
4. [Deploying to Sepolia](#deploying-to-sepolia)
5. [Configuration](#configuration-after-deployment)


# Setting up Environment

The dApp is a React SPA that utilizes NodeJS and Metamask. You can install the following with the links supplied below. 
- [NodeJS](https://nodejs.org/en)
- [Metamask](https://metamask.io/download/)

# Quickstart 
The smart contracts have been deployed on the testnet `Sepolia network` where you can run the `DNS dApp` directly without running a local node.

### 1. Enable testnet on metamask
1. On Metamask, select networks and enable test networks.
2. Select `Sepolia` network.

### 2. Getting ether for Sepolia testnet
In order to interact with the dApp, you require some ether. You can attain some from [Sepolia Faucet](https://sepoliafaucet.com/). Supply your wallet address to attain some ether.

### 3. Running the dApp
```
$ cd frontend && npm i
$ npm run start
```

### Sepolia Deployed Addresses
```
"dns": "0xfD9930AEF55272A37B5FF8C2F588d329148b8ecA",
"ntuRegistrar": "0xC228aB676b1D9E6e49d284bf6b39Ba637a31Fb2e",
"devRegistrar": "0x0A380dd4F81c98412e06b67F2687B0F26b3724aa",
"comRegistrar": "0x0aBacbe7b428d01f7F66DcA4A3347A60278E12cC",
"xyzRegistrar": "0xc9a7d62623ecce9803836c9cAF0EC33526e3bc1c"
```

## Running Locally
Alternatively, you can run your own local node and deploy the contracts locally.

### 1. Install dependencies 
In the root of the project, install the dependencies
```
$ npm i
```

### 2. Run the local Ethereum node via hardhat
Open a new shell and start the hardhat node
```
$ npm run node

or 

$ npx hardhat node
```

### 3. Deploy contracts
Open another new shell and deploy the smart contracts
```
$ npm run deploy
```
> The contract addresses - `address.local.json`, will be generated in the `root folder` and the `frontend` `./frontend/src/api`

### 4. Adding hardhat to metamask
1. On Metamask, select networks and add a new network.
2. Select on `Add a network manually`
3. Fill in localhost network details.
<img src="./screenshots/add_net.png">

### 5. Run the dApp
```
$ cd frontend 
$ npm i
$ npm run start
```

### 6. Transfer test ether to your metamask account
> Remember to reset the EOA nonce when you restart the local node
> `Go to settings > search for nonce > clear activity and nonce data`

```
# npm run transfer 0xfcAD4cD2634878b216404ee9fFF3eDC20Ca08a4a
$ npm run transfer <YOUR_EOA_ADDRESS>
```

### 7. [Optional not recommended] Using preloaded hardhat accounts with test ether
You may add the dummy private keys to metamask to use the preloaded accounts with test ether.

> Warning, delete the private keys after usage as they are exposed in the repo.

1. Keys are under `hardhat.config.ts`
2. Import private key to metamask

# Deploying to Sepolia
You can deploy the contracts to sepolia where the contracts will be updated in source.
> Note: This will override the existing contracts in source.

1. Rename the `.env.cp` to `.env`
```
$ mv .env.cp .env
```

2. Update the environment file with your private key and Node URL such as Infura or Alchemy
```
SEPOLIA_URL=YOUR_NODE_URL
DEPLOYER_PRIVATE_KEY=YOUR_DEPLOYER_PRIVATE_KEY
```

3. Deploy the contracts
```
$ npm run deploy:sepolia
```

# Configuration after deployment 
### Configuring the auction duration
**Parameters**
- `REGISTRAR` - The registrar contract to configure. Refer the list of registrars in `addresses.local.json`.
- `DURATION_IN_SECONDS` - The duration of the auction in seconds.

Local Hardhat
```
#  npm run auction_duration ntuRegistrar 30
$  npm run auction_duration <REGISTRAR> <DURATION_IN_SECONDS>
```

Sepolia
> Ensure that you have deployed a new set of contracts to Sepolia and your `.env` is defined. 
```
# npm run auction_duration:sepolia ntuRegistrar 
# npm run auction_duration:sepolia <REGISTRAR> <DURATION_IN_SECONDS>
```

# Running Tests
```
$ npm run test
```

