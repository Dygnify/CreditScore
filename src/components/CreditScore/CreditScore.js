import React, { useState, useEffect, useRef } from "react";
import Score from "../ScoreMeter/Score";
import "./creditScore.css";
import { requestAccount, getCreditScore } from "../../Helper/DataPoints";
import { _fetchData } from "ethers/lib/utils";

const CreditScore = ({ setProcess }) => {
	const [isBtnActive1, setIsBtnActive1] = useState(false);
	const [isBtnActive2, setIsBtnActive2] = useState(false);
	const [offlineScoreReceived, setOfflineScoreReceived] = useState(false);
	const [onlineScoreReceived, setOnlineScoreReceived] = useState(false);
	const [onlineScore, setOnlineScore] = useState();
	const [finalScore, setFinalScore] = useState();
	const [showWeightage, setShowWeightage] = useState(10);
	const selectPercentage = useRef(10);

	function receivedOfflineScore() {
		setProcess(false);
		setOfflineScoreReceived(true);
		setIsBtnActive2(true);
	}
	function getOfflineScore() {
		setProcess(true);
		setTimeout(receivedOfflineScore, 5000);
	}
	async function ConnectWallet() {
		await requestAccount();
		setProcess(true);
		let score = await getCreditScore(
			"0xdad4c11e8cc6a5c37808d3b31b3b284809f702d1"
		);
		setOnlineScoreReceived(true);
		setOnlineScore(score);
		setProcess(false);
	}
	function getFinalScore() {
		setShowWeightage(selectPercentage.current.value);
		setFinalScore(
			(+selectPercentage.current.value * 738) / 100 +
				((100 - +selectPercentage.current.value) * onlineScore) / 100
		);
	}
	return (
		<div className="main-box">
			<h1>Credit Score</h1>
			<div className="chain">
				<p>Off-chain Credit Score</p>
				{!offlineScoreReceived ? (
					<div className="box">
						<div className="btn-box">
							<button
								className={isBtnActive1 ? "btn-active" : "btn-deactive"}
								disabled={!isBtnActive1}
								onClick={getOfflineScore}
							>
								Fetch my credit bureau score
							</button>
						</div>
						<div className={true ? "agree-p" : "agree-p-deactive"}>
							<input
								type="checkbox"
								onChange={() => {
									setIsBtnActive1((pre) => !pre);
								}}
								checked={isBtnActive1}
							/>
							<p>
								I agree to submit my KYC Details to fetch my credit bureau score
							</p>
						</div>
					</div>
				) : (
					<div className="score">
						<div className="dataBox">
							<Score score={738} />
							<h3>Score = 738</h3>
						</div>
						<div className="dataBox">
							<h3>Summary of Credit History</h3>
							<div className="data">
								<div>
									<p>Active Loan Accounts</p>
									<p>Total Credit Outstanding </p>
									<p>Overdue Payments</p>
									<p>Average Days Past Due </p>
									<p>Enquiries in last 6 months</p>
								</div>
								<div>
									<p>2</p>
									<p>10K</p>
									<p>0</p>
									<p>0</p>
									<p>2</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="chain">
				<p>On-chain Credit Score</p>
				{!onlineScoreReceived ? (
					<div className="box">
						<div className="btn-box">
							<button
								className={isBtnActive2 ? "btn-active" : "btn-deactive"}
								disabled={!isBtnActive2}
								onClick={ConnectWallet}
							>
								Connect Wallet and Fetch my credit bureau score
							</button>
						</div>
					</div>
				) : (
					<div className="score">
						<div className="dataBox">
							<Score score={onlineScore ? onlineScore : 0} />
							<h3>Score = {onlineScore}</h3>
						</div>
						<div className="dataBox">
							<h3>Summary of Wallet History </h3>
							<div className="data">
								<div>
									<p>Average age of Wallet</p>
									<p>Length of Credit History </p>
									<p>Average Size of Assets </p>
									<p>History of Liquidation </p>
								</div>
								<div>
									<p>920 Days</p>
									<p>450 Days</p>
									<p>$2000</p>
									<p>2 times </p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{onlineScoreReceived ? (
				<div className="chain">
					<p>Overall Credit Score </p>
					<div className="overall">
						<div className="overallData">
							<div className="scoremeter">
								<Score score={738} />
								<div className="selectionbox-selection">
									<select
										name="cars"
										id="cars"
										ref={selectPercentage}
										onChange={getFinalScore}
									>
										<option value="10">10</option>
										<option value="20">20</option>
										<option value="30">30</option>
										<option value="40">40</option>
										<option value="50">50</option>
										<option value="60">60</option>
										<option value="70">70</option>
										<option value="80">80</option>
										<option value="90">90</option>
										<option value="100">100</option>
									</select>
									<div className="weightage">
										<h2>{showWeightage}% of 738</h2>
										<p>Weightage</p>
									</div>
								</div>
							</div>
							<svg
								width="13"
								height="12"
								viewBox="0 0 13 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.861875 7.096V4.96H5.39788V0.711999H7.60588V4.96H12.1419V7.096H7.60588V11.368H5.39788V7.096H0.861875Z"
									fill="#323A46"
								/>
							</svg>
							<div className="scoremeter">
								<Score score={onlineScore} />

								<h2>
									{100 - +showWeightage}% of {onlineScore}
								</h2>
								<p>Weightage</p>
							</div>
							<svg
								width="11"
								height="8"
								viewBox="0 0 11 8"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.553844 2.552V0.343999H10.4178V2.552H0.553844ZM0.553844 7.712V5.504H10.4178V7.712H0.553844Z"
									fill="#323A46"
								/>
							</svg>

							<div className="scoremeter">
								<Score score={finalScore} />

								<h1>{finalScore}</h1>
								<p>Overall Score </p>
							</div>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default CreditScore;
