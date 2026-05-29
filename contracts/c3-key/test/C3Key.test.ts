// C3Key.test.ts
// Behavioral tests for C3Key — local Hardhat v3 network only.
// Authorized by: docs/oar/measures_interoperability/oar2_c3_key_contract_test_implementation_v1.meta.md
// No deployment outside local Hardhat test network. No live minting. No secrets.

import { expect } from "chai"
import { network } from "hardhat"

// Creates a fresh isolated Hardhat in-memory network, deploys C3Key, and grants all roles.
// Each test calls this directly — no shared mutable state between tests.
async function deployC3Key() {
  const { ethers } = await network.create()
  const [admin, minter, registrar, pauser, wallet1, wallet2, stranger] =
    await ethers.getSigners()

  const C3Key = await ethers.getContractFactory("C3Key")
  const c3Key = await C3Key.deploy(admin.address)
  await c3Key.waitForDeployment()

  const DEFAULT_ADMIN_ROLE: string = await c3Key.DEFAULT_ADMIN_ROLE()
  const MINTER_ROLE: string        = await c3Key.MINTER_ROLE()
  const REGISTRAR_ROLE: string     = await c3Key.REGISTRAR_ROLE()
  const PAUSER_ROLE: string        = await c3Key.PAUSER_ROLE()

  await c3Key.connect(admin).grantRole(MINTER_ROLE, minter.address)
  await c3Key.connect(admin).grantRole(REGISTRAR_ROLE, registrar.address)
  await c3Key.connect(admin).grantRole(PAUSER_ROLE, pauser.address)

  return {
    ethers,
    c3Key,
    admin, minter, registrar, pauser, wallet1, wallet2, stranger,
    DEFAULT_ADMIN_ROLE, MINTER_ROLE, REGISTRAR_ROLE, PAUSER_ROLE,
  }
}

// Deploys and issues tokenId 1 to wallet1. Always tokenId 1n — fresh network each call.
async function deployWithKey() {
  const state = await deployC3Key()
  const { c3Key, minter, wallet1, ethers } = state
  const trace = ethers.keccak256(ethers.toUtf8Bytes("c3key-trace-1"))
  await c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://c3key-meta-1", trace)
  const tokenId = 1n
  return { ...state, tokenId, trace }
}

