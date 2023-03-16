import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";

const print: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Say a message")
		.setDefaultMemberPermissions(0x20)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("socials")
				.setDescription("Say the socials message");
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("help")
				.setDescription("Say the help message");
		}) as any,
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		if (
			!interaction.memberPermissions.has("Administrator") ||
			!interaction.memberPermissions.has("ManageGuild")
		) {
			interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("Error!")
						.setColor("#FF0000")
						.setDescription(
							"You do not have the required permissions to run this command."
						),
				],
			});
			return;
		}

		// @ts-ignore
		if (interaction.options.getSubcommand() === "socials") {
			const card = new EmbedBuilder()
				.setTitle("Leeds Powerchair Football Club Social Media")
				.setColor("#4aaace")
				.setDescription(`Check out some of the links below!`);

			interaction.channel.send({
				embeds: [card],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setLabel("YouTube Channel")
							.setStyle(ButtonStyle.Link)
							.setURL(
								"https://www.youtube.com/@leedspowerchairfc/videos"
							),
						new ButtonBuilder()
							.setLabel("Instagram")
							.setStyle(ButtonStyle.Link)
							.setURL("https://www.instagram.com/leedspfc/"),
						new ButtonBuilder()
							.setLabel("TikTok")
							.setStyle(ButtonStyle.Link)
							.setURL("https://www.tiktok.com/@leedspfc"),
						new ButtonBuilder()
							.setLabel("Twitter")
							.setStyle(ButtonStyle.Link)
							.setURL("https://twitter.com/leedspfc"),
						new ButtonBuilder()
							.setLabel("Website")
							.setStyle(ButtonStyle.Link)
							.setURL("https://www.leedspowerchairfc.co.uk")
					) as any,
				],
			});

			interaction.followUp("Okie Dokie!");

			return;
		}

		// @ts-ignore
		if (interaction.options.getSubcommand() === "help") {
			const card = new EmbedBuilder()
				.setTitle("LPFC Bot Help")
				.setDescription(
					`Hello! I'm the Leeds Powerchair Football Club Bot! I'm here to help you with all your LPFC needs! I can do a lot of things, but here are some of the things I can do:\n
**Show your training sessions**
To view your training sessions for the week, just type \`/training\` and I'll show you your training sessions for the week! Try it anywhere!\n
**Confirm your attendance**
To confirm your attendance for a training session, just head over to the <#${config.tdChannelId}> channel and select whether you can or cannot attend for each of your training sessions.\n
I am not yet sentient so I cannot answer any questions. If you do have any questions, please contact <@!438350665430073345> and he will be happy to help you!`
				)
				.setColor("#4aaace");

			interaction.channel.send({
				embeds: [card],
			});

			interaction.followUp("Okie Dokie!");

			return;
		}

		const card = new EmbedBuilder()
			.setTitle("Not found!")
			.setDescription("Command not found!");

		interaction.followUp({
			embeds: [card],
		});
	},
};

export default print;
