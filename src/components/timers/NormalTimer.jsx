import { useEffect, useRef, useState } from "react";
import "../../css/components/Timer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import alarmAudio from "/audio/ding-2.mp3";
import { inputCharacterLimiter } from "../../utilities";
import TimerMisc from "../TimerMisc";

function NormalTimer({ id }) {
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [secondsRemaining, setSecondsRemaining] = useState(0);

	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const [state, setState] = useState("stopped");

	const hoursRef = useRef();
	const minutesRef = useRef();
	const secondsRef = useRef();
	const timerDisplayRef = useRef();

	const [timerDuration, setTimerDuration] = useState();
	const [label, setLabel] = useState("JUMP ROPE");
	const [notes, setNotes] = useState("Notes...");

	const calculateTimeLeft = () => {
		const totalSeconds = hoursRef.current.value * 3600 + minutesRef.current.value * 60 + secondsRef.current.value;
		setTimerDuration(totalSeconds);

		return {
			hours: Math.floor(totalSeconds / 3600),
			minutes: Math.floor((totalSeconds % 3600) / 60),
			seconds: totalSeconds % 60,
		};
	};

	function saveToHistory(isCompleted) {
		const timerSession = {
			id: id,
			date: new Date(),
			timerLabel: label,
			type: "countdown",
			timerDuration: {
				hours: Math.floor(timerDuration / 3600),
				minutes: Math.floor((timerDuration % 3600) / 60),
				seconds: timerDuration % 60,
			},
			completed: isCompleted,
		};

		const history = JSON.parse(localStorage.getItem("history")) || [];

		history.push(timerSession);
		localStorage.setItem("history", JSON.stringify(history));
	}

	function handleStartTime() {
		const formatTime = calculateTimeLeft();

		if (formatTime.hours * 3600 + formatTime.minutes * 60 + formatTime.seconds <= 0) {
			return;
		}

		setTimeLeft(formatTime);
		setIsRunning(true);

		const timerSession = {
			id: id,
			date: new Date(),
			timerLabel: label,
			type: "countdown",
			isRunning: true,
			isPaused: isPaused,
			timeLeft: calculateTimeLeft(),
			startTime: Date.now(),
			timerDuration: hoursRef.current.value * 3600 + minutesRef.current.value * 60 + secondsRef.current.value,
		};

		localStorage.setItem("timerSession", JSON.stringify(timerSession));
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

		// saveToHistory(false);

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
			const totalSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;

			// when timer finishes
			if (totalSeconds <= 0) {
				clearInterval(timer);

				const audio = new Audio(alarmAudio);
				audio.play();

				setIsRunning(false);
				localStorage.removeItem("timerSession");

				saveToHistory(true);

				setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
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

			setTimeLeft(time);
		}, 1000);

		return () => clearInterval(timer);
	}, [isRunning, isPaused, timeLeft]);

	return (
		<>
			<div className="timer-wrapper">
				<div className="header">
					<div className="timer-type">Countdown</div>
				</div>

				<TimerMisc label={label} setLabel={setLabel} notes={notes} setNotes={setNotes} />

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
							<button onClick={() => handlePauseTime()}>
								<FontAwesomeIcon icon={faPause} />
							</button>
						) : (
							<button onClick={() => handlePauseTime()}>
								<FontAwesomeIcon icon={faPlay} />
							</button>
						)}

						<button onClick={() => handleStopTime()}>
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
