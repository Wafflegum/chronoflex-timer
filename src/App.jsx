import { Route, Routes, Link } from "react-router-dom";
import "./css/App.css";
import Home from "./routes/Home";
import History from "./routes/History";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch, faTimeline, faGear } from "@fortawesome/free-solid-svg-icons";
import Settings from "./routes/Settings";
import { useState } from "react";

function App() {
	const [activePage, setActivePage] = useState("home"); // pages are home, history, and settings
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/history" element={<History />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>
			<nav className="navbar-container">
				<Link
					to="/"
					className={`nav-wrapper ${activePage == "home" ? "active-page" : ""}`}
					onClick={() => {
						setActivePage("home");
					}}
				>
					<div className="icon">
						<FontAwesomeIcon icon={faStopwatch} />
					</div>
				</Link>
				<Link
					to="/history"
					className={`nav-wrapper ${activePage == "history" ? "active-page" : ""}`}
					onClick={() => {
						setActivePage("history");
					}}
				>
					<div className="icon">
						<FontAwesomeIcon icon={faTimeline} />
					</div>
				</Link>
				<Link
					to="/settings"
					className={`nav-wrapper ${activePage == "settings" ? "active-page" : ""}`}
					id="settings"
					onClick={() => {
						setActivePage("settings");
					}}
				>
					<div className="icon">
						<FontAwesomeIcon icon={faGear} />
					</div>
				</Link>
			</nav>
		</>
	);
}

export default App;
