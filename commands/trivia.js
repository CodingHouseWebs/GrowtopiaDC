const fs = require('fs');

const triviaQuestions = [
    { question: 'What is the rarest block in Growtopia?', answer: 'Diamond Lock' },
    { question: 'Which event gives the player a chance to obtain a Growtoken?', answer: 'Summerfest' },
];

module.exports = {
    name: 'trivia',
    description: 'Answer a daily Growtopia trivia question',
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
            const lastDailyTrivia = userData.lastDailyTrivia || 0;
            const currentTime = Date.now();
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            if (currentTime - lastDailyTrivia >= oneDayInMilliseconds) {
                const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
                const questionObj = triviaQuestions[randomIndex];
                const question = questionObj.question;
                const answer = questionObj.answer.toLowerCase();
                message.reply(`Here is your daily Growtopia trivia question:\n${question}\nYou have 30 seconds to answer.`);
                const timer = setTimeout(() => {
                    message.reply('Time is up! You did not answer the question.');
                }, 30000);
                const filter = msg => msg.author.id === userId && msg.content.toLowerCase() === answer;
                const collector = message.channel.createMessageCollector(filter, { max: 1, time: 30000 });

                collector.on('collect', () => {
                    clearTimeout(timer);
                    userData.growtokens = (userData.growtokens || 0) + 1;
                    userData.lastDailyTrivia = currentTime;
                    fs.writeFile(userDataPath, JSON.stringify(userData), writeErr => {
                        if (writeErr) {
                            console.error('Error updating user data:', writeErr);
                            message.reply('An error occurred while updating user data.');
                        } else {
                            message.reply('Congratulations! You answered the question correctly and received 1 Growtoken.');
                        }
                    });
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        clearTimeout(timer); // Clear the timer
                        message.reply('You did not answer the question correctly within 30 seconds.');
                    }
                });
            } else {
                const timeUntilNextTrivia = oneDayInMilliseconds - (currentTime - lastDailyTrivia);
                const hours = Math.floor(timeUntilNextTrivia / (60 * 60 * 1000));
                const minutes = Math.floor((timeUntilNextTrivia % (60 * 60 * 1000)) / (60 * 1000));

                message.reply(`You have already completed your daily trivia. Next trivia available in ${hours} hours and ${minutes} minutes.`);
            }
        });
    },
};