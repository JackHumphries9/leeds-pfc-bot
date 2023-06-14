import { IAttendance } from "../types/UtilTypes";

export interface SetAttendanceResponse {
	updated: boolean
}

export abstract class Repository {
	async clearAttendance(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async getAttendanceFromEventId(eventId: string): Promise<IAttendance[]> {
		throw new Error("Method not implemented.");
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<IAttendance> {
		throw new Error("Method not implemented.");
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<SetAttendanceResponse> {
		throw new Error("Method not implemented.");
	}

	async getAllAttendance(): Promise<IAttendance[]> {
		throw new Error("Method not implemented.");
	}

	async clearOldAttendance(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
