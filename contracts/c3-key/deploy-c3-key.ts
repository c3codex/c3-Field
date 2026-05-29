// deploy-c3-key.ts
// Deployment script for C3Key contract.
//
// REQUIRES: Hardhat or Foundry contract tooling configured in this repo.
// Contract tooling is not yet present — see OAR1 carried-forward items.
// DO NOT deploy to mainnet without an explicit deployment OAR2.
// DO NOT deploy to mainnet without auditing the contract first.
//
// Environment variables required (never commit to repo):
//   DEPLOYER_PRIVATE_KEY  — deployer wallet private key
//   ADMIN_ADDRESS         — address to receive DEFAULT_ADMIN_ROLE
//   RPC_URL               — Base mainnet or testnet RPC endpoint
//
// Testnet (Base Sepolia) should be validated before any mainnet deployment.

import { ethers } from "hardhat"

async function main() {
  const adminAddress = process.env.ADMIN_ADDRESS
  if (!adminAddress) throw new Error("ADMIN_ADDRESS env var is required")

  console.log("Deploying C3Key...")
  console.log("Admin address:", adminAddress)

  const C3Key = await ethers.getContractFactory("C3Key")
  const c3Key = await C3Key.deploy(adminAddress)
  await c3Key.waitForDeployment()

  const address = await c3Key.getAddress()
  console.log("C3Key deployed to:", address)
  console.log("Network:", (await ethers.provider.getNetwork()).name)

  // Record deployment address — do not store secrets here.
  // Log to operator trace, not to git.
  console.log("---")
  console.log("Next steps:")
  console.log("  1. Record contract address in operator deployment trace.")
  console.log("  2. Grant MINTER_ROLE and REGISTRAR_ROLE via governed OAR2.")
  console.log("  3. Do not mint live keys until mint eligibility OAR2 is seated.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
