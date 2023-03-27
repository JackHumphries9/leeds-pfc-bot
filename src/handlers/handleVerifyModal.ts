import {
	ActionRowBuilder,
	ButtonInteraction,
	CacheType,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export const handleVerifyModal = async (
	interaction: ButtonInteraction<CacheType>
) => {
	const modal = new ModalBuilder()
		.setCustomId(`verifyModal`)
		.setTitle("Verify");

	const nameInput = new TextInputBuilder()
		.setCustomId("name")
		.setLabel("Name")
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(100)
		.setRequired(true);

	const teamInput = new TextInputBuilder()
		.setCustomId("team")
		.setLabel("Team")
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(25)
		.setRequired(true);

	const number = new TextInputBuilder()
		.setCustomId("number")
		.setLabel("Number")
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(3)
		.setRequired(true);

	const ac1 =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			nameInput
		);
	const ac2 =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			teamInput
		);
	const ac3 =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			number
		);

	modal.addComponents(ac1, ac2, ac3);

	interaction.showModal(modal);
};
