import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./css/App.css";
import Home from "./routes/Home";
import History from "./routes/History";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch, faTimeline, faGear } from "@fortawesome/free-solid-svg-icons";
import Settings from "./routes/Settings";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/history" element={<History />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>
			<nav className="navbar-container">
				<Link to="/" className="nav-wrapper">
					<div className="icon">
						<FontAwesomeIcon icon={faStopwatch} />
					</div>
				</Link>
				<Link to="/history" className="nav-wrapper">
					<div className="icon">
						<FontAwesomeIcon icon={faTimeline} />
					</div>
				</Link>
				<Link to="/settings" className="nav-wrapper" id="settings">
					<div className="icon">
						<FontAwesomeIcon icon={faGear} />
					</div>
				</Link>
			</nav>
		</>
	);
}

export default App;
