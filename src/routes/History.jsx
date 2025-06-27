import React, { useEffect, useState } from "react";
import "../css/History.css";
import { convertToTitleCase, formatTimeObject } from "../utilities";

function History() {
	const [historyData, setHistoryData] = useState([]);

	useEffect(() => {
		const fetchedHistory = JSON.parse(localStorage.getItem("history"));
		setHistoryData(fetchedHistory);
	}, []);
	return (
		<>
			<div className="page-container" id="historyPage">
				<div className="page-title">History</div>
				<div className="history-container">
					{historyData?.map((item) => {
						return (
							<div className="history-item" key={item.date}>
								<div className="history-item__info-container">
									<div className="history-item__type">{convertToTitleCase(item.type)}</div>
									<div className="history-item__date">{new Date(item.date).toLocaleString()}</div>
								</div>

								<div className="history-item__info-container">
									<div className="history-item__label">Label {item.label}</div>
									<div className="history-item__notes">Notes {item.notes}</div>
								</div>

								{item.type === "interval" && (
									<div className="history-item__time">
										<div>Work: {formatTimeObject(item.workTime)}</div>
										<div>Rest: {formatTimeObject(item.restTime)}</div>
									</div>
								)}

								{item.type === "countdown" && (
									<div className="history-item__time">
										<div>{formatTimeObject(item.timerDuration)}</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default History;
