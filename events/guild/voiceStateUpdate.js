const { range, clientId } = require("../../config/config.json");

const { ghost, invisible, rankedPlayer } = require("../../config/roles.json");
// We need roles set up for the config.

// Functions. Need to revise.
const { exists } = require("../../handlers/functions.js");

const { getELO, makeChannel, isInDb } = require("../../handlers/game/gameFunctions.js");

const { queue, isMoving } = require("../../handlers/variables.js");

const { queueChannel, queueCategory, queueChatChannel, registerChannel } = require("../../config/channels.json");

module.exports = async (client, oldState, newState) => {
    // Deal with voice updates.
    if ((!oldState.streaming && newState.streaming) || (oldState.streaming && !newState.streaming) || (!oldState.serverDeaf && newState.serverDeaf) || (oldState.serverDeaf && !newState.serverDeaf) || (!oldState.serverMute && newState.serverMute) || (oldState.serverMute && !newState.serverMute) || (!oldState.selfDeaf && newState.selfDeaf) || (oldState.selfDeaf && !newState.selfDeaf) || (!oldState.selfMute && newState.selfMute) || (oldState.selfMute && !newState.selfMute) || (!oldState.selfVideo && newState.selfVideo) || (oldState.selfVideo && !newState.selfVideo)) {
    }

    // If the user leaves a VC...
    if (!oldState.channelID) {
        let memberID = oldState.member.id;
        if (exists(queue, memberID) && !exists(isMoving, memberID)) {
            // Check whether the user is already in queue.
            for (var i = 0; i < queue.length; i++) {
            // Loop through the array.
                if (queue[i][0] === memberID) {
                    // If the ID of the current loop is equal to the memberID...
                    console.log(oldState.member.user.tag + " left the queue.".dim);
                    queue.splice(i, 1);
                    newState.guild.members.fetch(clientId).then((member) => {
                        member.setNickname("[" + queue.length + "/4]");
                    }).catch((e) => console.log("Error setting the nickname of the bot!"));

                    setTimeout(async function () {
                        // Fetch the private queue channel.
                        let channelThing = await newState.guild.channels.cache.find((name) => name.name === memberID);
                        if (!channelThing) {
                            // If the channel is already deleted...
                            return;
                        }
                        // Delete the channel. If there's an error, log it.
                        channelThing.delete().catch((err) => console.error(err));
                    }, 4000);
                    break;
                }
            }
        }
    }

    // If newState.channel is not undefined...
    if (newState.channel) {
        // If the user is connected to the private VC...
        if (newState.channel.name === newState.member.id) {
            // Remove the user from the isMoving array (they are no longer being moved).
            for (var k = 0; k < isMoving.length; k++) {
                if (isMoving[k] === newState.member.id) {
                    isMoving.splice(k, 1);
                }
            }
        }
    }

    // If the channel the user is in is equal to the queue channel...
    if (newState.channelId === queueChannel) {
        // If the user who joins the channel is the bot, then return.
        if (newState.member.id === clientId || oldState.member.id === clientId) {
            return;
        }
        let memberId = newState.member.id;
        let isDb = await isInDb(memberId);
        if (!isDb) {
            newState.member.guild.channels.cache.get(queueChatChannel).send("<@" + newState.member.id + ">, you're not registered! Register in <#" + registerChannel + ">!");
        }
        if (!exists(queue, memberId) && !newState.member.roles.cache.has(ghost)) {
            console.log(newState.member.user.tag + " joined the queue VC.".dim);
            // Get the user's ELO
            let userELO = await getELO(memberId);
            if (!userELO) {
                newState.disconnect();
                return;
            }

            // User's skips
            let skips = 0;

            // Add the user to the queue array
            queue.push([memberId, userELO, 0]);

            // Set the bot's nickname
            newState.guild.members.fetch(clientId).then((member) => {
                member.setNickname("[" + queue.length + "/4]");
            }).catch((e) => console.log("Error setting the nickname!".red));

            // Invisible queueing
            if (newState.member.roles.cache.has(invisible)) {
                // Add the user to the moving array
                isMoving.push(memberId);
                // Create the channel with the name of the user's ID
                newState.guild.channels.create(newState.member.id, {
                    type: 2,
                    // Deny everyone from seeing the channel
                    permissionOverwrites: [
                        {
                            id: newState.guild.roles.everyone,
                            deny: ["ViewChannel", "Connect", "Speak"],
                        },
                        {
                            id: rankedPlayer,
                            deny: ["ViewChannel", "Connect", "Speak"],
                        },
                    ],
                }).then((channel) => {
                    // Move the channel to the queue category
                    channel.setParent(queueCategory);
                    // Move the user
                    newState.setChannel(channel.id).catch((e) => console.error(e));
                });
            }

            // Repeat
            var timer = setInterval(function () {
                // If there is more than one person in queue...
                if (queue.length > 3) {
                    // Sort the array based on ELO.
                    queue.sort((a, b) => a[1] - b[1]);

                    let user1 = queue[0][0];
                    let user2 = queue[1][0];
                    let user3 = queue[2][0];
                    let user4 = queue[3][0];

                    let canQueue = true;
                    for (let i = 0; i < 4; i++) {
                        let curUserELO = queue[i][1];
                        let curUserSkips = queue[i][2];
                        for (let j = 0; j < queue.length; j++) {
                            let secUserELO = queue[j][1];
                            let diff = Math.abs(curUserELO - secUserELO);
                            let secUserSkips = queue[j][2];
                            if (diff > (range + (curUserSkips + secUserSkips) * skips * 5)) {
                                canQueue = false;
                            }
                        }
                    }
                    if (canQueue) {
                        for (let i = 0; i < queue.length; i++) {
                            if (queue[i][0] === user1 || queue[i][0] === user2 || queue[i][0] === user3 || queue[i][0] === user4) {
                                queue.splice(i, 1);
                            }
                        }
                        makeChannel(newState.member, user1, user2, user3, user4);
                        clearInterval(timer);
                    } else {
                        queue[0][2] += 2;
                        queue[1][2] += 2;
                        queue[2][2]++;
                        queue[3][2]++;
                        skips++;
                    }
                }
            }, 2000);
        } else {
            // idk
        }
    }
};