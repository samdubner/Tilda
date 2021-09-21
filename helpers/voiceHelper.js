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
  let interaction = songQueue[0].interaction;
  songQueue.shift();

  if (songQueue.length > 0) {
    playAudio(force);
  } else {
    let connection = getVoiceConnection(interaction.guild.id);
    connection.destroy();

    let embed = new MessageEmbed()
      .setAuthor(`Finished Queue`, interaction.user.avatarURL())
      .setColor(`#b00dd1`)
      .setThumbnail(interaction.guild.iconURL())
      .setTitle("Finished Playing and Disconnected, Cya!");

    interaction.channel.send({ embeds: [embed] });
  }
};

const addToQueue = async (interaction) => {
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

  let videoInfo = await play.video_basic_info(
    interaction.options.get("url").value
  );
  videoInfo = videoInfo.video_details;

  let songEntry = {
    url: videoInfo.url,
    title: videoInfo.title,
    duration: videoInfo.durationRaw,
    interaction,
  };

  songQueue.push(songEntry);

  let embed = new MessageEmbed()
    .setAuthor(`Added Song to Queue`, interaction.user.avatarURL())
    .setColor(`#17d9eb`)
    .setThumbnail(interaction.guild.iconURL())
    .setURL(songEntry.url)
    .addField("Song Name", songEntry.title, true)
    .addField("Song Length", `\`${songEntry.duration}\``, true);

  interaction.reply({ embeds: [embed] });

  playAudio(false);
};

const playAudio = async (force) => {
  if (player.state.status == "idle" || force) {
    let songEntry = songQueue[0];
    let interaction = songEntry.interaction;

    let connection = getVoiceConnection(interaction.guild.id);

    const stream = await play.stream(songEntry.url);

    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    player.play(resource);

    connection.subscribe(player);

    let embed = new MessageEmbed()
      .setAuthor(`Now Playing`, interaction.user.avatarURL())
      .setColor(`#11d632`)
      .setThumbnail(interaction.guild.iconURL())
      .setURL(songEntry.url)
      .addField("Song Name", songEntry.title, true)
      .addField("Song Length", `\`${songEntry.duration}\``, true);

    songEntry.interaction.channel.send({ embeds: [embed] });
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

module.exports = {
  addToQueue,
  leaveChannel,
  playNextOrLeave,
};
