import { useState } from "react";
import { getReadOnlyContract } from "../contract/Contract";

export default function VerifyCertificate({ onSwitch, isOwner, wallet, connecting, onConnect }) {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);

  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const verify = async () => {
    if (!certId.trim()) return;
    setStatus("loading");
    setResult(null);
    try {
      const contract = await getReadOnlyContract();
      const exists = await contract.verifyCertificate(certId.trim());

      if (!exists) {
        setStatus("notfound");
        return;
      }

      const data = await contract.getCertificate(certId.trim());
      const date = new Date(Number(data.timestamp) * 1000).toLocaleString();

      setResult({
        name: data.studentName,
        course: data.course,
        certId: data.certId,
        timestamp: date,
        hash: data.hash,
      });
      setStatus("found");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight">CertChain</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Issue Certificate button — only if owner */}
          {isOwner && (
            <button
              onClick={onSwitch}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Issue Certificate
            </button>
          )}

          {/* Connect Wallet button */}
          {!wallet ? (
            <button
              onClick={onConnect}
              disabled={connecting}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-all disabled:opacity-50"
            >
              {connecting ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" />
                </svg>
              )}
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isOwner ? "bg-emerald-400" : "bg-slate-400"}`} />
              <span className="text-xs text-slate-300 font-mono">{shortAddress(wallet)}</span>
              {isOwner && <span className="text-xs text-emerald-400 font-medium">Owner</span>}
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Verify Certificate</h1>
            <p className="text-slate-500 text-sm">Check authenticity of any certificate on the blockchain</p>
          </div>

          {/* Search Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex gap-3">
              <input
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verify()}
                placeholder="Enter certificate ID"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
              <button
                onClick={verify}
                disabled={status === "loading"}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm flex items-center gap-2 whitespace-nowrap"
              >
                {status === "loading" ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                )}
                {status === "loading" ? "Checking..." : "Verify"}
              </button>
            </div>
          </div>

          {/* Valid Result */}
          {status === "found" && result && (
            <div className="mt-4 border border-emerald-500/30 bg-slate-900 rounded-2xl overflow-hidden">
              <div className="bg-emerald-500/10 px-6 py-4 flex items-center gap-2 border-b border-emerald-500/20">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-emerald-400 font-semibold text-sm">Valid Certificate</span>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Student Name</p>
                  <p className="text-sm text-slate-200 font-medium">{result.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Course</p>
                  <p className="text-sm text-slate-200 font-medium">{result.course}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Certificate ID</p>
                  <p className="text-sm text-slate-200 font-medium">{result.certId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Issued On</p>
                  <p className="text-sm text-slate-200 font-medium">{result.timestamp}</p>
                </div>
              </div>
              <div className="px-6 pb-5 pt-0 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-1.5 mt-4">Blockchain Hash</p>
                <p className="text-xs font-mono text-slate-400 break-all">{result.hash}</p>
              </div>
            </div>
          )}

          {/* Not Found */}
          {status === "notfound" && (
            <div className="mt-4 border border-red-500/30 bg-red-500/5 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-semibold text-sm">Certificate Not Found</p>
                <p className="text-slate-500 text-xs mt-1">This ID does not exist on the blockchain.</p>
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="mt-4 border border-amber-500/30 bg-amber-500/5 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-400 font-semibold text-sm">Connection Error</p>
                <p className="text-slate-500 text-xs mt-1">Could not connect to blockchain. Check MetaMask.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}