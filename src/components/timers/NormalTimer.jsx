import { useEffect, useRef, useState } from "react";
import "../../css/components/Timer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function NormalTimer({ id }) {
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [secondsRemaining, setSecondsRemaining] = useState(0);

	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const hoursRef = useRef();
	const minutesRef = useRef();
	const secondsRef = useRef();
	const timerDisplayRef = useRef();

	const [timerDuration, setTimerDuration] = useState();
	const [label, setLabel] = useState("JUMP ROPE");

	const calculateTimeLeft = () => {
		const totalSeconds = hoursRef.current.value * 3600 + minutesRef.current.value * 60 + secondsRef.current.value;
		setTimerDuration(totalSeconds);

		return {
			hours: Math.floor(totalSeconds / 3600),
			minutes: Math.floor((totalSeconds % 3600) / 60),
			seconds: totalSeconds % 60,
		};
	};

	function handleStartTime() {
		const formatTime = calculateTimeLeft();
		setTimeLeft(formatTime);
		setIsRunning(true);

		const timerSession = {
			id: id,
			timerLabel: "",
			type: "normal",
			isRunning: true,
			isPaused: isPaused,
			timeLeft: calculateTimeLeft(),
			startTime: Date.now(),
			timerDuration: hoursRef.current.value * 3600 + minutesRef.current.value * 60 + secondsRef.current.value,
		};

		localStorage.setItem("timerSession", JSON.stringify(timerSession));
		console.log(timerSession.timerDuration);
	}

	function handlePauseTime() {
		setIsPaused((prev) => !prev);
		const currentTimerSession = JSON.parse(localStorage.getItem("timerSession")) || {};

		localStorage.setItem(
			"timerSession",
			JSON.stringify({ ...currentTimerSession, isPaused: JSON.stringify(isPaused) })
		);
	}

	function handleStopTime() {
		setIsPaused(false);
		setIsRunning(false);

		localStorage.removeItem("timerSession");
	}

	// Startup boot, load timer if it exists
	useEffect(() => {
		const storedTimerSession = JSON.parse(localStorage.getItem("timerSession"));

		if (storedTimerSession) {
			const parsedTimeLeft = storedTimerSession.timeLeft;
			const startTime = storedTimerSession.startTime;
			const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
			const remainingTime = Math.max(
				parsedTimeLeft.hours * 3600 + parsedTimeLeft.minutes * 60 + parsedTimeLeft.seconds - elapsedSeconds,
				0
			);

			setTimeLeft({
				hours: Math.floor(remainingTime / 3600),
				minutes: Math.floor((remainingTime % 3600) / 60),
				seconds: remainingTime % 60,
			});

			setTimerDuration(storedTimerSession.timerDuration);

			setIsRunning(storedTimerSession.isRunning);
			setIsPaused(storedTimerSession.isPaused);
		}
	}, []);

	// Timer function
	useEffect(() => {
		if (!isRunning || isPaused) return;

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
				// timerDisplayRef.current.style.setProperty("--progress", `${(newTotalSeconds / timerDuration) * 100}%`);

				setSecondsRemaining((newTotalSeconds / timerDuration) * 100);

				const time = {
					hours: Math.floor(newTotalSeconds / 3600),
					minutes: Math.floor((newTotalSeconds % 3600) / 60),
					seconds: newTotalSeconds % 60,
				};

				const storedTimerSession = JSON.parse(localStorage.getItem("timerSession"));

				localStorage.setItem("timerSession", JSON.stringify({ ...storedTimerSession, timeLeft: time }));

				return time;
			});
		}, 1000);

		return () => clearInterval(timer);
	});

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

	return (
		<>
			<div className="timer-wrapper">
				<div className="header">
					<div className="timer-type">Countdown</div>
					<div className="timer-label">{label}</div>
				</div>
				{isRunning ? (
					// <div
					// 	className="timer-display"
					// 	data-valuenow={`${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
					// 		.toString()
					// 		.padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
					// 	ref={timerDisplayRef}
					// ></div>

					<div className="timer-display">
						<CircularProgressbarWithChildren value={secondsRemaining} strokeWidth={2}>
							{`${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
								.toString()
								.padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
						</CircularProgressbarWithChildren>
					</div>
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
				{isRunning ? (
					<div className="button-container">
						{!isPaused ? (
							<button onClick={handlePauseTime}>
								<FontAwesomeIcon icon={faPause} />
							</button>
						) : (
							<button onClick={handlePauseTime}>
								<FontAwesomeIcon icon={faPlay} />
							</button>
						)}

						<button onClick={handleStopTime}>
							<FontAwesomeIcon icon={faStop} />
						</button>
					</div>
				) : (
					<div className="button-container">
						<button onClick={() => handleStartTime()}>
							<FontAwesomeIcon icon={faPlay} />
						</button>
					</div>
				)}
			</div>
		</>
	);
}

export default NormalTimer;
