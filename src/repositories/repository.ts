import { IAttendance } from "../types/UtilTypes";

export interface SetAttendanceResponse {
	updated: boolean;
}

export abstract class Repository {
	abstract clearAttendance(): Promise<void>;

	abstract clearOldAttendance(): Promise<void>;

	abstract getAttendanceFromEventId(eventId: string): Promise<IAttendance[]>;

	abstract getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<IAttendance | undefined>;

	abstract setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<SetAttendanceResponse>;

	abstract getAllAttendance(): Promise<IAttendance[]>;

	abstract getAttendanceForUser(userId: string): Promise<IAttendance[]>;

	abstract createEventDiscordEvent(
		eventId: string,
		discordEvent: string
	): Promise<void>;

	abstract getEventDiscordEvent(eventId: string): Promise<string | undefined>;

	abstract updateDiscordEventId(
		eventId: string,
		newDiscordEventId: string
	): Promise<void>;
}
