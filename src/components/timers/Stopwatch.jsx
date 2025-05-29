import { useState, useEffect } from "react";
import "../../css/components/Timer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";

function Stopwatch() {
	const [isRunning, setRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const [time, setTime] = useState();

	useEffect(() => {
		const stopwatch = setInterval(() => {
			setTime((prevTime) => {
				// const totalSeconds =
			});
		}, 1000);
	});

	return (
		<div className="timer-wrapper">
			<div className="label">label</div>
			<div className="stopwatch-display">00:00:00</div>
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
