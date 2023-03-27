import { Attendance } from "../types/UtilTypes";

export abstract class Repository {
	async clearAttendance(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async getAttendanceFromEventId(eventId: string): Promise<Attendance[]> {
		throw new Error("Method not implemented.");
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<Attendance> {
		throw new Error("Method not implemented.");
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<{ updated: boolean }> {
		throw new Error("Method not implemented.");
	}

	async getAllAttendance(): Promise<Attendance[]> {
		throw new Error("Method not implemented.");
	}

	async clearOldAttendance(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
