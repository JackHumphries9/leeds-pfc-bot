import { Client } from "discord.js";
import config from "../config";
import axios from "axios";
import { info } from "console";
import { TeamUpEvent } from "../types/TeamUpEvent";
import { Repository } from "../repositories/repository";
import { logError } from "../utils/logger";

const DISCORD_API_URL = "https://discord.com/api";

interface ServerEvent {
	name: string;
	scheduled_start_time: Date;
	scheduled_end_time: Date;
	description: string;
	location?: string;
}

interface GuildScheduledEvent {
	id: string;
	guild_id: string;
	name: string;
	description: string;
	channel_id: null;
	creator_id: string;
	creator: {
		id: string;
		username: string;
		avatar: string;
		discriminator: string;
		public_flags: number;
		premium_type: number;
		flags: number;
		bot: boolean;
		banner: string;
		accent_color: string;
		global_name: string;
		avatar_decoration_data: any;
		banner_color: string;
	};
	image: string;
	scheduled_start_time: string;
	scheduled_end_time: string;
	status: number;
	entity_type: number;
	entity_id: any;
	recurrence_rule: any;
	privacy_level: number;
	sku_ids: any[];
	guild_scheduled_event_exceptions: any[];
	entity_metadata: {
		location: string;
	};
}

export class EventManager {
	private client: Client<boolean>;
	private database: Repository;

	constructor(client: Client<boolean>, db: Repository) {
		this.client = client;
		this.database = db;

		info("EventManager initialized");
	}

	public async upsertDiscordEvents(calendarEvents: TeamUpEvent[]) {
		info("Upserting Discord events");
		try {
			const discordEvents = await this.getDiscordEvents();

			for (const event of calendarEvents) {
				const discordEventId = await this.database.getEventDiscordEvent(
					event.id
				);

				if (discordEventId) {
					const discordEvent = discordEvents.find(
						(e) => e.id === discordEventId
					);

					if (!discordEvent) {
						const newDiscordEvent = await this.createDiscordEvent({
							name: event.title,
							scheduled_start_time: new Date(event.start_dt),
							scheduled_end_time: new Date(event.end_dt),
							description: event.notes,
							location: event.location,
						});

						await this.database.updateDiscordEventId(
							event.id,
							newDiscordEvent.id
						);
					} else {
						if (this.shouldUpdateEvent(event, discordEvent)) {
							await this.updateDiscordEvent(
								discordEventId,
								event
							);
						}
					}
				} else {
					const newDiscordEvent = await this.createDiscordEvent({
						name: event.title,
						scheduled_start_time: new Date(event.start_dt),
						scheduled_end_time: new Date(event.end_dt),
						description: event.notes,
						location: event.location,
					});

					await this.database.createEventDiscordEvent(
						event.id,
						newDiscordEvent.id
					);
				}
			}
		} catch (e) {
			logError("Error upserting Discord events", e);
		}

		info("Upserting Discord events complete");
	}

	public shouldUpdateEvent(
		event: TeamUpEvent,
		discordEvent: GuildScheduledEvent
	): boolean {
		console.log("Event:", event);
		console.log("Discord Event:", discordEvent);

		if (event.title !== discordEvent.name) {
			return true;
		}

		if (event.notes !== discordEvent.description) {
			return true;
		}

		if (event.location !== discordEvent.entity_metadata.location) {
			return true;
		}

		if (event.start_dt !== discordEvent.scheduled_start_time) {
			return true;
		}

		if (event.end_dt !== discordEvent.scheduled_end_time) {
			return true;
		}

		return false;
	}

	public async getDiscordEvents(): Promise<GuildScheduledEvent[]> {
		return (
			await axios.get(
				`${DISCORD_API_URL}/guilds/${config.guildId}/scheduled-events`,
				{
					headers: {
						Authorization: `Bot ${process.env.TOKEN}`,
					},
				}
			)
		).data;
	}

	public async updateDiscordEvent(
		id: string,
		event: Partial<ServerEvent>
	): Promise<void> {
		info("Updating Discord event", id, event);

		console.log(
			await axios.patch(
				`${DISCORD_API_URL}/guilds/${config.guildId}/scheduled-events/${id}`,
				{
					name: event.name,
					scheduled_start_time:
						event.scheduled_start_time?.toISOString(),
					scheduled_end_time: event.scheduled_end_time?.toISOString(),
					description: event.description,
					entity_metadata: {
						location: event.location,
					},
				},
				{
					headers: {
						Authorization: `Bot ${process.env.TOKEN}`,
					},
				}
			)
		);
	}

	public async createDiscordEvent(
		event: ServerEvent
	): Promise<GuildScheduledEvent> {
		const req = await axios.post(
			`${DISCORD_API_URL}/guilds/${config.guildId}/scheduled-events`,
			{
				name: event.name,
				scheduled_start_time: event.scheduled_start_time.toISOString(),
				scheduled_end_time: event.scheduled_end_time.toISOString(),
				description: event.description,
				entity_type: 3,
				privacy_level: 2,
				entity_metadata: {
					location: event.location,
				},
			},
			{
				headers: {
					Authorization: `Bot ${process.env.TOKEN}`,
				},
			}
		);

		return req.data;
	}
}
