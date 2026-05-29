// hardhat.config.ts
// Contract tooling for c3 Key NFT — Hardhat v3 + TypeScript + OpenZeppelin
//
// Authorized by: docs/oar/measures_interoperability/oar2_c3_key_contract_tooling_setup_v1.meta.md
// No deployment without explicit deployment OAR2.
// Secrets are never committed — network accounts use configVariable().

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./contracts/c3-key/test",
  },

  networks: {
    // Placeholders — configVariable() fetches from env at runtime; compile/test work without secrets
    baseSepolia: {
      type: "http",
      chainType: "op",
      url: configVariable("BASE_SEPOLIA_RPC_URL"),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
    },
    base: {
      type: "http",
      chainType: "op",
      url: configVariable("BASE_RPC_URL"),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
    },
  },
});
