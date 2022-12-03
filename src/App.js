import logo from "./logo.svg";
import "./App.css";
import { useRef, useState } from "react";
import {
	getAllTransactions,
	getFirstTransactionDateDiff,
	getFirstBorrowDateDiff,
	getAllTokenTransactions,
	getAvgAssetBrought,
	getLiquidationCount,
} from "./Helper/DataPoints";
function App() {
	const name = useRef();
	const [transactions, setTransactions] = useState([]);
	const [tokenTransactions, setTokenTransactions] = useState([]);

	async function getAddress() {
		if (name.current.value) {
			console.log("Wallet address: ", name.current.value);
		}
		const trx = await getAllTransactions(name.current.value);
		setTransactions(trx);
		getFirstTransactionDateDiff(trx);
		getFirstBorrowDateDiff(trx);
		const tokenTrx = await getAllTokenTransactions(name.current.value);
		setTokenTransactions(tokenTrx);
		getAvgAssetBrought(trx, tokenTrx, name.current.value);
		getLiquidationCount(trx);
	}
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<input type="text" name="walletAddress" ref={name}></input>
				<button onClick={getAddress}>Click Me</button>
			</header>
		</div>
	);
}

export default App;
