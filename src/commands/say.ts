import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteractionOptionResolver,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { hasPermissions } from "../utils/hasPermissions";
import { logAction } from "../utils/logAction";

const print: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Say a message")
		.setDefaultMemberPermissions(0x8)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("socials")
				.setDescription("Say the socials message");
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("help")
				.setDescription("Say the help message");
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("verify")
				.setDescription("Say the verify message");
		}),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const perms = await hasPermissions(interaction);

		if (!perms) return;

		logAction(
			`Print command used by ${interaction.user.tag}`,
			interaction.client
		);

		if (
			(
				interaction.options as CommandInteractionOptionResolver
			).getSubcommand() === "socials"
		) {
			const card = new EmbedBuilder()
				.setTitle("LPFC Socials")
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
							)
							.setEmoji({
								id: "1118543905768603810"
							}),
						new ButtonBuilder()
							.setLabel("Instagram")
							.setStyle(ButtonStyle.Link)
							.setURL("https://www.instagram.com/leedspfc/")
							.setEmoji({
								id: "1118543879382249535"
							}),
						new ButtonBuilder()
							.setLabel("TikTok")
							.setStyle(ButtonStyle.Link)
							.setURL("https://www.tiktok.com/@leedspfc")
							.setEmoji({
								id: "1118543853918617720",
							}),
					new ButtonBuilder()
							.setLabel("Twitter")
							.setStyle(ButtonStyle.Link)
							.setURL("https://twitter.com/leedspfc")
							.setEmoji({
								id: "1118544005899239474"
							}),
						new ButtonBuilder()
							.setLabel("Website")
							.setStyle(ButtonStyle.Link)
							.setURL("https://www.leedspowerchairfc.co.uk")
							.setEmoji({
								name: "🌐"
							})
					) as any,
				],
			});

			await interaction.followUp("Okie Dokie!");

			return;
		}

		if (
			(
				interaction.options as CommandInteractionOptionResolver
			).getSubcommand() === "help"
		) {
			const card = new EmbedBuilder()
				.setTitle("LPFC Bot Help")
				.setDescription(
					`Hello! I'm the Leeds Powerchair Football Club Bot! I'm here to help you with all your LPFC needs! I can do a lot of things, but here are some of the main things I can do:`
				)
				.setColor("#4aaace");

			// const stCard = new EmbedBuilder()
			// 	.setTitle("Show your training sessions")
			// 	.setDescription(
			// 		"To view your training sessions, just type `/training` and I'll show you your training sessions for the week! Try it in any channel!"
			// 	)
			// 	.setImage(
			// 		"https://jhresources.ams3.digitaloceanspaces.com/lpfc/bot/tutorial-training-command.gif"
			// 	)
			// 	.setColor("#4aaace");

			const atCard = new EmbedBuilder()
				.setTitle("Confirm your attendance")
				.setDescription(
					`To confirm your attendance to a training session, just head over to the <#${config.tdChannelId}> channel and select whichever ones you can or cannot attend.`
				)
				.setImage(
					"https://jhresources.ams3.digitaloceanspaces.com/lpfc/bot/tutorial-attendance.gif"
				)
				.setColor("#4aaace");

			const sCard = new EmbedBuilder()
				.setTitle("Any Questions?")
				.setDescription(
					`If you do have any questions, please contact <@!438350665430073345> and he will be happy to help you!`
				)
				.setColor("#4aaace");

			interaction.channel.send({
				embeds: [card,  atCard, sCard],
			});

			await interaction.followUp("Okie Dokie!");

			return;
		}

		if (
			(
				interaction.options as CommandInteractionOptionResolver
			).getSubcommand() == "verify"
		) {
			const card = new EmbedBuilder()
				.setTitle(
					"Welcome to the Leeds Powerchair Football Club Discord Server!"
				)
				.setColor("#4aaace")
				.setDescription(
					`Please verify yourself by clicking the button below!`
				);

			interaction.channel.send({
				embeds: [card],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setLabel("Verify")
							.setStyle(ButtonStyle.Primary)
							.setCustomId("verify")
							.setEmoji({
								name: "🪪"
							})
					) as any,
				],
			});

			await interaction.followUp("Okie Dokie!");

			return;
		}

		const card = new EmbedBuilder()
			.setTitle("Not found!")
			.setDescription("Command not found!");

		await interaction.followUp({
			embeds: [card],
		});
	},
};

export default print;
