export const getEthereumObject = () => {
  return window.ethereum;
};

export const requestAccount = async () => {
  const ethereum = window.ethereum;

  if (!ethereum) {
    alert("MetaMask is not installed");
    return null;
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
};