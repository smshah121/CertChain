import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "0x94a43945a3cb5c8b67dcef84c6e75b8cd4c92553";
const PUBLIC_RPC = "https://eth-sepolia.g.alchemy.com/v2/h7P5dwYkE6ngc2Hudx8Ji";
export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");

 
  

   await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0xaa36a7" }], 
  });
   await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, abi, signer);
};

export const getReadOnlyContract = async () => {
  const provider = new ethers.JsonRpcProvider(PUBLIC_RPC);
  return new ethers.Contract(contractAddress, abi, provider);
};