export const totalTransactions = (address) => {
	if (!address) {
		return null;
	}
	console.log("Fetching all transactions for address");
	var api_options = {
		method: "get",
		url: `https://api.covalenthq.com/v1/1/address/${address}/transactions_v2/?key=${process.env.REACT_APP_COVALENT_APIKEY}`,
	};
	return api_options;
};

export const tokenTransactions = (address, contractAddress) => {
	if (!address || !contractAddress) {
		return null;
	}
	console.log("Fetching token transactions for address");
	var api_options = {
		method: "get",
		url: `https://api.covalenthq.com/v1/1/address/${address}/transfers_v2/?contract-address=${contractAddress}&key=${process.env.REACT_APP_COVALENT_APIKEY}`,
	};

	return api_options;
};

export const walletTokenBalances = (address) => {
	if (!address) {
		return null;
	}
	console.log("Fetching all token balance for address");
	var api_options = {
		method: "get",
		url: `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENT_APIKEY}`,
	};

	return api_options;
};
