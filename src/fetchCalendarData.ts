import { TeamUpEvent } from "./types/TeamUpEvent";
import { info } from "./utils/logger";
import {
	dateToTeamUpFormat,
	firstDayOfWeek,
	lastDayOfWeek,
} from "./utils/temporal";

const fetchCalendarData = async (): Promise<TeamUpEvent[]> => {
	const today = new Date();

	const wc = firstDayOfWeek(today, 1);
	const we = lastDayOfWeek(today, 0);

	const data = await fetch(
		"https://api.teamup.com/" +
			process.env.CALENDAR_KEY +
			// "/events?startDate=2023-01-30&endDate=2023-02-05&format=markdown",
			//"/events?startDate=2023-02-13&endDate=2023-02-19&format=markdown",
			`/events?startDate=${dateToTeamUpFormat(
				wc
			)}&endDate=${dateToTeamUpFormat(we)}&format=markdown`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Teamup-Token": process.env.TEAMUP_TOKEN,
			},
		}
	);

	const json = await data.json();

	info("Successfully fetched calendar data");

	return json.events;
};

export default fetchCalendarData;
