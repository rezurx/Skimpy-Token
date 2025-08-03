async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("🗳️ Delegating SKMP tokens for governance voting...");
    console.log("Delegator address:", deployer.address);
    
    // Get the Skimpy token contract
    const Skimpy = await ethers.getContractFactory("Skimpy");
    const skimpy = Skimpy.attach("0x8CACaD072091Cbbc568e4568DC3a1dF19Ab030E0");
    
    // Check current balance
    const balance = await skimpy.balanceOf(deployer.address);
    console.log("Current SKMP balance:", ethers.formatEther(balance));
    
    // Check current delegate
    const currentDelegate = await skimpy.delegates(deployer.address);
    console.log("Current delegate:", currentDelegate);
    
    if (currentDelegate === deployer.address) {
        console.log("✅ Already delegated to yourself!");
        
        // Check voting power
        const votingPower = await skimpy.getVotes(deployer.address);
        console.log("Current voting power:", ethers.formatEther(votingPower));
        
        return;
    }
    
    console.log("🔄 Delegating tokens to yourself...");
    
    // Delegate to yourself
    const tx = await skimpy.delegate(deployer.address);
    console.log("Transaction hash:", tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Delegation confirmed in block:", receipt.blockNumber);
    
    // Check new voting power
    const votingPower = await skimpy.getVotes(deployer.address);
    console.log("New voting power:", ethers.formatEther(votingPower));
    
    console.log("🎉 Voting power activated! You can now create proposals and vote.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});