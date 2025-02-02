export const bridgeABI = [
  // Events
  "event TokensLocked(address indexed sender, address indexed recipient, uint256 amount, address token, bytes32 transferId)",
  "event TokensBurned(address indexed sender, address indexed recipient, uint256 amount, address token, bytes32 transferId)",
  "event TokensMinted(address indexed recipient, uint256 amount, address token, bytes32 transferId)",
  "event TokensUnlocked(address indexed recipient, uint256 amount, address token, bytes32 transferId)",
  
  // Lock & Mint functions
  "function lockTokens(uint256 amount, address recipient, address token) external returns (bytes32)",
  "function mintTokens(bytes32 transferId, address recipient, uint256 amount, address token, bytes32[] calldata proof) external",
  
  // Burn & Unlock functions
  "function burnTokens(uint256 amount, address recipient, address token) external returns (bytes32)",
  "function unlockTokens(bytes32 transferId, address recipient, uint256 amount, address token, bytes32[] calldata proof) external",
  
  // View functions
  "function verifyProof(bytes32 transferId, bytes32[] calldata proof) external view returns (bool)",
  "function getTransferRoot() external view returns (bytes32)",
  "function isTransferCompleted(bytes32 transferId) external view returns (bool)"
] as const; 