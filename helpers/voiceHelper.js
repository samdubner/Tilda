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

player.on(AudioPlayerStatus.Idle, () => {
  let interaction = songQueue[0].interaction
  songQueue.shift();

  if (songQueue.length > 0) {
    playAudio();
  } else {
    let connection = getVoiceConnection(interaction.guild.id);
    connection.destroy();
  }
});

const addToQueue = (interaction) => {
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

  let songEntry = {
    url: interaction.options.get("url").value,
    interaction,
  };

  songQueue.push(songEntry);

  playAudio();
};

const playAudio = async () => {
  let songEntry = songQueue[0];

  let connection = getVoiceConnection(songEntry.interaction.guild.id);

  if (player.state.status == "idle") {
    const stream = await play.stream(songEntry.url);

    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    player.play(resource);

    connection.subscribe(player);
  }
};

const leaveChannel = (interaction) => {
  let connection = getVoiceConnection(interaction.guild.id);

  if(!connection) {
    interaction.reply("Tilda is not currently playing music")
    return
  }

  songQueue = [];
  connection.destroy();
}

module.exports = {
  addToQueue,
  leaveChannel
};
