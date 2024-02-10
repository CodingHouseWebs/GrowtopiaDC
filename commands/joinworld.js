const fs = require('fs');

module.exports = {
    name: 'joinworld',
    description: 'Join a world',
    async execute(message, args) {
        const worldName = args.join(' ');
        const worldDataPath = `./worlddata/${worldName}.json`;
        fs.readFile(worldDataPath, 'utf8', (err, data) => {
            let worldData;

            if (err) {
                worldData = {
                    name: worldName,
                    owner: null,
                    lockedby: null,
                };

                fs.writeFile(worldDataPath, JSON.stringify(worldData), writeErr => {
                    if (writeErr) {
                        console.error('Error creating world data file:', writeErr);
                        message.reply('An error occurred while joining the world.');
                        return;
                    }

                    joinWorld(worldData);
                });
            } else {
                worldData = JSON.parse(data);
                joinWorld(worldData);
            }
        });

        function joinWorld(worldData) {
            if (worldData.lockedby) {
                message.reply(`You have joined the world "${worldName}" [LOCKED by ${worldData.lockedby}].`);
            } else {
                message.reply(`You have joined the world "${worldName}".`);
            }
            if (message.author.id === worldData.owner) {
                message.reply(`You joined your world, "${worldName}".`);
            }
        }
    },
};