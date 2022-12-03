import axiosHttpService from "../Services/axioscall";
import {
	ethTransactions,
	ethTokenTransactions,
} from "../Services/blockchainTransactionDataOptions";
import { ethers } from "ethers";
import { walletTokenBalances } from "../Services/covalentDataOptions";

const topToken = [
	"BTC",
	"aWBTC",
	"WBTC",
	"ETH",
	"WETH",
	"aETH",
	"aWETH",
	"sETH",
	"aUniLINKETH",
	"aUniETH",
	"USDT",
	"aUSDT",
	"BNB",
	"USDC",
	"aUSDC",
	"aUniUSDC",
	"BUSD",
	"aBUSD",
	"XRP",
	"ADA",
	"MATIC",
	"DOT",
	"DAI",
	"aDAI",
	"aUniDAI",
];
const memTokens = ["DOGE", "SHIB"];

function borrowerFilter(tx) {
	return tx.functionName.toLowerCase().includes("borrow");
}

function nonBorrowerFilter(tx) {
	return tx.functionName.toLowerCase().indexOf("borrow") === -1;
}

function liquidationFilter(tx) {
	return tx.functionName.toLowerCase().includes("liquidation");
}

function getDayDiff(epochTimeStamp) {
	if (epochTimeStamp) {
		let timeDiff = Date.now() / 1000 - epochTimeStamp;
		return timeDiff / (24 * 60 * 60);
	}
}

async function getAllTransactions(address) {
	try {
		if (!address) {
			return;
		}
		let transactionDetails = await axiosHttpService(ethTransactions(address));

		if (
			transactionDetails &&
			transactionDetails.res &&
			transactionDetails.res.result.length > 0
		) {
			return transactionDetails.res.result;
		}
	} catch (error) {
		console.log(error);
	}
}

function getFirstTransactionDateDiff(transactions) {
	try {
		if (!transactions) {
			return;
		}

		// First transaction on the chain from this address
		let timeDiffInDays = getDayDiff(transactions[0].timeStamp);
		console.log("First transaction on the wallet adddress: ", timeDiffInDays);
		return timeDiffInDays;
	} catch (error) {
		console.log(error);
	}
}

function getFirstBorrowDateDiff(transactions) {
	try {
		if (!transactions) {
			return;
		}

		// Borrowed amount
		const borrowTrxs = transactions.filter(borrowerFilter);
		// First borrowing on the chain from this address
		let timeDiffInDays = getDayDiff(borrowTrxs[0].timeStamp);
		console.log("First borrowing on the wallet adddress: ", timeDiffInDays);
		return timeDiffInDays;
	} catch (error) {
		console.log(error);
	}
}

async function getAllTokenTransactions(address) {
	try {
		if (!address) {
			return;
		}
		let transactionDetails = await axiosHttpService(
			ethTokenTransactions(address)
		);

		if (
			transactionDetails &&
			transactionDetails.res &&
			transactionDetails.res.result.length > 0
		) {
			return transactionDetails.res.result;
		}
	} catch (error) {
		console.log(error);
	}
}

function getAvgAssetBrought(allTrx, tokenTrx, address) {
	try {
		if (!allTrx || !tokenTrx || !address) {
			return;
		}

		// filter all transaction for non borrowings
		const nonBorrowTrxs = allTrx.filter(nonBorrowerFilter);
		let counter = 0,
			amount = 0;
		nonBorrowTrxs.forEach((tx) => {
			let transaction = tokenTrx.find(
				(tokenTx) =>
					tokenTx.hash.toLowerCase() === tx.hash.toLowerCase() &&
					tokenTx.to.toLowerCase() === address.toLowerCase()
			);
			if (transaction) {
				let txAmount = ethers.utils.formatUnits(
					transaction.value,
					transaction.tokenDecimal
				);
				amount += +txAmount;
				++counter;
			}
		});

		if (counter > 0) {
			let avgAmount = amount / counter;
			console.log("Avarage asset transaction amount = ", avgAmount);
			return avgAmount;
		}
	} catch (error) {
		console.log(error);
	}
}

function getLiquidationCount(transactions) {
	try {
		if (!transactions) {
			return;
		}

		// Borrowed amount
		const liquidationTrxs = transactions.filter(liquidationFilter);
		// First borrowing on the chain from this address
		console.log("Liquidation count: ", liquidationTrxs.length);
		return liquidationTrxs.length;
	} catch (error) {
		console.log(error);
	}
}

