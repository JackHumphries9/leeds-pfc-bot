const niceDate = (start: Date, end: Date, all_day?: boolean) => {
	if (start.getDay() === end.getDay()) {
		if (all_day) {
			return `${start.toLocaleDateString("en-GB", {
				dateStyle: "full",
			})}`;
		}
		return `${start.toLocaleString("en-GB", {
			dateStyle: "full",
			timeStyle: "short",
		})} till ${end.toLocaleTimeString("en-GB", {
			timeStyle: "short",
		})}`;
	}
	if (all_day) {
		return `${start.toLocaleDateString("en-GB", {
			dateStyle: "full",
		})} till ${end.toLocaleDateString("en-GB", {
			dateStyle: "full",
		})}`;
	}
	return `${start.toLocaleString("en-GB", {
		dateStyle: "full",
		timeStyle: "short",
	})} till ${end.toLocaleString("en-GB", {
		dateStyle: "full",
		timeStyle: "short",
	})}`;
};

export default niceDate;
