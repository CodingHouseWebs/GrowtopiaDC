const fs = require('fs');

module.exports = {
    name: 'daily',
    description: 'Claim daily gems',
    execute(message, args) {
        const userId = message.author.id;
        const userDataPath = `./userdata/${userId}.json`;

        fs.readFile(userDataPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading user data:', err);
                message.reply(`An error occurred, or you don't have a GrowID.`);
                return;
            }
            let userData = JSON.parse(data);
            const lastDailyClaim = userData.lastDailyClaim || 0;
            const currentTime = Date.now();
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            if (currentTime - lastDailyClaim >= oneDayInMilliseconds) {
                const gems = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
                userData.gems = (userData.gems || 0) + gems;
                userData.lastDailyClaim = currentTime;
                fs.writeFile(userDataPath, JSON.stringify(userData), writeErr => {
                    if (writeErr) {
                        console.error('Error updating user data:', writeErr);
                        message.reply('An error occurred while updating user data.');
                    } else {
                        message.reply(`You have claimed your daily reward and received ${gems} gems!`);
                    }
                });
            } else {
                const timeUntilNextClaim = oneDayInMilliseconds - (currentTime - lastDailyClaim);
                const hours = Math.floor(timeUntilNextClaim / (60 * 60 * 1000));
                const minutes = Math.floor((timeUntilNextClaim % (60 * 60 * 1000)) / (60 * 1000));

                message.reply(`You have already claimed your daily reward. Next claim available in ${hours} hours and ${minutes} minutes.`);
            }
        });
    },
};