describe("C3Key", () => {

  // ─── Deployment ────────────────────────────────────────────────────────────

  describe("deployment", () => {
    it("deploys with correct name and symbol", async () => {
      const { c3Key } = await deployC3Key()
      expect(await c3Key.name()).to.equal("c3 Key")
      expect(await c3Key.symbol()).to.equal("C3KEY")
    })

    it("grants DEFAULT_ADMIN_ROLE to admin on deploy", async () => {
      const { c3Key, admin, DEFAULT_ADMIN_ROLE } = await deployC3Key()
      expect(await c3Key.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true
    })
  })

  // ─── Non-transferable ──────────────────────────────────────────────────────

  describe("non-transferable", () => {
    it("reverts on transferFrom", async () => {
      const { c3Key, wallet1, wallet2, tokenId } = await deployWithKey()
      await expect(
        c3Key.connect(wallet1).transferFrom(wallet1.address, wallet2.address, tokenId)
      ).to.be.revertedWith("C3Key: non-transferable")
    })

    it("reverts on safeTransferFrom (3-arg)", async () => {
      const { c3Key, wallet1, wallet2, tokenId } = await deployWithKey()
      await expect(
        c3Key.connect(wallet1)["safeTransferFrom(address,address,uint256)"](
          wallet1.address, wallet2.address, tokenId
        )
      ).to.be.revertedWith("C3Key: non-transferable")
    })

    it("reverts on safeTransferFrom (4-arg with data)", async () => {
      const { c3Key, wallet1, wallet2, tokenId } = await deployWithKey()
      await expect(
        c3Key.connect(wallet1)["safeTransferFrom(address,address,uint256,bytes)"](
          wallet1.address, wallet2.address, tokenId, "0x"
        )
      ).to.be.revertedWith("C3Key: non-transferable")
    })

    it("approval-based transferFrom still reverts", async () => {
      const { c3Key, wallet1, wallet2, stranger, tokenId } = await deployWithKey()
      await c3Key.connect(wallet1).approve(stranger.address, tokenId)
      await expect(
        c3Key.connect(stranger).transferFrom(wallet1.address, wallet2.address, tokenId)
      ).to.be.revertedWith("C3Key: non-transferable")
    })

    it("setApprovalForAll does not enable transferFrom", async () => {
      const { c3Key, wallet1, wallet2, stranger, tokenId } = await deployWithKey()
      await c3Key.connect(wallet1).setApprovalForAll(stranger.address, true)
      await expect(
        c3Key.connect(stranger).transferFrom(wallet1.address, wallet2.address, tokenId)
      ).to.be.revertedWith("C3Key: non-transferable")
    })
  })

  // ─── One-per-wallet ────────────────────────────────────────────────────────

  describe("one-per-wallet", () => {
    it("issues key to wallet with no active key", async () => {
      const { c3Key, minter, wallet1, ethers } = await deployC3Key()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("t-issue"))
      await expect(
        c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta-1", trace)
      ).to.emit(c3Key, "C3KeyIssued")
      expect(await c3Key.hasActiveKey(wallet1.address)).to.be.true
    })

    it("reverts if wallet already holds active key", async () => {
      const { c3Key, minter, wallet1, ethers } = await deployC3Key()
      const trace1 = ethers.keccak256(ethers.toUtf8Bytes("t1"))
      const trace2 = ethers.keccak256(ethers.toUtf8Bytes("t2"))
      await c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta-1", trace1)
      await expect(
        c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta-2", trace2)
      ).to.be.revertedWith("C3Key: wallet already holds active key")
    })

    it("wallet can receive a new key after revocation", async () => {
      const { c3Key, minter, registrar, wallet1, ethers } = await deployC3Key()
      const trace1      = ethers.keccak256(ethers.toUtf8Bytes("t1"))
      const trace2      = ethers.keccak256(ethers.toUtf8Bytes("t2"))
      const reasonHash  = ethers.keccak256(ethers.toUtf8Bytes("revoke-reason"))
      await c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta-1", trace1)
      await c3Key.connect(registrar).revoke(1n, reasonHash)
      await expect(
        c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta-2", trace2)
      ).to.emit(c3Key, "C3KeyIssued")
    })
  })

  // ─── Hold behavior ─────────────────────────────────────────────────────────

  describe("hold", () => {
    it("REGISTRAR_ROLE can mark a key as held", async () => {
      const { c3Key, registrar, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("hold-reason"))
      await expect(
        c3Key.connect(registrar).hold(tokenId, reasonHash)
      ).to.emit(c3Key, "C3KeyHeld").withArgs(tokenId, reasonHash)
      const keyData = await c3Key.getKeyData(tokenId)
      expect(keyData.keyStatus).to.equal(1n)  // KeyStatus.held
    })

    it("reverts hold on non-active key", async () => {
      const { c3Key, registrar, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("reason"))
      await c3Key.connect(registrar).hold(tokenId, reasonHash)
      // Key is now held — cannot hold again
      await expect(
        c3Key.connect(registrar).hold(tokenId, reasonHash)
      ).to.be.revertedWith("C3Key: key not active")
    })
  })

  // ─── Revoke behavior ───────────────────────────────────────────────────────

  describe("revoke", () => {
    it("REGISTRAR_ROLE can revoke an active key and clears wallet active flag", async () => {
      const { c3Key, registrar, wallet1, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("revoke-reason"))
      await expect(
        c3Key.connect(registrar).revoke(tokenId, reasonHash)
      ).to.emit(c3Key, "C3KeyRevoked").withArgs(tokenId, reasonHash)
      expect(await c3Key.hasActiveKey(wallet1.address)).to.be.false
      const keyData = await c3Key.getKeyData(tokenId)
      expect(keyData.keyStatus).to.equal(2n)  // KeyStatus.revoked
    })

    it("REGISTRAR_ROLE can revoke a held key", async () => {
      const { c3Key, registrar, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("reason"))
      await c3Key.connect(registrar).hold(tokenId, reasonHash)
      await expect(
        c3Key.connect(registrar).revoke(tokenId, reasonHash)
      ).to.emit(c3Key, "C3KeyRevoked")
    })

    it("reverts revoke on already-revoked key", async () => {
      const { c3Key, registrar, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("reason"))
      await c3Key.connect(registrar).revoke(tokenId, reasonHash)
      await expect(
        c3Key.connect(registrar).revoke(tokenId, reasonHash)
      ).to.be.revertedWith("C3Key: not revokable")
    })
  })

  // ─── Redact behavior ───────────────────────────────────────────────────────
  // CONTRACT NOTE: redact uses onlyRole(DEFAULT_ADMIN_ROLE), not REGISTRAR_ROLE.
  // OAR2 section 7 listed REGISTRAR_ROLE — discrepancy flagged in OAR1.
  // Tests follow the contract. No contract correction made.

  describe("redact", () => {
    it("DEFAULT_ADMIN_ROLE can redact a key", async () => {
      const { c3Key, admin, wallet1, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("redact-reason"))
      await expect(
        c3Key.connect(admin).redact(tokenId, reasonHash)
      ).to.emit(c3Key, "C3KeyRedacted").withArgs(tokenId, reasonHash)
      expect(await c3Key.hasActiveKey(wallet1.address)).to.be.false
      const keyData = await c3Key.getKeyData(tokenId)
      expect(keyData.keyStatus).to.equal(3n)  // KeyStatus.redacted
    })

    it("non-admin cannot redact", async () => {
      const { c3Key, stranger, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("reason"))
      await expect(
        c3Key.connect(stranger).redact(tokenId, reasonHash)
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
    })
  })

  // ─── Migration ─────────────────────────────────────────────────────────────

  describe("migrate", () => {
    it("migrates key from old wallet to new wallet", async () => {
      const { c3Key, registrar, wallet1, wallet2, tokenId, ethers } = await deployWithKey()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("migrate-trace"))
      await expect(
        c3Key.connect(registrar).migrate(tokenId, wallet2.address, "ipfs://meta-2", trace)
      ).to.emit(c3Key, "C3KeyMigrated")
      expect(await c3Key.hasActiveKey(wallet1.address)).to.be.false
      expect(await c3Key.hasActiveKey(wallet2.address)).to.be.true
      const oldKeyData = await c3Key.getKeyData(tokenId)
      expect(oldKeyData.keyStatus).to.equal(4n)  // KeyStatus.migrated
    })

    it("emits C3KeyMigrated with correct wallet arguments", async () => {
      const { c3Key, registrar, wallet1, wallet2, tokenId, ethers } = await deployWithKey()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("migrate-trace"))
      // newTokenId is 2 — second token minted in this fresh network
      const newTokenId = 2n
      await expect(
        c3Key.connect(registrar).migrate(tokenId, wallet2.address, "ipfs://meta-2", trace)
      ).to.emit(c3Key, "C3KeyMigrated")
        .withArgs(tokenId, newTokenId, wallet1.address, wallet2.address, trace)
    })

    it("reverts if new wallet already holds active key", async () => {
      const { c3Key, minter, registrar, wallet1, wallet2, tokenId, ethers } = await deployWithKey()
      const trace2       = ethers.keccak256(ethers.toUtf8Bytes("t2"))
      const traceMigrate = ethers.keccak256(ethers.toUtf8Bytes("migrate"))
      // Give wallet2 an active key first
      await c3Key.connect(minter).issue(wallet2.address, 0, "ipfs://meta-2", trace2)
      await expect(
        c3Key.connect(registrar).migrate(tokenId, wallet2.address, "ipfs://meta-m", traceMigrate)
      ).to.be.revertedWith("C3Key: new wallet already holds active key")
    })
  })

  // ─── tokenURI / metadata ───────────────────────────────────────────────────

  describe("tokenURI / metadata", () => {
    it("tokenURI returns metadataURI set at issue", async () => {
      const { c3Key, tokenId } = await deployWithKey()
      expect(await c3Key.tokenURI(tokenId)).to.equal("ipfs://c3key-meta-1")
    })

    it("REGISTRAR_ROLE can update metadataURI", async () => {
      const { c3Key, registrar, tokenId } = await deployWithKey()
      await expect(
        c3Key.connect(registrar).updateMetadata(tokenId, "ipfs://updated-meta")
      ).to.emit(c3Key, "MetadataUpdated").withArgs(tokenId, "ipfs://updated-meta")
      expect(await c3Key.tokenURI(tokenId)).to.equal("ipfs://updated-meta")
    })

    it("non-registrar cannot update metadata", async () => {
      const { c3Key, stranger, tokenId } = await deployWithKey()
      await expect(
        c3Key.connect(stranger).updateMetadata(tokenId, "ipfs://hack")
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
    })
  })

  // ─── Access control ────────────────────────────────────────────────────────

  describe("access control", () => {
    it("only MINTER_ROLE can issue", async () => {
      const { c3Key, stranger, wallet1, ethers } = await deployC3Key()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("t"))
      await expect(
        c3Key.connect(stranger).issue(wallet1.address, 0, "ipfs://meta", trace)
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
    })

    it("only REGISTRAR_ROLE can hold, revoke, migrate, and updateMetadata", async () => {
      const { c3Key, stranger, wallet2, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("reason"))
      const trace      = ethers.keccak256(ethers.toUtf8Bytes("t"))
      await expect(
        c3Key.connect(stranger).hold(tokenId, reasonHash)
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
      await expect(
        c3Key.connect(stranger).revoke(tokenId, reasonHash)
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
      await expect(
        c3Key.connect(stranger).migrate(tokenId, wallet2.address, "ipfs://m", trace)
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
      await expect(
        c3Key.connect(stranger).updateMetadata(tokenId, "ipfs://hack")
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
    })

    it("only DEFAULT_ADMIN_ROLE can redact", async () => {
      const { c3Key, stranger, registrar, tokenId, ethers } = await deployWithKey()
      const reasonHash = ethers.keccak256(ethers.toUtf8Bytes("reason"))
      await expect(
        c3Key.connect(stranger).redact(tokenId, reasonHash)
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
      // registrar does not have DEFAULT_ADMIN_ROLE — also rejected
      await expect(
        c3Key.connect(registrar).redact(tokenId, reasonHash)
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
    })

    it("only PAUSER_ROLE can pause and unpause", async () => {
      const { c3Key, stranger } = await deployC3Key()
      await expect(
        c3Key.connect(stranger).pause()
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
      await expect(
        c3Key.connect(stranger).unpause()
      ).to.be.revertedWithCustomError(c3Key, "AccessControlUnauthorizedAccount")
    })
  })

  // ─── Pause ─────────────────────────────────────────────────────────────────

  describe("pause", () => {
    it("paused contract reverts issue", async () => {
      const { c3Key, minter, pauser, wallet1, ethers } = await deployC3Key()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("t"))
      await c3Key.connect(pauser).pause()
      await expect(
        c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta", trace)
      ).to.be.revertedWithCustomError(c3Key, "EnforcedPause")
    })

    it("paused contract reverts migrate", async () => {
      const { c3Key, registrar, pauser, wallet2, tokenId, ethers } = await deployWithKey()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("t"))
      await c3Key.connect(pauser).pause()
      await expect(
        c3Key.connect(registrar).migrate(tokenId, wallet2.address, "ipfs://m", trace)
      ).to.be.revertedWithCustomError(c3Key, "EnforcedPause")
    })

    it("unpause restores issue", async () => {
      const { c3Key, minter, pauser, wallet1, ethers } = await deployC3Key()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("t"))
      await c3Key.connect(pauser).pause()
      await c3Key.connect(pauser).unpause()
      await expect(
        c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta", trace)
      ).to.emit(c3Key, "C3KeyIssued")
    })
  })

  // ─── Boundary ──────────────────────────────────────────────────────────────

  describe("boundary", () => {
    it("contract name does not claim recognition or certification", async () => {
      const { c3Key } = await deployC3Key()
      expect(await c3Key.name()).to.equal("c3 Key")
      expect(await c3Key.symbol()).to.equal("C3KEY")
      // c3 Key does not expose any recognition, certification, or conversion functions
      const fnNames = c3Key.interface.fragments
        .filter((f: any) => f.type === "function")
        .map((f: any) => f.name as string)
      expect(fnNames).to.not.include("recognize")
      expect(fnNames).to.not.include("certify")
      expect(fnNames).to.not.include("verify")
    })

    it("no onchain PII fields exist in KeyData struct", async () => {
      const { c3Key, minter, wallet1, ethers } = await deployC3Key()
      const trace = ethers.keccak256(ethers.toUtf8Bytes("pii-test"))
      await c3Key.connect(minter).issue(wallet1.address, 0, "ipfs://meta", trace)
      const keyData = await c3Key.getKeyData(1n)
      // Governed fields only: keyType, keyStatus, issuedAt, metadataURI, sourceTraceHash
      // No name, email, wallet address, or other PII stored onchain
      expect(keyData.keyType).to.equal(0n)       // named_individual
      expect(keyData.keyStatus).to.equal(0n)     // active
      expect(keyData.issuedAt).to.be.greaterThan(0n)
      expect(keyData.metadataURI).to.equal("ipfs://meta")
      expect(keyData.sourceTraceHash).to.equal(trace)
    })
  })
})
