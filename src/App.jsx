import { useState, useEffect } from "react";
import { getReadOnlyContract } from "./contract/Contract";
import AddCertificate from "./component/AddCertificate";
import VerifyCertificate from "./component/VerifyCertificate";

export default function App() {
  const [page, setPage] = useState("verify");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true); // ← add this

  useEffect(() => {
    const checkOwner = async () => {
      try {
        if (!window.ethereum) return;
        const contract = await getReadOnlyContract();
        const owner = await contract.owner();
        const address = window.ethereum?.selectedAddress;
        
        // ← add these logs
        console.log("Contract owner:", owner);
        console.log("Your address:", address);
        console.log("Is owner:", owner.toLowerCase() === address.toLowerCase());
        
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkOwner();
  }, []);

  // ← wait until owner check is done
  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400 text-sm">Connecting to blockchain...</p>
    </div>
  );

  return (
    <>
      {page === "verify" && (
        <VerifyCertificate
          isOwner={isOwner}
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