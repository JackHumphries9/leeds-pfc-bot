import { info } from "console";
import { IAttendance } from "../types/UtilTypes";
import { Repository, SetAttendanceResponse } from "./repository";

import { Client as PGClient } from "pg";
import { logError } from "../utils/logger";

export class PostgresRepository extends Repository {
	private db: PGClient;

	constructor() {
		super();
		this.db = new PGClient({
			connectionString: process.env.DATABASE_URL,
		});
		{
			(async () => {
				await this.db.connect();
				info("Connected to database");
			})();
		}
	}

	async clearAttendance(): Promise<void> {
		await this.db.query("DELETE FROM attendance");
	}

	async clearOldAttendance(): Promise<void> {
		await this.db.query(
			"DELETE FROM attendance WHERE created_at < NOW() - INTERVAL '1 week'"
		);
	}

	async getAttendanceFromEventId(eventId: string): Promise<IAttendance[]> {
		const rows = await this.db.query(
			"SELECT user_id, is_attending FROM attendance WHERE event_id = $1",
			[eventId]
		);

		if (rows.rowCount === 0) {
			return [];
		}

		return rows.rows.map((row) => ({
			eventId: eventId,
			isAttending: row.is_attending,
			userId: row.user_id,
		}));
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<IAttendance | undefined> {
		const rows = await this.db.query(
			"SELECT is_attending FROM attendance WHERE event_id = $1 AND user_id = $2",
			[eventId, userId]
		);

		if (rows.rowCount === 0) {
			return undefined;
		}

		return {
			eventId: eventId,
			isAttending: rows.rows[0].is_attending,
			userId: userId,
		};
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<SetAttendanceResponse> {
		await this.db.query(
			"INSERT INTO attendance (user_id, event_id, is_attending) VALUES ($1, $2, $3) ON CONFLICT (user_id, event_id) DO UPDATE SET is_attending = $3, updated_at = NOW()",
			[userId, eventId, attending]
		);

		return {
			updated: true,
		};
	}

	async getAllAttendance(): Promise<IAttendance[]> {
		const rows = await this.db.query(
			"SELECT user_id, event_id, is_attending FROM attendance"
		);

		if (rows.rowCount === 0) {
			return [];
		}

		return rows.rows.map((row) => ({
			eventId: row.event_id,
			isAttending: row.is_attending,
			userId: row.user_id,
		}));
	}

	async getAttendanceForUser(userId: string): Promise<IAttendance[]> {
		const rows = await this.db.query(
			"SELECT event_id, is_attending FROM attendance WHERE user_id = $1",
			[userId]
		);

		if (rows.rowCount === 0) {
			return [];
		}

		return rows.rows.map((row) => ({
			eventId: row.event_id,
			isAttending: row.is_attending,
			userId: userId,
		}));
	}
}
