// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin imports — requires @openzeppelin/contracts installation.
// Contract tooling (Hardhat or Foundry) must be configured before compilation.
// See: docs/oar/measures_interoperability/oar1_c3_key_nft_contract_setup_v1.meta.md
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title C3Key
 * @notice Wallet-bound, non-transferable access key for Measures Registry identity relation.
 *
 * c3 Key identifies access-bearing origin relation.
 * It does not confer recognition, verification, certification, conversion,
 * payment standing, seal standing, or delivery contract standing.
 * Codex holds authority. Measures registers standing. Wallet holds key.
 */
contract C3Key is ERC721, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE    = keccak256("MINTER_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant PAUSER_ROLE    = keccak256("PAUSER_ROLE");

    enum KeyType {
        named_individual,
        institution_in_service,
        temporary_migration
    }

    enum KeyStatus {
        active,
        held,
        revoked,
        redacted,
        migrated
    }

    struct KeyData {
        KeyType   keyType;
        KeyStatus keyStatus;
        uint256   issuedAt;
        string    metadataURI;
        bytes32   sourceTraceHash;
    }

    uint256 private _nextTokenId;

    mapping(uint256 => KeyData) private _keyData;
    mapping(address => uint256) private _walletActiveKeyId;
    mapping(address => bool)    private _walletHasActiveKey;

    // ─── Events ────────────────────────────────────────────────────────────────

    event C3KeyIssued(
        uint256 indexed tokenId,
        address indexed wallet,
        KeyType keyType,
        bytes32 sourceTraceHash
    );
    event C3KeyHeld(uint256 indexed tokenId, bytes32 reasonHash);
    event C3KeyRevoked(uint256 indexed tokenId, bytes32 reasonHash);
    event C3KeyRedacted(uint256 indexed tokenId, bytes32 reasonHash);
    event C3KeyMigrated(
        uint256 indexed oldTokenId,
        uint256 indexed newTokenId,
        address oldWallet,
        address newWallet,
        bytes32 sourceTraceHash
    );
    event MetadataUpdated(uint256 indexed tokenId, string metadataURI);

    // ─── Constructor ───────────────────────────────────────────────────────────

    constructor(address admin) ERC721("c3 Key", "C3KEY") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    // ─── Non-transferable ──────────────────────────────────────────────────────

    function transferFrom(address, address, uint256) public pure override {
        revert("C3Key: non-transferable");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("C3Key: non-transferable");
    }

    // ─── Mint / Issue ──────────────────────────────────────────────────────────

    /**
     * @notice Issue a new c3 Key to a wallet.
     * Wallet must not already hold an active key.
     * Authorized caller must hold MINTER_ROLE.
     */
    function issue(
        address wallet,
        KeyType keyType,
        string calldata metadataURI,
        bytes32 sourceTraceHash
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(!_walletHasActiveKey[wallet], "C3Key: wallet already holds active key");

        uint256 tokenId = ++_nextTokenId;
        _mint(wallet, tokenId);

        _keyData[tokenId] = KeyData({
            keyType:         keyType,
            keyStatus:       KeyStatus.active,
            issuedAt:        block.timestamp,
            metadataURI:     metadataURI,
            sourceTraceHash: sourceTraceHash
        });

        _walletActiveKeyId[wallet]  = tokenId;
        _walletHasActiveKey[wallet] = true;

        emit C3KeyIssued(tokenId, wallet, keyType, sourceTraceHash);
        return tokenId;
    }

    // ─── Status transitions ────────────────────────────────────────────────────

    function hold(uint256 tokenId, bytes32 reasonHash)
        external onlyRole(REGISTRAR_ROLE)
    {
        require(_keyData[tokenId].keyStatus == KeyStatus.active, "C3Key: key not active");
        _keyData[tokenId].keyStatus = KeyStatus.held;
        emit C3KeyHeld(tokenId, reasonHash);
    }

    function revoke(uint256 tokenId, bytes32 reasonHash)
        external onlyRole(REGISTRAR_ROLE)
    {
        KeyStatus s = _keyData[tokenId].keyStatus;
        require(s == KeyStatus.active || s == KeyStatus.held, "C3Key: not revokable");
        address wallet = ownerOf(tokenId);
        _keyData[tokenId].keyStatus = KeyStatus.revoked;
        _walletHasActiveKey[wallet] = false;
        emit C3KeyRevoked(tokenId, reasonHash);
    }

    function redact(uint256 tokenId, bytes32 reasonHash)
        external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        address wallet = ownerOf(tokenId);
        _keyData[tokenId].keyStatus = KeyStatus.redacted;
        _walletHasActiveKey[wallet] = false;
        emit C3KeyRedacted(tokenId, reasonHash);
    }

    // ─── Wallet migration ──────────────────────────────────────────────────────

    /**
     * @notice Migrate a c3 Key from one wallet to another under governed correction route.
     * Old key is marked migrated. New key is issued to new wallet.
     */
    function migrate(
        uint256 oldTokenId,
        address newWallet,
        string calldata metadataURI,
        bytes32 sourceTraceHash
    ) external onlyRole(REGISTRAR_ROLE) whenNotPaused returns (uint256) {
        require(!_walletHasActiveKey[newWallet], "C3Key: new wallet already holds active key");
        address oldWallet = ownerOf(oldTokenId);

        _keyData[oldTokenId].keyStatus = KeyStatus.migrated;
        _walletHasActiveKey[oldWallet] = false;

        uint256 newTokenId = ++_nextTokenId;
        _mint(newWallet, newTokenId);

        _keyData[newTokenId] = KeyData({
            keyType:         _keyData[oldTokenId].keyType,
            keyStatus:       KeyStatus.active,
            issuedAt:        block.timestamp,
            metadataURI:     metadataURI,
            sourceTraceHash: sourceTraceHash
        });

        _walletActiveKeyId[newWallet]  = newTokenId;
        _walletHasActiveKey[newWallet] = true;

        emit C3KeyMigrated(oldTokenId, newTokenId, oldWallet, newWallet, sourceTraceHash);
        return newTokenId;
    }

    // ─── Metadata ──────────────────────────────────────────────────────────────

    function updateMetadata(uint256 tokenId, string calldata metadataURI)
        external onlyRole(REGISTRAR_ROLE)
    {
        _requireOwned(tokenId);
        _keyData[tokenId].metadataURI = metadataURI;
        emit MetadataUpdated(tokenId, metadataURI);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _keyData[tokenId].metadataURI;
    }

    // ─── Pause ─────────────────────────────────────────────────────────────────

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ─── Views ─────────────────────────────────────────────────────────────────

    function getKeyData(uint256 tokenId) external view returns (KeyData memory) {
        _requireOwned(tokenId);
        return _keyData[tokenId];
    }

    function activeKeyId(address wallet) external view returns (uint256) {
        return _walletActiveKeyId[wallet];
    }

    function hasActiveKey(address wallet) external view returns (bool) {
        return _walletHasActiveKey[wallet];
    }

    // ─── Interface support ─────────────────────────────────────────────────────

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
