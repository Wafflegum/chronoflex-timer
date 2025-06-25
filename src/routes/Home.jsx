import "../css/Home.css";
import NormalTimer from "../components/timers/NormalTimer";
import { nanoid } from "nanoid";
import Stopwatch from "../components/timers/Stopwatch";
import CustomizableTimer from "../components/timers/CustomizableTimer";

function Home() {
	return (
		<>
			<div className="scrollsnap-page-container">
				{/* <div className="title">ChronoFlex Timer</div> */}
				<div className="timer-container">
					<NormalTimer />
					<Stopwatch />
					<CustomizableTimer id={"interval-1"} />
				</div>
			</div>
		</>
	);
}

export default Home;
