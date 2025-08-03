async function main() {
  const governorAddress = "0x5F0d5Be2aE4962f4178c96a5C24FEf2Bae14D09c";
  
  // Get contract creation transaction
  const provider = ethers.provider;
  
  // Query for contract creation events by looking at the earliest block with contract code
  let startBlock = 18000000; // Base mainnet recent block
  let endBlock = await provider.getBlockNumber();
  
  console.log("Governor Address:", governorAddress);
  console.log("Current Block:", endBlock);
  
  // Binary search approach to find deployment block
  while (startBlock < endBlock) {
    const midBlock = Math.floor((startBlock + endBlock) / 2);
    
    try {
      const code = await provider.getCode(governorAddress, midBlock);
      if (code === "0x") {
        startBlock = midBlock + 1;
      } else {
        endBlock = midBlock;
      }
    } catch (error) {
      startBlock = midBlock + 1;
    }
  }
  
  console.log("Deployment Block (approximately):", startBlock);
  console.log("Contract Type: OpenZeppelin Governor");
  
  // Get the exact block info
  const block = await provider.getBlock(startBlock);
  console.log("Block Timestamp:", new Date(block.timestamp * 1000).toISOString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});