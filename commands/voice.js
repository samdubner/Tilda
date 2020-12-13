const say = require("say");
const fs = require("fs");

let connection;
let joinChannel = async (message) => {
  if (message.author.id != "340002869912666114") return;
  connection = await message.member.voice.channel.join();
  console.log("Voice connection started");
};

let speak = async (message) => {
  let filepath = `./voicelines/${new Date().getTime()}.wav`;

  await say.export(message.content, "Microsoft Zira", "1", filepath, () => {
    connection.play(filepath);
    fs.unlinkSync(filepath);
  });
};

module.exports = { speak, joinChannel };
