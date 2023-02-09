import { Attendance } from "../types/UtilTypes";

export const getEventAttendanceForUser = async (
	eventId: string,
	userId: string
): Promise<Attendance> => {
	return global.attendance.find(
		(a) => a.eventId === eventId && a.userId === userId
	);
};
