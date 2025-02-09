import React from "react";
import "../css/Home.css";
import NormalTimer from "../components/timers/NormalTimer";

function Home() {
	return (
		<>
			<div className="page-container">
				<div className="title">Timer</div>
				<NormalTimer />
			</div>
		</>
	);
}

export default Home;
