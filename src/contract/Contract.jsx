import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "0x8739cE0C20C9207F4B4a0aCcA852332d50B2CEF4";
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