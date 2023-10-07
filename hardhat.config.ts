import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    client: Array<string>
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 5000
      },
    },
  },
  typechain: {
    outDir: "frontend/src/api/typechain-types",
  },
  client: ["./",  "./frontend/src/api"],
};

export default config;
