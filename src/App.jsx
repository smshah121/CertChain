import { useState } from "react";
import { ethers } from "ethers";
import { getReadOnlyContract } from "./contract/Contract";
import AddCertificate from "./component/AddCertificate";
import VerifyCertificate from "./component/VerifyCertificate";

export default function App() {
  const [page, setPage] = useState("verify");
  const [isOwner, setIsOwner] = useState(false);
  const [wallet, setWallet] = useState("");
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
  setConnecting(true);

  try {
    if (!window.ethereum) {
      alert("Please open this site in MetaMask app browser");
      setConnecting(false);
      return;
    }

    // request wallet connection
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // switch network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const contract = await getReadOnlyContract();
    const owner = await contract.owner();

    setWallet(address);
    setIsOwner(owner.toLowerCase() === address.toLowerCase());

  } catch (err) {
    console.error(err);
  }

  setConnecting(false);
};

  return (
    <>
      {page === "verify" && (
        <VerifyCertificate
          isOwner={isOwner}
          wallet={wallet}
          connecting={connecting}
          onConnect={connectWallet}
          onSwitch={() => setPage("add")}
        />
      )}
      {page === "add" && isOwner && (
        <AddCertificate
          onSwitch={() => setPage("verify")}
        />
      )}
    </>
  );
}