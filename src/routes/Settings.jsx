import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { getVersion } from "@tauri-apps/api/app";

import "../css/Settings.css";

function Settings() {
	const [version, setVersion] = useState("");

	function handleDarkMode() {
		document.querySelector("body").setAttribute("theme", "dark");
	}
	function handleLightMode() {
		document.querySelector("body").setAttribute("theme", "light");
	}

	useEffect(() => {
		async function fetchAppInfo() {
			if (window.__TAURI__) {
				const ver = await getVersion();

				setVersion(`v${ver}`);
			} else {
				setVersion("DEV-PREVIEW-VERSION");
			}
		}

		fetchAppInfo();
	}, []);

	return (
		<div className="page-container" id="settingsPage">
			<div className="page-title">Settings</div>
			<div className="settings-container">
				{/* Timer Settings */}
				{/* <div className="settings-container__item">
					<div className="setting-title">Timer</div>
					<div className="settings-option">
						<div>Confirmation on finish</div>
						<input type="checkbox" />
					</div>
					<div className="settings-option">
						<div></div>
					</div>
				</div> */}

				{/* Appearance */}
				<div className="settings-container__item">
					<div className="setting-title">Appearance</div>
					<div className="appearance-options-container">
						<div className="appearance-option" onClick={() => handleLightMode()}>
							<span className="icon">
								<FontAwesomeIcon icon={faSun} />
							</span>
							<span>Light</span>
						</div>
						<div className="appearance-option" onClick={() => handleDarkMode()}>
							<span className="icon">
								<FontAwesomeIcon icon={faMoon} />
							</span>
							<span>Dark</span>
						</div>
						{/* <div className="appearance-option">
							<span className="icon">
								<FontAwesomeIcon icon={faMobileScreen} />
							</span>
							<span>System</span>
						</div> */}
					</div>

					<div className="settings-option">
						<span>Theme</span>
						<button id="colorBtn"></button>
					</div>
				</div>

				<div className="settings-container__item">
					<div className="setting-title">Notifications</div>
					<div className="settings-option">
						<div>Sound effects</div>
						<input type="checkbox" name="" id="" />
					</div>
					<div className="settings-option">
						<div>Notifications</div>
						<input type="checkbox" name="" id="" />
					</div>
				</div>
			</div>
			<footer id="aboutFooter">
				<div className="divider"></div>

				<div id="appInfo">
					<div>Chronoflex {version}</div>
					<div>Swipe up/down to navigate between timers</div>
				</div>
			</footer>
		</div>
	);
}

export default Settings;
