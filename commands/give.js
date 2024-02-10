const fs = require('fs');

module.exports = {
    name: 'give',
    description: 'Give an item to a user',
    execute(message, args) {
        if (message.author.id !== '948296890636709979') {
            message.reply('You are not authorized to use this command.');
            return;
        }
        const itemId = parseInt(args[0]);
        const count = parseInt(args[1]);
        const targetUser = message.mentions.users.first();
        if (isNaN(itemId) || isNaN(count) || count <= 0 || !targetUser) {
            message.reply('Please provide valid arguments: `!give <item_id> <count> <@user>`');
            return;
        }
        const itemsData = require('../items.json');
        const item = itemsData.items.find(item => item.id === itemId);
        if (!item) {
            message.reply('Invalid item ID.');
            return;
        }
        const targetUserId = targetUser.id;
        const targetUserDataPath = `./userdata/${targetUserId}.json`;
        fs.readFile(targetUserDataPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                message.reply('An error occurred while reading target user data.');
                return;
            }
            let targetUserData = JSON.parse(data);
            if (!targetUserData.inventory) {
                targetUserData.inventory = [];
            }
            for (let i = 0; i < count; i++) {
                targetUserData.inventory.push(item);
            }
            fs.writeFile(targetUserDataPath, JSON.stringify(targetUserData), err => {
                if (err) {
                    console.error(err);
                    message.reply('An error occurred while updating target user data.');
                } else {
                    message.reply(`Gave ${count}x ${item.name} to ${targetUser.username}.`);
                }
            });
        });
    },
};