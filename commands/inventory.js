const fs = require('fs');

module.exports = {
    name: 'inventory',
    description: 'Check your inventory',
    execute(message, args) {
        const userId = message.author.id;
        const userDataPath = `./userdata/${userId}.json`;
        if (!fs.existsSync(userDataPath)) {
            message.reply(`An error occurred, or you don't have a GrowID.`);
            return;
        }
        fs.readFile(userDataPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading user data:', err);
                message.reply('An error occurred while reading your data.');
                return;
            }
            const userData = JSON.parse(data);
            const inventory = userData.inventory || {};
            let inventoryMessage = 'Your inventory:\n';
            for (const item in inventory) {
                inventoryMessage += `${item}: ${inventory[item].count}\n`;
            }

            message.channel.send(inventoryMessage);
        });
    },
};