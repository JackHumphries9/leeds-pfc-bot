const map = {
	33: " #553711",
	34: " #724f22",
	35: " #9c6013",
	5: " #ca7609",
	6: " #f16c20",
	7: " #f58a4b",
	8: " #d2b53b",
	36: " #f6c811",
	3: " #a01a1a",
	37: " #ce1212",
	2: " #cf2424",
	1: " #f2665b",
	38: " #b20d47",
	39: " #d8135a",
	40: " #e81f78",
	41: " #f5699a",
	12: " #7a0f60",
	11: " #9d3283",
	10: " #b84e9d",
	9: " #d96fbf",
	13: " #542382",
	14: " #7742a9",
	15: " #8763ca",
	16: " #b586e2",
	20: " #133897",
	19: " #2951b9",
	18: " #4770d8",
	17: " #668CB3",
	21: " #1a5173",
	22: " #1a699c",
	23: " #0080a6",
	24: " #4aaace",
	28: " #176413",
	27: " #2d850e",
	26: " #5a8121",
	25: " #88b347",
	29: " #0f4c30",
	30: " #386651",
	31: " #00855b",
	32: " #4fb5a1",
	42: " #5c1c1c",
	4: " #7e3838",
	43: " #a55757",
	44: " #c37070",
	45: " #000000",
	46: " #383838",
	47: " #757575",
	48: " #a3a3a3",
};

export const teamUpColorToHex = (color: number): string | undefined => {
	return map[color];
};
