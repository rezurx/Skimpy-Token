// Simple Discord notification script for SKIMPY Token project
require('dotenv').config();

async function sendDiscordNotification(message) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl) {
        console.error('Error: DISCORD_WEBHOOK_URL not found in .env file');
        return false;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message,
                username: 'SKIMPY Bot'
            })
        });

        if (response.ok) {
            console.log('✅ Message sent to Discord:', message);
            return true;
        } else {
            console.error('❌ Failed to send Discord message:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Error sending Discord message:', error.message);
        return false;
    }
}

// Example usage
if (require.main === module) {
    const message = process.argv[2] || '🚀 SKIMPY Token project is now live on GitHub!';
    sendDiscordNotification(message);
}

module.exports = { sendDiscordNotification };