import React, { useEffect, useState } from "react";
import "../css/History.css";

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
								<div className="history-item__type">{item.type}</div>
								<div className="history-item__date">{new Date(item.date).toLocaleString()}</div>

								<div className="history-item__label">{item.label}</div>
								<div className="history-item__notes">{item.notes}</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default History;
