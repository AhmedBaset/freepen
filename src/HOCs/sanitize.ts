export const sanitize = (value: string) => {
	const symbols: { [Key: string]: string } = {
		"&": "&amp;",
		"<": "&lt;",
		'"': "&quot;",
		"'": "&#x27;",
		"/": "&#x2F;",
		"\\": "&#x5C;",
		"`": "&#x60;",
		"=": "&#x3D;",
	};

	const regex = /[&<"'/\\`=]/gm;

	return value.replace(regex, (symbol) => symbols[symbol]);
};