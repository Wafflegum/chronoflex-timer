import React, { useEffect, useRef, useState } from "react";
import "../../css/components/NormalTimer.css";

function NormalTimer() {
	const [isRunning, setIsRunning] = useState(false);

	const hoursRef = useRef();
	const minutesRef = useRef();
	const secondsRef = useRef();
	const timerDisplayRef = useRef();

	const [timerDuration, setTimerDuration] = useState();
	const [timerProgress, setTimerProgress] = useState();

	const calculateTimeLeft = () => {
		const totalSeconds = hoursRef.current.value * 3600 + minutesRef.current.value * 60 + secondsRef.current.value;
		setTimerDuration(totalSeconds);

		return {
			hours: Math.floor(totalSeconds / 3600),
			minutes: Math.floor((totalSeconds % 3600) / 60),
			seconds: totalSeconds % 60,
		};
	};

	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

	function handleStartTime() {
		setTimeLeft(calculateTimeLeft());
		setIsRunning(true);
	}

	function handlePauseTime() {
		setIsRunning(false);
	}

	useEffect(() => {
		if (!isRunning) return;

		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				const totalSeconds = prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds;
				if (totalSeconds <= 0) {
					clearInterval();
					setIsRunning(false);
					return { hours: 0, minutes: 0, seconds: 0 };
				}

				const newTotalSeconds = totalSeconds - 1;
				// setTimerProgress((newTotalSeconds / timerDuration) * 100);
				timerDisplayRef.current.style.setProperty("--progress", `${(newTotalSeconds / timerDuration) * 100}%`);

				return {
					hours: Math.floor(newTotalSeconds / 3600),
					minutes: Math.floor((newTotalSeconds % 3600) / 60),
					seconds: newTotalSeconds % 60,
				};
			});
		}, 1000);

		return () => clearInterval(timer);
	});

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

	return (
		<>
			<div className="timer-wrapper">
				{isRunning ? (
					<div
						className="timer-display"
						data-valuenow={`${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
							.toString()
							.padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
						data-progress={`${timerProgress}%`}
						ref={timerDisplayRef}
					></div>
				) : (
					<div className="timer-field">
						<input
							type="number"
							id="hours"
							ref={hoursRef}
							placeholder="00"
							onKeyDown={inputCharacterLimiter}
						/>
						<input
							type="number"
							id="minutes"
							ref={minutesRef}
							placeholder="00"
							onKeyDown={inputCharacterLimiter}
						/>
						<input
							type="number"
							id="seconds"
							ref={secondsRef}
							placeholder="00"
							onKeyDown={inputCharacterLimiter}
						/>
					</div>
				)}
				<div className="button-container">
					<button onClick={() => handleStartTime()}>Start</button>
					<button onClick={handlePauseTime}>Pause</button>
				</div>
			</div>
		</>
	);
}

export default NormalTimer;
