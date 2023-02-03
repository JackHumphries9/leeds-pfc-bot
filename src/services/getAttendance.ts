import { Attendance } from "../types/UtilTypes";

export const getAttendanceFromEventId = async (
	eventId: string
): Promise<Attendance[]> => {
	return global.attendance.filter((a) => a.eventId === eventId);
};
