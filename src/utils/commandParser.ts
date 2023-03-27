interface ICustomIDData {
	command: string;
	data: string[];
}

const customIdParser = (customId: string): ICustomIDData => {
	const [command, ...data] = customId.split("/");

	return {
		command,
		data,
	};
};

export default customIdParser;
