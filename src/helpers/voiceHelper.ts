const {
  AudioPlayerStatus,
  getVoiceConnection,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
import play from "play-dl";

import { MessageEmbed } from "discord.js";

//use an array to store the songs in a queue
let songQueue = [];
let loop = false;

const player = createAudioPlayer();

//if the player is idle check if there are more songs to play otherwise disconnect
player.on(AudioPlayerStatus.Idle, () => playNextOrLeave());

//send an embed notifying the user there are no more songs to play in the queue or
//shift the next song in the queue and play it or
//if there are no songs send an embed notifying the user the queue is empty
const playNextOrLeave = (force = false, interaction = undefined) => {
  if (!songQueue[0]) {
    let embed = new MessageEmbed()
      .setAuthor({ name: "Cannot Skip Song" })
      .setColor(`#ff0000`)
      .setTitle("There is nothing in the queue to skip!");

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return false;
  }
  let channel = songQueue[0].channel;
  if (!loop) songQueue.shift();

  if (songQueue.length > 0) {
    playAudio(force);
  } else {
    if (force) player.pause();
    let embed = new MessageEmbed()
      .setAuthor({ name: "Finished Queue" })
      .setColor(`#b00dd1`)
      .setTitle("Finished Queue and Will Disconnect Shortly!");

    channel.send({ embeds: [embed] });
    waitThenLeave(channel);
  }
  return true;
};

//send an embed displaying all the songs in the queue
const viewQueue = (interaction) => {
  if (songQueue.length == 0) {
    let embed = new MessageEmbed()
      .setAuthor({ name: "Queue is Empty" })
      .setColor(`#ff0000`)
      .setTitle("There are no songs in queue!");

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  let embed = new MessageEmbed()
    .setTitle(`Song Queue`)
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

  //embed can have 25 fields at most, so if idx is too high add a warning field
  songQueue.every((song, idx) => {
    if (idx == 24) {
      embed.addField(
        "Queue Too Long",
        "There are more songs in queue that cannot be dispalyed!"
      );
      return false;
    }

    embed.addField(`${idx + 1}`, song.title, true);
    return true;
  });

  interaction.reply({ embeds: [embed], ephemeral: true });
};

//check if a user is in a voice channel and if so add a song to queue
//if there is no voice connection already, create one
const addToQueue = async (interaction) => {
  let connection = getVoiceConnection(interaction.guild.id);

  if (!interaction.member.voice.channelId) {
    interaction.reply({
      content: "You must be in a voice channel to use music commands",
      ephemeral: true,
    });
    return;
  }

  if (!connection) {
    connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
  }

  let songEntry;
  let query = interaction.options.get("query").value;

  //use play-dl to retrieve video information to be added to queue
  try {
    let videoInfo = await play.video_basic_info(query);
    let videoDetails = videoInfo.video_details;

    songEntry = {
      url: videoDetails.url,
      title: videoDetails.title,
      duration: videoDetails.durationRaw,
      channel: interaction.channel,
      user: interaction.user,
    };
  } catch (e) {
    //if an invalid url was provided search youtube instead
    let results = await play.search(query, { limit: 1 });
    let topResult = results[0];

    songEntry = {
      url: topResult.url,
      title: topResult.title,
      duration: topResult.durationRaw,
      channel: interaction.channel,
      user: interaction.user,
    };
  }

  songQueue.push(songEntry);

  let embed = new MessageEmbed()
    .setTitle("Added Song to Queue")
    .setAuthor({
      name: `Added by ${interaction.user.username}`,
      iconURL: interaction.user.avatarURL(),
    })
    .setColor(`#17d9eb`)
    .setThumbnail(interaction.guild.iconURL())
    .setURL(songEntry.url)
    .addField("Song Name", songEntry.title, true)
    .addField("Song Length", `\`${songEntry.duration}\``, true);

  interaction.reply({ embeds: [embed] });

  playAudio(false);
};

//play the first song in the queue and send an embed displaying the currently playing song
const playAudio = async (force) => {
  if (["idle", "paused", "autopaused"].includes(player.state.status) || force) {
    let songEntry = songQueue[0];

    let connection = getVoiceConnection(songEntry.channel.guild.id);
    const stream = await play.stream(songEntry.url);

    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    player.play(resource);

    connection.subscribe(player);

    let embed = new MessageEmbed()
      .setTitle("Now Playing")
      .setAuthor({
        name: `Added by ${songEntry.user.username}`,
        iconURL: songEntry.user.avatarURL(),
      })
      .setColor(`#11d632`)
      .setThumbnail(songEntry.channel.guild.iconURL())
      .setURL(songEntry.url)
      .addField("Song Name", songEntry.title, true)
      .addField("Song Length", `\`${songEntry.duration}\``, true);

    songEntry.channel.send({ embeds: [embed] });
  }
};

//verify their is a voice connection and if so destroy it and notify the user
const leaveChannel = (interaction) => {
  let connection = getVoiceConnection(interaction.guild.id);

  if (!connection) {
    interaction.reply({
      content: "Tilda is not currently playing music",
      ephemeral: true,
    });
    return;
  }

  songQueue = [];
  connection.destroy();

  let embed = new MessageEmbed()
    .setAuthor({
      name: `Disconnected From VC`,
      iconURL: interaction.user.avatarURL(),
    })
    .setColor(`#990909`)
    .setThumbnail(interaction.guild.iconURL())
    .setTitle("Thank you for listening, have a nice day!");

  interaction.reply({ embeds: [embed] });
};

//create a timeout for 2 minutes before disconnected from the channel
const waitThenLeave = (channel) => {
  setTimeout(() => {
    if (player.state.status == "idle" || player.state.status == "paused") {
      disconnectFromChannel(channel);
    }
  }, 1000 * 60 * 2);
};

//destroy the connection and send a message to the user that the bot has disconnected
const disconnectFromChannel = (channel) => {
  try {
    let connection = getVoiceConnection(channel.guild.id);
    connection.destroy();

    let embed = new MessageEmbed()
      .setAuthor({ name: "Disconnected" })
      .setColor("#500982")
      .setTitle("Finished Playing and Disconnected, Cya!");

    channel.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
    console.log("voice connection most likely couldn't be retrieved");
  }
};

//change the status of "loop" and send an embed with the updated status
const loopCurrentSong = (interaction) => {
  loop = !loop;
  let status = loop ? "ON" : "OFF";

  let embed = new MessageEmbed()
    .setTitle("Loop")
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail(interaction.guild.iconURL())
    .addField("Looping Status", `Looping is currently \`${status}\``, true);

  interaction.reply({ embeds: [embed] });
};

export default {
  addToQueue,
  leaveChannel,
  playNextOrLeave,
  viewQueue,
  loopCurrentSong,
};
