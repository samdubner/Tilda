const {
  VoiceConnectionStatus,
  AudioPlayerStatus,
  getVoiceConnection,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

const { MessageEmbed } = require("discord.js");

const play = require("play-dl");

let songQueue = [];

const player = createAudioPlayer();

player.on(AudioPlayerStatus.Idle, () => playNextOrLeave());

const playNextOrLeave = (force = false) => {
  let channel = songQueue[0].channel;
  songQueue.shift();

  if (songQueue.length > 0) {
    playAudio(force);
  } else {
    if (force) player.pause();
    let embed = new MessageEmbed()
      .setAuthor(`Finished Queue`)
      .setColor(`#b00dd1`)
      .setTitle("Finished Queue and Will Disconnect Shortly!");

    channel.send({ embeds: [embed] });
    waitThenLeave(channel, force);
  }
};

const searchThenAddToQueue = async (interaction) => {
  let connection = getVoiceConnection(interaction.guild.id);

  if (!interaction.member.voice.channelId) {
    interaction.reply("You must be in a voice channel to use music commands");
    return;
  }

  if (!connection) {
    connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
  }

  let query = interaction.options.get("search").value;
  let results = await play.search(query, { limit: 1 });
  let topResult = results[0];

  let songEntry = {
    url: topResult.url,
    title: topResult.title,
    duration: topResult.durationRaw,
    channel: interaction.channel,
    user: interaction.user,
  };

  songQueue.push(songEntry);

  let embed = new MessageEmbed()
    .setTitle("Added Song to Queue")
    .setAuthor(
      `Added by ${interaction.user.username}`,
      interaction.user.avatarURL()
    )
    .setColor(`#17d9eb`)
    .setThumbnail(interaction.guild.iconURL())
    .setURL(songEntry.url)
    .addField("Song Name", songEntry.title, true)
    .addField("Song Length", `\`${songEntry.duration}\``, true);

  interaction.reply({ embeds: [embed] });

  playAudio(false);
};

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

  try {
    let videoInfo = await play.video_basic_info(
      interaction.options.get("url").value
    );
    videoInfo = videoInfo.video_details;

    let songEntry = {
      url: videoInfo.url,
      title: videoInfo.title,
      duration: videoInfo.durationRaw,
      channel: interaction.channel,
      user: interaction.user,
    };

    songQueue.push(songEntry);

    let embed = new MessageEmbed()
      .setTitle("Added Song to Queue")
      .setAuthor(
        `Added by ${interaction.user.username}`,
        interaction.user.avatarURL()
      )
      .setColor(`#17d9eb`)
      .setThumbnail(interaction.guild.iconURL())
      .setURL(songEntry.url)
      .addField("Song Name", songEntry.title, true)
      .addField("Song Length", `\`${songEntry.duration}\``, true);

    interaction.reply({ embeds: [embed] });

    playAudio(false);
  } catch (e) {
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .addField("Invalid Song URL", "Please try again with another URL");

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

const playAudio = async (force) => {
  if (
    player.state.status == "idle" ||
    player.state.status == "paused" ||
    force
  ) {
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
      .setAuthor(
        `Added by ${songEntry.user.username}`,
        songEntry.user.avatarURL()
      )
      .setColor(`#11d632`)
      .setThumbnail(songEntry.channel.guild.iconURL())
      .setURL(songEntry.url)
      .addField("Song Name", songEntry.title, true)
      .addField("Song Length", `\`${songEntry.duration}\``, true);

    songEntry.channel.send({ embeds: [embed] });
  }
};

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
    .setAuthor(`Disconnected From VC`, interaction.user.avatarURL())
    .setColor(`#990909`)
    .setThumbnail(interaction.guild.iconURL())
    .setTitle("Thank you for listening, have a nice day!");

  interaction.reply({ embeds: [embed] });
};

const waitThenLeave = (channel) => {
  setTimeout(() => {
    if (player.state.status == "idle") {
      disconnectFromChannel(channel);
    }
  }, 1000 * 60 * 2);
};

const disconnectFromChannel = (channel) => {
  let connection = getVoiceConnection(channel.guild.id);
  connection.destroy();

  let embed = new MessageEmbed()
    .setAuthor(`Disconnected`)
    .setColor("#500982")
    .setTitle("Finished Playing and Disconnected, Cya!");

  channel.send({ embeds: [embed] });
};

module.exports = {
  addToQueue,
  searchThenAddToQueue,
  leaveChannel,
  playNextOrLeave,
};
