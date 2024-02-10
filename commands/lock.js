const fs = require('fs');

module.exports = {
    name: 'lock',
    description: 'Lock a world',
    async execute(message, args) {
        const worldName = args.join(' ');
        const worldDataPath = `./worlddata/${worldName}.json`;
        fs.readFile(worldDataPath, 'utf8', (err, data) => {
            if (err) {
                message.reply(`"${worldName}" does not exist, use !joinworld ${worldName}`);
                return;
            }
            const worldData = JSON.parse(data);
            if (worldData.owner) {
                message.reply(`The world "${worldName}" is already locked by ${worldData.owner}.`);
                return;
            }
            worldData.owner = message.author.username;
            fs.writeFile(worldDataPath, JSON.stringify(worldData), writeErr => {
                if (writeErr) {
                    console.error('Error updating world data file:', writeErr);
                    message.reply('An error occurred while locking the world.');
                    return;
                }
                const userDataPath = `./userdata/${message.author.id}.json`;
                fs.readFile(userDataPath, 'utf8', (userErr, userData) => {
                    if (userErr) {
                        console.error('Error reading user data file:', userErr);
                        message.reply('An error occurred while updating user data.');
                        return;
                    }
                    let userJson = JSON.parse(userData);
                    if (!userJson.lockedworlds) {
                        userJson.lockedworlds = [];
                    }
                    userJson.lockedworlds.push(worldName);
                    fs.writeFile(userDataPath, JSON.stringify(userJson), userWriteErr => {
                        if (userWriteErr) {
                            console.error('Error updating user data file:', userWriteErr);
                            message.reply('An error occurred while updating user data.');
                            return;
                        }
                        message.reply(`You have locked the world "${worldName}".`);
                    });
                });
            });
        });
    },
};