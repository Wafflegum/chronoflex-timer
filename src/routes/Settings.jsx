import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { getVersion } from "@tauri-apps/api/app";

import "../css/Settings.css";

function Settings() {
	const [version, setVersion] = useState("");

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
				{/* Appearance */}
				<div className="settings-container__item">
					<div className="setting-title">Appearance</div>
					<div className="appearance-options-container">
						<div className="appearance-option">
							<span className="icon">
								<FontAwesomeIcon icon={faSun} />
							</span>
							<span>Light</span>
						</div>
						<div className="appearance-option">
							<span className="icon">
								<FontAwesomeIcon icon={faMoon} />
							</span>
							<span>Dark</span>
						</div>
						<div className="appearance-option">
							<span className="icon">
								<FontAwesomeIcon icon={faMobileScreen} />
							</span>
							<span>System</span>
						</div>
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
