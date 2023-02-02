import { TeamUpEvent } from "./types/TeamUpEvent";

const fetchCalendarData = async (): Promise<TeamUpEvent[]> => {
	const data = await fetch(
		"https://api.teamup.com/" +
			process.env.CALENDAR_KEY +
			"/events?startDate=2023-01-30&endDate=2023-02-05&format=markdown",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Teamup-Token": process.env.TEAMUP_TOKEN,
			},
		}
	);

	const json = await data.json();

	return json.events;
};

export default fetchCalendarData;
