import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { motion, spring } from "framer-motion";

import { getVersion } from "@tauri-apps/api/app";

import "../css/Settings.css";
import { AnimatePresence } from "framer-motion";

function Settings() {
	const [version, setVersion] = useState("");
	const [theme, setTheme] = useState("dark");
	const [colorTheme, setColorTheme] = useState("default");
	const [isSelectingColor, setIsSelectingColor] = useState(false);

	function handleDarkMode() {
		setTheme("dark");
		document.querySelector("body").setAttribute("theme", `dark-${colorTheme}`);
	}
	function handleLightMode() {
		setTheme("light");

		document.querySelector("body").setAttribute("theme", `light-${colorTheme}`);
	}

	function handleChangeColorTheme(attr) {
		setColorTheme(attr);
		document.querySelector("body").setAttribute("theme", `${theme}-${attr}`);
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
						<button id="colorBtn" onClick={() => setIsSelectingColor((prev) => !prev)}></button>
					</div>

					<AnimatePresence>
						{isSelectingColor && (
							<>
								<motion.div
									className="modal-background"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									onClick={() => setIsSelectingColor(false)}
								/>
								<motion.div
									className="color-selection-modal"
									initial={{ transform: "translateY(100%)" }}
									animate={{ transform: "translateY(0rem)" }}
									exit={{ transform: "translateY(100%)" }}
								>
									<div className="page-title">Color Themes</div>
									<div className="colors-container">
										<button
											className="btn-color-option"
											style={{ background: "#777777" }}
											onClick={() => handleChangeColorTheme("default")}
										></button>
										<button
											className="btn-color-option"
											style={{ background: "#692672" }}
											onClick={() => handleChangeColorTheme("purple")}
										></button>
									</div>
								</motion.div>
							</>
						)}
					</AnimatePresence>
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
