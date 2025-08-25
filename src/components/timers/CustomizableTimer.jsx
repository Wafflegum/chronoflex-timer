import { useEffect, useRef, useState } from "react";
import { inputCharacterLimiter } from "../../utilities.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";

import finishAudio from "/audio/ding-2.mp3";
import roundAudio from "/audio/ding-3.wav";

import startBeep from "/audio/start-beep.mp3";
import deepBeep from "/audio/deep-beep.mp3";

import "../../css/components/CustomizableTimer.css";

function CustomizableTimer({ id }) {
	const [label, setLabel] = useState("");
	const [notes, setNotes] = useState("");

	const [state, setState] = useState("stopped"); // states are running, paused, stopped or countdown
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [timerDuration, setTimerDuration] = useState(0); // in seconds

	const [secondsRemaining, setSecondsRemaining] = useState(0);

	const [rounds, setRounds] = useState(3);
	const [currentRound, setCurrentRound] = useState(0);

	const [timeMode, setTimeMode] = useState("work"); // work, rest
	const [workTime, setWorkTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [restTime, setRestTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

	const [customizability, SetCustomizability] = useState(true);
	const [preCountdown, setPreCountdown] = useState(true);
	const [preCountdownDuration, setPreCountdownDuration] = useState(3); // starting countdown in seconds
	const [preCountdownTimer, setPreCountdownTimer] = useState(0);

	// work input refs
	const workHoursRef = useRef();
	const workMinutesRef = useRef();
	const workSecondsRef = useRef();

	// rest input refs
	const restHoursRef = useRef();
	const restMinutesRef = useRef();
	const restSecondsRef = useRef();

	function formatTime(time) {
		const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
		// setTimerDuration(totalSeconds);

		return {
			hours: Math.floor(totalSeconds / 3600),
			minutes: Math.floor((totalSeconds % 3600) / 60),
			seconds: totalSeconds % 60,
		};
	}

	function formatSeconds(time) {
		return time.hours * 3600 + time.minutes * 60 + time.seconds;
	}

	function saveToHistory(isCompleted) {
		const timerSession = {
			id: id,
			date: new Date(),
			label: label,
			notes: notes,
			type: "interval",
			rounds: rounds,
			workTime: workTime,
			restTime: restTime,
			preCountdown: preCountdown,
			preCountdownDuration: preCountdownDuration,
			completed: isCompleted,
		};

		const history = JSON.parse(localStorage.getItem("history")) || [];

		history.push(timerSession);
		localStorage.setItem("history", JSON.stringify(history));
	}

	function handleStartTime() {
		setWorkTime(
			formatTime({
				hours: workHoursRef.current.value,
				minutes: workMinutesRef.current.value,
				seconds: workSecondsRef.current.value,
			})
		);
		setRestTime(
			formatTime({
				hours: restHoursRef.current.value,
				minutes: restMinutesRef.current.value,
				seconds: restSecondsRef.current.value,
			})
		);

		setTimeLeft(
			formatTime({
				hours: workHoursRef.current.value,
				minutes: workMinutesRef.current.value,
				seconds: workSecondsRef.current.value,
			})
		);
		setTimerDuration(
			formatSeconds({
				hours: workHoursRef.current.value,
				minutes: workMinutesRef.current.value,
				seconds: workSecondsRef.current.value,
			})
		);

		setCurrentRound(1);
		setTimeMode("work");

		// save last session
		const session = {
			id: id,
			workTime: workTime,
			restTime: restTime,
		};

		localStorage.setItem(id, JSON.stringify(session));

		if (preCountdown) {
			setPreCountdownTimer(preCountdownDuration + 1);
			setState("countdown");
		} else {
			setState("running");
		}
	}

	function handleStopTime() {
		setCurrentRound(1);

		saveToHistory(false);
		setState("stopped");
	}

	function handlePauseTime() {
		if (state === "paused") {
			setState("running");
		} else if ("running") {
			setState("paused");
		}
	}

	function handleClickSettings() {
		if (state === "settings") {
			setState("stopped");
		} else {
			setState("settings");
		}
	}

	function switchTimeMode(mode) {
		if (mode === "work") {
			setTimeLeft(workTime);
			setTimerDuration(formatSeconds(workTime));
			setTimeMode("work");
		} else if (mode === "rest") {
			setTimeLeft(restTime);
			setTimerDuration(formatSeconds(restTime));
			setTimeMode("rest");
		}
	}

	useEffect(() => {
		const savedSession = JSON.parse(localStorage.getItem(id)) || null;

		if (savedSession) {
			setWorkTime(savedSession.workTime);
			setRestTime(savedSession.restTime);
		}
	}, []);

	// Timer functionalities
	useEffect(() => {
		if (state !== "running") return;

		const timer = setInterval(() => {
			const totalSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;

			if (totalSeconds <= 0) {
				if (currentRound >= rounds) {
					clearInterval(timer);
					setState("stopped");
					console.log("Session ended");

					const audio = new Audio(finishAudio);
					audio.play();

					const timerSession = {};

					saveToHistory(true);
				} else {
					const audio = new Audio(roundAudio);
					audio.play();

					if (timeMode === "work") {
						setTimerDuration(formatSeconds(restTime));
						setTimeMode("rest");

						console.log("rest");
						setTimeLeft(restTime);
						setCurrentRound((prev) => prev + 1);
					} else if (timeMode === "rest") {
						console.log("work");

						setTimerDuration(formatSeconds(workTime));
						setTimeMode("work");
						setTimeLeft(workTime);
					}
				}
			} else {
				const newTotalSeconds = totalSeconds - 1;

				if (newTotalSeconds < 3) {
					const audio = new Audio(deepBeep);
					audio.play();
				}

				setSecondsRemaining((newTotalSeconds / timerDuration) * 100);

				const time = {
					hours: Math.floor(newTotalSeconds / 3600),
					minutes: Math.floor((newTotalSeconds % 3600) / 60),
					seconds: newTotalSeconds % 60,
				};

				setTimeLeft(time);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [state, timeLeft, timeMode, currentRound, rounds, timerDuration]);

	// Starting countdown functionality
	useEffect(() => {
		if (state !== "countdown") return;

		const timer = setInterval(() => {
			if (preCountdownTimer > 1) {
				const audio = new Audio(deepBeep);

				if (!audio.onplaying) audio.play();

				setPreCountdownTimer((prev) => {
					const countdown = prev - 1;

					return countdown;
				});
			} else {
				clearInterval(timer);
				setState("running");

				console.log("Timer started");

				const audio = new Audio(startBeep);
				audio.play();
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [preCountdownDuration, state, preCountdownTimer]);
	return (
		<>
			<div className="customizable-timer-wrapper">
				<div className="header">
					<div className="timer-type">Interval Timer</div>
					<div className="timer-label">Label</div>
					{customizability && (state === "settings" || state === "stopped") && (
						<button className="btn-icon" onClick={handleClickSettings}>
							<FontAwesomeIcon icon={faStopwatch} />
						</button>
					)}

					<div className="currentRoundDisplay">
						{state === "running" ? (
							<>
								{timeMode === "work" && `Round ${currentRound}`}

								{timeMode === "rest" && "Rest"}
							</>
						) : (
							""
						)}
					</div>
				</div>
				{state === "countdown" && (
					<div className="startCountdown-display">
						{preCountdownTimer > preCountdownDuration ? "Timer start in..." : preCountdownTimer}
					</div>
				)}
				{(state === "running" || state === "paused") && (
					<>
						<div className="timer-display">
							<CircularProgressbarWithChildren
								value={secondsRemaining}
								strokeWidth={2}
								styles={buildStyles({
									pathColor: timeMode === "work" ? "var(--accent-color)" : "#8eff8e",
									pathTransitionDuration: 0.25,
								})}
								data-mode={timeMode === "work" ? "var(--accent-color)" : "#8eff8e"}
							>
								{`${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
									.toString()
									.padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
							</CircularProgressbarWithChildren>
						</div>
						<div className="button-container">
							{state !== "paused" ? (
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
					</>
				)}
				{state === "stopped" && (
					<>
						<div className="timer-field-container">
							<div className="timer-field-label">Work Duration</div>
							<div className="timer-field">
								<input
									type="number"
									id="hours"
									ref={workHoursRef}
									placeholder="00"
									onKeyDown={inputCharacterLimiter}
								/>
								<input
									type="number"
									id="minutes"
									ref={workMinutesRef}
									placeholder="00"
									onKeyDown={inputCharacterLimiter}
								/>
								<input
									type="number"
									id="seconds"
									ref={workSecondsRef}
									placeholder="00"
									onKeyDown={inputCharacterLimiter}
								/>
							</div>
						</div>

						<div className="timer-field-container">
							<div className="timer-field-label">Rest Duration</div>
							<div className="timer-field">
								<input
									type="number"
									id="hours"
									ref={restHoursRef}
									placeholder="00"
									onKeyDown={inputCharacterLimiter}
								/>
								<input
									type="number"
									id="minutes"
									ref={restMinutesRef}
									placeholder="00"
									onKeyDown={inputCharacterLimiter}
								/>
								<input
									type="number"
									id="seconds"
									ref={restSecondsRef}
									placeholder="00"
									onKeyDown={inputCharacterLimiter}
								/>
							</div>
						</div>

						<div className="button-container">
							<button onClick={() => handleStartTime()}>
								<FontAwesomeIcon icon={faPlay} />
							</button>
						</div>
					</>
				)}
				{state === "settings" && (
					<div className="settings-container">
						<div className="setting-wrapper">
							<label htmlFor="">Rounds</label>
							<input
								type="number"
								placeholder="0"
								value={rounds}
								className="number-input-field"
								id="roundSetting"
								onChange={(e) => {
									setRounds(e.target.value);
								}}
								onKeyDown={inputCharacterLimiter}
							/>
						</div>

						<div className="setting-wrapper">
							<label htmlFor="preCountdownToggle">Pre-Countdown</label>
							<input
								type="checkbox"
								name="Pre-Countdown Toggle"
								id="preCountdownToggle"
								checked={preCountdown}
								onChange={(e) => {
									setPreCountdown(e.target.checked);
								}}
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default CustomizableTimer;
