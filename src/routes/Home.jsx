import React from "react";
import "../css/Home.css";
import NormalTimer from "../components/timers/NormalTimer";

function Home() {
	return (
		<>
			<div className="scrollsnap-page-container">
				<div className="title">Timer</div>
				<div className="timer-container">
					<NormalTimer />
					<NormalTimer />
				</div>
			</div>
		</>
	);
}

export default Home;
