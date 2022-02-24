import fishHelper from "../helpers/fishHelper";

module.exports = {
  name: "view",
  description: "view all your fish of a specific name",
  options: [
    {
      type: "STRING",
      name: "name",
      description: "the type of fish you'd like to view",
      required: true,
    },
  ],
  async execute(interaction) {
    let fishName = interaction.options.get("name").value.toLowerCase();

    fishHelper.checkForFish(interaction, fishName);
  },
};
