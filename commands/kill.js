module.exports = {
  name: "update",
  description: "updates tilda to the latest version! (authorized users only)",
  async execute(interaction) {
    if (
      !["340002869912666114", "171330866189041665"].includes(interaction.user.id)
    )
      return;

    client.destroy();
    console.log(
      `${message.member.displayName} has destroyed the client, exiting node process...`
    );
    process.exit(0);
  },
};
