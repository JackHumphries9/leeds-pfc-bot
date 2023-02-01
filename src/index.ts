import { Client, Events, GatewayIntentBits } from "discord.js";

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
	throw new Error("No token provided");
	process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);
