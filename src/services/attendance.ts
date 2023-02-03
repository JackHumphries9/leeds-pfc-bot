import { debug } from "../utils/logger";

export const attendance = async (
	userId: string,
	eventId: string,
	attending: boolean
): Promise<{ updated: boolean }> => {
	const update = global.attendance.findIndex(
		(a) => a.userId === userId && a.eventId === eventId
	);

	if (update !== -1) {
		global.attendance[update] = {
			...global.attendance[update],
			attending: attending,
		};
		return { updated: true };
	}

	global.attendance.push({
		userId: userId,
		eventId: eventId,
		attending: attending,
	});
	debug(JSON.stringify(global.attendance));

	return { updated: false };
};
