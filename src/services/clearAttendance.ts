import { Attendance } from "../types/UtilTypes";

export const clearAttendance = async (): Promise<void> => {
	global.attendance = [];
};
