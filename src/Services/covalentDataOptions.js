export const ethTransactions = (address) => {
	if (!address) {
		return null;
	}
	console.log("Fetching transactions for address - ", address);
	var api_options = {
		method: "get",
		url: `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_POLYGONSCAN_APIKEY}`,
	};

	return api_options;
};

export const ethTokenTransactions = (address) => {
	if (!address) {
		return null;
	}
	console.log("Fetching transactions for address - ", address);
	var api_options = {
		method: "get",
		url: `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_POLYGONSCAN_APIKEY}`,
	};

	return api_options;
};
