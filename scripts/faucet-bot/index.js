require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { ethers } = require('ethers');

// Environment variables
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;
const SKIMPY_TOKEN_ADDRESS = process.env.SKIMPY_TOKEN_ADDRESS;
const NETWORK_RPC_URL = process.env.NETWORK_RPC_URL || 'http://127.0.0.1:8545'; // Default to Hardhat local

// Hardhat artifacts (assuming compiled contracts are available)
const SkimpyArtifact = require('../../artifacts/contracts/Skimpy.sol/Skimpy.json');

// --- Blockchain Setup ---
const provider = new ethers.JsonRpcProvider(NETWORK_RPC_URL);
const faucetWallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);

// Skimpy Token Contract instance
let skimpyToken;

// --- Discord Bot Setup ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Initialize Skimpy Token contract after bot is ready
    if (SKIMPY_TOKEN_ADDRESS) {
        skimpyToken = new ethers.Contract(SKIMPY_TOKEN_ADDRESS, SkimpyArtifact.abi, faucetWallet);
        console.log(`Skimpy Token contract initialized at ${SKIMPY_TOKEN_ADDRESS}`);
    } else {
        console.error('SKIMPY_TOKEN_ADDRESS is not set in .env. Faucet will not function.');
    }

    // Register slash command
    const commands = [
        {
            name: 'faucet',
            description: 'Request SKIMPY tokens',
            options: [
                {
                    name: 'address',
                    type: 3, // STRING
                    description: 'Your wallet address',
                    required: true,
                },
                {
                    name: 'amount',
                    type: 4, // INTEGER
                    description: 'Amount of SKIMPY to request (default: 10)',
                    required: false,
                },
            ],
        },
    ];

    try {
        await client.application.commands.set(commands);
        console.log('Successfully registered slash commands.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'faucet') {
        const recipientAddress = interaction.options.getString('address');
        const amount = interaction.options.getInteger('amount') || 10; // Default to 10 SKIMPY

        if (!ethers.isAddress(recipientAddress)) {
            await interaction.reply({ content: 'Invalid Ethereum address provided.', ephemeral: true });
            return;
        }

        if (!skimpyToken) {
            await interaction.reply({ content: 'Faucet is not configured. SKIMPY_TOKEN_ADDRESS is missing.', ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply(); // Defer the reply as transaction can take time

            // Check faucet balance
            const faucetBalance = await skimpyToken.balanceOf(faucetWallet.address);
            const amountInWei = ethers.parseUnits(amount.toString(), await skimpyToken.decimals());

            if (faucetBalance < amountInWei) {
                await interaction.editReply(`Faucet is currently empty or does not have enough tokens. Available: ${ethers.formatUnits(faucetBalance, await skimpyToken.decimals())} SKMP`);
                return;
            }

            // Send tokens
            const tx = await skimpyToken.transfer(recipientAddress, amountInWei);
            await tx.wait();

            await interaction.editReply(`Successfully sent ${amount} SKMP to ${recipientAddress}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error('Faucet transaction failed:', error);
            await interaction.editReply(`Failed to send tokens. Error: ${error.message || error}`);
        }
    }
});

client.login(DISCORD_BOT_TOKEN);
