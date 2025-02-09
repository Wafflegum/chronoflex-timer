import React, { useEffect, useRef, useState } from "react";
import "../../css/components/NormalTimer.css";

function NormalTimer() {
	const [isRunning, setIsRunning] = useState(false);

	const hoursRef = useRef();
	const minutesRef = useRef();
	const secondsRef = useRef();

	const calculateTimeLeft = () => {
		const totalSeconds = hoursRef.current.value * 3600 + minutesRef.current.value * 60 + secondsRef.current.value;

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

				return {
					hours: Math.floor(newTotalSeconds / 3600),
					minutes: Math.floor((newTotalSeconds % 3600) / 60),
					seconds: newTotalSeconds % 60,
				};
			});
		}, 1000);

		return () => clearInterval(timer);
	});

	return (
		<>
			{isRunning ? (
				<div className="timer-wrapper">{`${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
					.toString()
					.padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}</div>
			) : (
				<div className="timer-field">
					<input type="number" id="hours" ref={hoursRef} placeholder="00" />
					<input type="number" id="minutes" ref={minutesRef} placeholder="00" />
					<input type="number" id="seconds" ref={secondsRef} placeholder="00" />
				</div>
			)}
			<button onClick={() => handleStartTime()}>Start</button>
			<button>Pause</button>
		</>
	);
}

export default NormalTimer;
