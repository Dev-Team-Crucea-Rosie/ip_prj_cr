import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  ChevronLeft,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function QRScanner() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [scanState, setScanState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Utilizăm un flag pentru a preveni scanări multiple accidentale
  const hasScanned = useRef(false);

  const handleScan = async (detectedCodes: any[]) => {
    if (hasScanned.current || detectedCodes.length === 0) return;

    // Presupunem că citim prima valoare detectată (de obicei e una singură)
    const qrValue = detectedCodes[0].rawValue;
    if (!qrValue) return;

    hasScanned.current = true;
    setScanState("loading");

    try {
      // Vom înlocui acest endpoint cu cel real când va fi implementat în backend
      // `qrValue` ar trebui să fie de obicei ID-ul evenimentului sau un token QR securizat
      const response = await fetch("http://localhost:5000/events/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrCode: qrValue }),
      });

      if (response.ok) {
        setScanState("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        // Dacă codul a fost deja scanat (din teste anterioare), îl considerăm un success vizual
        if (errorData.message === "Ai scanat deja acest cod.") {
          setScanState("success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2500);
          return;
        }

        throw new Error(
          errorData.message ||
            "Eroare la scanarea codului QR (Răspuns invalid de la server).",
        );
      }
    } catch (error: any) {
      setScanState("error");
      setErrorMessage(error.message || "A apărut o eroare de rețea.");

      // Resetează scanerul după 3 secunde pentru o nouă încercare
      setTimeout(() => {
        setScanState("idle");
        hasScanned.current = false;
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col relative overflow-hidden">
      {/* Header Navigation */}
      <div className="absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent p-4 pt-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white p-2 bg-white/10 rounded-full backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-white font-medium tracking-wide">
          Scanare Prezență
        </span>
        <button className="text-white p-2 bg-white/10 rounded-full backdrop-blur-sm">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {scanState === "idle" || scanState === "loading" ? (
          <div className="w-full h-full">
            <Scanner
              onScan={handleScan}
              components={{
                finder: false,
              }}
              styles={{
                container: { height: "100%", width: "100%" },
                video: { objectFit: "cover" },
              }}
              allowMultiple={false}
            />

            {/* Visual Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col">
              <div className="flex-1 bg-black/40" />
              <div className="flex relative">
                <div className="flex-1 bg-black/40" />

                {/* Frame box */}
                <div className="w-[70vw] max-w-sm aspect-square relative box-border">
                  {scanState === "loading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                    </div>
                  )}
                  {/* Corner marks */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />

                  {/* Scanning animation line */}
                  {scanState === "idle" && (
                    <div className="pointer-events-none absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 animate-pulse bg-[var(--crr-red)] opacity-80 shadow-[0_0_12px_rgba(245,51,63,0.9)]" />
                  )}
                </div>

                <div className="flex-1 bg-black/40" />
              </div>
              <div className="flex-1 bg-black/40" />
            </div>
          </div>
        ) : scanState === "success" ? (
          <div className="mx-6 rounded-2xl border border-[var(--crr-red)] bg-white/15 p-8 text-center backdrop-blur-lg">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-[var(--crr-red)]" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Prezență Confirmată!
            </h2>
            <p className="text-sm text-white/85">Transfer către dashboard...</p>
          </div>
        ) : (
          <div className="absolute z-20 mx-6 rounded-2xl border border-[var(--crr-red)] bg-[var(--crr-accent)] p-8 text-center backdrop-blur-lg">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-[var(--crr-red)]" />
            <h2 className="text-xl font-bold text-white mb-2">
              Eroare Scanare
            </h2>
            <p className="text-sm text-white/85">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* Bottom Instruction */}
      <div className="absolute bottom-0 w-full p-8 text-center bg-gradient-to-t from-black to-transparent z-10">
        <p className="text-white/80 text-sm font-medium tracking-wide">
          Încadrează codul QR în chenar
        </p>
      </div>
    </div>
  );
}
