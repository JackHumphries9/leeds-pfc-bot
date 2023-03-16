import chalk from "chalk";

export const info = (message: string) => {
	console.log(chalk.blue("[INFO] ") + message);
};

export const warn = (message: string) => {
	console.log(chalk.yellow("[WARN] ") + message);
};

export const logError = (message: string, err: Error | any) => {
	console.log(chalk.red("[ERROR] ") + message);
	if (err) console.error(err);
};

export const debug = (message: string) => {
	console.log(chalk.green("[DEBUG] ") + message);
};

export const success = (message: string) => {
	console.log(chalk.green("[SUCCESS] ") + message);
};