async function getAllTokenBalances(address) {
	try {
		if (!address) {
			return;
		}
		let transactionDetails = await axiosHttpService(
			walletTokenBalances(address)
		);
		if (
			transactionDetails &&
			transactionDetails.res &&
			transactionDetails.res.data.items.length > 0
		) {
			let goodTokenAmt = 0;
			let totalTokenAmt = 0;
			let memeTokenCount = 0;
			transactionDetails.res.data.items.forEach((trx) => {
				let found = topToken.find(
					(symbol) =>
						symbol.toLowerCase() === trx.contract_ticker_symbol?.toLowerCase()
				);
				if (trx.balance && trx.balance !== "0" && trx.contract_decimals !== 0) {
					let txAmount = ethers.utils.formatUnits(
						trx.balance,
						trx.contract_decimals
					);
					totalTokenAmt += +txAmount;
					if (found) {
						goodTokenAmt += +txAmount;
					}
				}

				// check for meme token

				let memFound = memTokens.find(
					(symbol) =>
						symbol.toLowerCase() === trx.contract_ticker_symbol?.toLowerCase()
				);
				if (memFound) {
					++memeTokenCount;
				}
			});

			if (totalTokenAmt > 0) {
				let goodTokenBal = (goodTokenAmt * 100) / totalTokenAmt;
				return { goodTokenBal, memeTokenCount };
			}
		}
	} catch (error) {
		console.log(error);
	}
}

export async function getCreditScore(address) {
	const trx = await getAllTransactions(address);
	let ageInDays = getFirstTransactionDateDiff(trx);
	let avgAgeScore = 0;
	if (ageInDays < 180) {
		avgAgeScore = 0.15 * 300;
	} else if (ageInDays >= 180 && ageInDays <= 365) {
		avgAgeScore = 0.15 * 650;
	} else {
		avgAgeScore = 0.15 * 900;
	}

	let firstBorrowInDays = getFirstBorrowDateDiff(trx);
	let firstBorrowAgeScore = 0;
	if (firstBorrowInDays < 180) {
		firstBorrowAgeScore = 0.15 * 300;
	} else if (firstBorrowInDays >= 180 && firstBorrowInDays <= 365) {
		firstBorrowAgeScore = 0.15 * 650;
	} else {
		firstBorrowAgeScore = 0.15 * 900;
	}

	const tokenTrx = await getAllTokenTransactions(address);
	let assetAmt = getAvgAssetBrought(trx, tokenTrx, address);
	let assetAmtScore = 0;
	if (assetAmt < 1000) {
		assetAmtScore = 0.15 * 300;
	} else if (assetAmt >= 1000 && assetAmt <= 10000) {
		assetAmtScore = 0.15 * 650;
	} else {
		assetAmtScore = 0.15 * 900;
	}

	let { goodTokenBal, memeTokenCount } = await getAllTokenBalances(address);
	let goodTokenScore = 0;
	let memeTokenScore = 0;
	if (goodTokenBal < 50) {
		goodTokenScore = 0.15 * 300;
	} else if (goodTokenBal >= 50 && goodTokenBal <= 70) {
		goodTokenScore = 0.15 * 650;
	} else {
		goodTokenScore = 0.15 * 900;
	}
	if (memeTokenCount > 0) {
		memeTokenScore = 0.3 * 300;
	} else {
		memeTokenScore = 0.3 * 900;
	}

	let liquidationNo = getLiquidationCount(trx);
	let liquidationScore = 0;
	if (liquidationNo > 0) {
		liquidationScore = 0.3 * 300;
	} else {
		liquidationScore = 0.3 * 900;
	}

	return (
		avgAgeScore +
		firstBorrowAgeScore +
		assetAmtScore +
		goodTokenScore +
		memeTokenScore +
		liquidationScore
	);
}

export const isConnected = async () => {
	try {
		if (window.ethereum) {
			let chainId = window.ethereum.chainId;
			if (chainId !== "0x13881") {
				const temp = await window.provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x13881" }], // chainId must be in hexadecimal numbers
				});
			}
			if (chainId === "0x13881") {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const account = await provider.send("eth_requestAccounts", []);
				return {
					success: true,
				};
			}
		} else {
			localStorage.setItem("Wallet-Check", false);
			return {
				success: false,
				msg: "Please Install Wallet",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: "Please Open Metamask and Connect",
		};
	}
};

export const requestAccount = async (metaMask) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			let provider = window.ethereum;
			// edge case if MM and CBW are both installed
			if (window.ethereum.providers?.length) {
				window.ethereum.providers.forEach(async (p) => {
					if (metaMask === true) {
						if (p.isMetaMask) provider = p;
					} else {
						if (p.isCoinbaseWallet) {
							provider = p;
						}
					}
				});
			}
			await provider.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0x13881" }], // chainId must be in hexadecimal numbers
			});
			await provider.request({
				method: "eth_requestAccounts",
				params: [],
			});

			return { success: true };
		} else {
			return {
				success: false,
				msg: "please connect your wallet",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};
