import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

// This will display labels and notes only
function TimerMisc({ label, setLabel, notes, setNotes }) {
	const [editMode, setEditMode] = useState("false");

	function handleEditMode(mode) {
		switch (editMode) {
			case "label":
				break;
			case "notes":
				break;
		}
	}

	return (
		<div className="timer-misc">
			{editMode === "label" ? (
				<div className="input-field-container">
					<input
						type="text"
						className="label-field"
						value={label}
						onChange={(e) => setLabel(e.target.value)}
					/>
					<button className="btn-icon" onClick={() => setEditMode(false)}>
						<FontAwesomeIcon icon={faCheck} />
					</button>
				</div>
			) : (
				<div className="timer-label" onClick={() => setEditMode("label")}>
					{label}
				</div>
			)}

			{editMode === "notes" ? (
				<div className="input-field-container">
					<input
						type="text"
						className="label-field"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					/>
					<button className="btn-icon" onClick={() => setEditMode(false)}>
						<FontAwesomeIcon icon={faCheck} />
					</button>
				</div>
			) : (
				<div className="timer-notes" onClick={() => setEditMode("notes")}>
					<div>{notes}</div>
					<div className="icon">
						<FontAwesomeIcon icon={faEdit} />
					</div>
				</div>
			)}
		</div>
	);
}

export default TimerMisc;
