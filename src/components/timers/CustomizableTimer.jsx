import { useEffect, useRef, useState } from "react";
import { inputCharacterLimiter } from "../../utilities.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

function CustomizableTimer() {
	const [state, setState] = useState("stopped"); // states are running, paused, or stopped
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [secondsRemaining, setSecondsRemaining] = useState(0);

	const [rounds, setRounds] = useState(3);
	const [workTime, setWorkTime] = useState();
	const [restTime, setRestTime] = useState();

	const [customizability, SetCustomizability] = useState(true);

	// input refs
	const hoursRef = useRef();
	const minutesRef = useRef();
	const secondsRef = useRef();

	function handleStartTime() {
		setState("running");
		console.log(state);
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

	return (
		<>
			<div className="timer-wrapper">
				<div className="header">
					<div className="timer-type">TABATA Timer</div>
					{(customizability && state === "stopped") ||
						(customizability && state === "settings" && (
							<button className="btn-icon" onClick={handleClickSettings}>
								<FontAwesomeIcon icon={faStopwatch} />
							</button>
						))}
				</div>
				<div className="timer-label">Test</div>

				{(state === "running" || state === "paused") && (
					<>
						<div className="timer-display">
							<CircularProgressbarWithChildren value={secondsRemaining} strokeWidth={2}>
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
