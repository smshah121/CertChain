import { useState } from "react";
import { getContract } from "../contract/Contract";

function AddCertificate({ onSwitch }) {
  const [certId, setCertId] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState(null);
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async () => {
    if (!certId || !name || !course) return;
    setStatus("loading");
    try {
      const contract = await getContract();
      const tx = await contract.addCertificate(certId, name, course);
      await tx.wait();
      setTxHash(tx.hash);
      setStatus("success");
      setCertId("");
      setName("");
      setCourse("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">


      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight">CertChain</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Admin</span>
        </div>

        <button
          onClick={onSwitch}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-all"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Go to Verify
        </button>
      </header>


      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Issue Certificate</h1>
            <p className="text-slate-500 text-sm">Add a new certificate permanently to the blockchain</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Certificate ID</label>
              <input
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. CERT-2024-001"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Student Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Course</label>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Blockchain Development"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 mt-2"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Confirm in MetaMask...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Issue Certificate
                </>
              )}
            </button>

            {status === "success" && (
              <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-emerald-400 font-semibold text-sm">Certificate issued successfully</p>
                </div>
                {txHash && (
                  <p className="text-xs font-mono text-slate-500 break-all pl-6">Tx: {txHash}</p>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-red-400 text-sm">Transaction failed. Make sure you are the contract owner.</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default AddCertificate;