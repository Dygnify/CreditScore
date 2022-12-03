import axiosHttpService from "../Services/axioscall";
import {
	ethTransactions,
	ethTokenTransactions,
} from "../Services/blockchainTransactionDataOptions";
import { ethers } from "ethers";

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

export async function getAllTransactions(address) {
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

export function getFirstTransactionDateDiff(transactions) {
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

export function getFirstBorrowDateDiff(transactions) {
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

export async function getAllTokenTransactions(address) {
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

export function getAvgAssetBrought(allTrx, tokenTrx, address) {
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

export function getLiquidationCount(transactions) {
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
