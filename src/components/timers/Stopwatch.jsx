import { useState, useEffect } from "react";
import "../../css/components/Timer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";

import "../../css/components/Stopwatch.css";

function Stopwatch() {
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
	const [startTime, setStartTime] = useState();

	useEffect(() => {
		if (!isRunning || isPaused) {
			return;
		}

		const stopwatch = setInterval(() => {
			if (!isRunning || isPaused) {
				clearInterval(stopwatch);
			}
			setTime((prevTime) => {
				console.log(isRunning, isPaused);

				// const totalSeconds = prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds;
				const now = Date.now();

				const elapsedTime = now - startTime;

				const totalSeconds = Math.floor(elapsedTime / 1000);

				console.log({
					hours: Math.floor(totalSeconds / 3600),
					minutes: (totalSeconds % 3600) / 60,
					seconds: totalSeconds % 60,
				});

				return {
					hours: Math.floor(totalSeconds / 3600),
					minutes: Math.floor((totalSeconds / 60) % 60),
					seconds: totalSeconds % 60,
					milliseconds: elapsedTime % 1000,
				};
			});
		}, 100);

		return () => clearInterval(stopwatch);
	}, [isRunning, isPaused]);

	function handleStartTime() {
		setIsRunning(true);
		setStartTime(Date.now());
	}

	function handleStopTime() {
		setIsRunning(false);
		setIsPaused(false);

		setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
	}

	function handlePauseTime() {
		setIsPaused((prev) => !prev);
	}

	return (
		<div className="timer-wrapper">
			<div className="header">
				<div className="timer-type">Stopwatch</div>
			</div>
			<div className="timer-misc">
				<div className="timer-label">Running</div>
			</div>
			<div className="stopwatch-display">
				{time.hours != 0
					? `${time.hours.toString().padStart(2, 0)}:${time.minutes.toString().padStart(2, 0)}:${time.seconds
							.toString()
							.padStart(2, 0)}.${time.milliseconds.toString().padStart(2, 0).substring(0, 2)}`
					: `${time.minutes.toString().padStart(2, 0)}:${time.seconds
							.toString()
							.padStart(2, 0)}.${time.milliseconds.toString().padStart(2, 0).substring(0, 2)}`}
			</div>
			<div className="button-container"></div>

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
	);
}

export default Stopwatch;
