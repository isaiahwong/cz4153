import {HardhatUserConfig} from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "@typechain/hardhat";
import "solidity-coverage";

import "./scripts/auction_duration.local";
import "./scripts/auction_duration.sepolia";
import "./scripts/transfer.local";


dotenv.config();

const {SEPOLIA_URL, DEPLOYER_PRIVATE_KEY} = process.env;

const dynamicConfig = {
    sepolia: {
        url: SEPOLIA_URL,
        timeout: 30000,
        accounts: [`0x${DEPLOYER_PRIVATE_KEY}`]
    },
}

if (!DEPLOYER_PRIVATE_KEY) {
    // @ts-ignore
    delete dynamicConfig.sepolia;
}

declare module "hardhat/types/config" {
    interface HardhatUserConfig {
        client: Array<string>
    }
}

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        ...dynamicConfig,
        hardhat: {
            mining: {
                auto: true,
                interval: 5000
            },
            accounts: [
                {
                    privateKey: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `c9c2066643c604f7895a266b237ceca51f0d5f1d53121b83b3be04bdf1bb43c2`,
                    balance: "100000000000000000000000000",
                },
                {
                    privateKey: `6fc3ab60dc7eaee5db6d667f21057054c6f6d9b451706234a1c7c79038bd4d42`,
                    balance: "100000000000000000000000000",
                }
            ]
        },
    },
    typechain: {
        outDir: "frontend/src/api/typechain-types",
    },
    client: ["./", "./frontend/src/api"],
};

export default config;
