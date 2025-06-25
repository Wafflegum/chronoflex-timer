// Blocks special characters to be inputted on the timers
function inputCharacterLimiter(e) {
	const invalidChars = ["-", "+", "=", "e"];

	// avoids user from inputting special characters such as E and +
	if (invalidChars.includes(e.key)) {
		e.preventDefault();
	}

	// This will limit the characters to two. It checks if the username is a number, if it is, then block it. Otherwise, if it's a backspace, proceed.
	if (!isNaN(e.key) && e.target.value.length >= 2) {
		e.preventDefault();
	}
}

function formatDateTime(date, formatTime = false) {
	const optionsDate = { year: "numeric", month: "numeric", day: "numeric" };
	const optionsTime = { hour: "numeric", minute: "numeric", hour12: false };

	const formattedDate = new Date(date).toLocaleDateString(undefined, optionsDate);
	const formattedTime = new Date(date).toLocaleTimeString(undefined, optionsTime);

	return formatTime ? `${formattedDate} - ${formattedTime}` : `${formattedDate}`;
}

export { inputCharacterLimiter };
