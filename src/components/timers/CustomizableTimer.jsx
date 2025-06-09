import { useEffect, useRef, useState } from "react";
import { inputCharacterLimiter } from "../../utilities.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";

import "../../css/components/CustomizableTimer.css";

function CustomizableTimer() {
	const [state, setState] = useState("stopped"); // states are running, paused, or stopped
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [timerDuration, setTimerDuration] = useState(0); // in seconds

	const [secondsRemaining, setSecondsRemaining] = useState(0);

	const [rounds, setRounds] = useState(3);
	const [currentRound, setCurrentRound] = useState(0);

	const [timeMode, setTimeMode] = useState("work"); // work, rest
	const [workTime, setWorkTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [restTime, setRestTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

	const [customizability, SetCustomizability] = useState(true);

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
		setState("running");
	}

	function handleStopTime() {
		setState("stopped");
	}

	function handlePauseTime() {
		setState("paused");
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
		if (state !== "running") return;

		const timer = setInterval(() => {
			const totalSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;

			if (totalSeconds <= 0) {
				// const audio = new Audio(alarmAudio);
				// audio.play();

				if (currentRound >= rounds) {
					clearInterval(timer);
					setState("stopped");
					console.log("Session ended");

					return { hours: 0, minutes: 0, seconds: 0 };
				} else {
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
	return (
		<>
			<div className="customizable-timer-wrapper">
				<div className="header">
					<div className="timer-type">Interval Timer</div>
					{(customizability && state === "stopped") ||
						(customizability && state === "settings" && (
							<button className="btn-icon" onClick={handleClickSettings}>
								<FontAwesomeIcon icon={faStopwatch} />
							</button>
						))}
					<div className="timer-label">Test</div>
					{currentRound}
				</div>

				{(state === "running" || state === "paused") && (
					<>
						<div className="timer-display">
							<CircularProgressbarWithChildren
								value={secondsRemaining}
								strokeWidth={2}
								styles={buildStyles({
									pathColor: timeMode === "work" ? "light-dark(var(--accent-color))" : "#8eff8e",
								})}
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

				{state === "settings" ? "" : ""}
			</div>
		</>
	);
}

export default CustomizableTimer;
