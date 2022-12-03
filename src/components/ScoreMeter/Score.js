import React from "react";
import "./score.css";

const Score = ({ score }) => {
	const scorepercentage = score / 10;

	return (
		<div
			className="semi-donut-model-2 margin"
			style={{
				"--percentage": scorepercentage,
				"--fill": " #4B74FF",
			}}
		>
			{/* {score} */}
		</div>
	);
};

export default Score;
