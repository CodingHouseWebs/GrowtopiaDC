const fs = require('fs');

module.exports = {
    name: 'create',
    description: 'Create user data',
    execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        const userDataPath = `./userdata/${userId}.json`;
        if (fs.existsSync(userDataPath)) {
            message.reply('You already have a GrowID.');
            return;
        }
        const userData = {
            userId: userId,
            username: username,
            gems: 0,
            growtokens: 0,
            vouchers: 0,
            credits: 0,
            inventory: []
        };
        fs.writeFile(userDataPath, JSON.stringify(userData), err => {
            if (err) {
                console.error(err);
                message.reply('An error occurred while saving your data.');
            } else {
                message.reply('Your GrowID has been created successfully!');
            }
        });
    },
};