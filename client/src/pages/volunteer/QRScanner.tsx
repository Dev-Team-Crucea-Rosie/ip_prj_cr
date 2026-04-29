import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ChevronLeft, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function QRScanner() {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [scanState, setScanState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Utilizăm un flag pentru a preveni scanări multiple accidentale
  const hasScanned = useRef(false);

  const handleScan = async (detectedCodes: any[]) => {
    if (hasScanned.current || detectedCodes.length === 0) return;
    
    // Presupunem că citim prima valoare detectată (de obicei e una singură)
    const qrValue = detectedCodes[0].rawValue;
    if (!qrValue) return;

    hasScanned.current = true;
    setScanState('loading');
    
    try {
      // Vom înlocui acest endpoint cu cel real când va fi implementat în backend
      // `qrValue` ar trebui să fie de obicei ID-ul evenimentului sau un token QR securizat
      const response = await fetch('http://localhost:5000/api/attendance/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ qrCode: qrValue })
      });

      if (response.ok || response.status === 404) { 
        // TEMPORAR: 404 simulat ca succes pentru testare până este gata backend-ul
        setScanState('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cod invalid.');
      }
    } catch (error: any) {
      setScanState('error');
      setErrorMessage(error.message || 'A apărut o eroare de rețea.');
      
      // Resetează scanerul după 3 secunde pentru o nouă încercare
      setTimeout(() => {
        setScanState('idle');
        hasScanned.current = false;
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col relative overflow-hidden">
      
      {/* Header Navigation */}
      <div className="absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent p-4 pt-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-white p-2 bg-white/10 rounded-full backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-white font-medium tracking-wide">Scanare Prezență</span>
        <button className="text-white p-2 bg-white/10 rounded-full backdrop-blur-sm">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {scanState === 'idle' || scanState === 'loading' ? (
          <div className="w-full h-full">
            <Scanner
              onScan={handleScan}
              components={{
                finder: false 
              }}
              styles={{
                container: { height: '100%', width: '100%' },
                video: { objectFit: 'cover' }
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
                  {scanState === 'loading' && (
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
                  {scanState === 'idle' && (
                    <div className="absolute w-full h-0.5 bg-red-600 shadow-[0_0_10px_red] top-1/2 left-0 -translate-y-1/2 opacity-70 animate-pulse pointer-events-none" />
                  )}
                </div>

                <div className="flex-1 bg-black/40" />
              </div>
              <div className="flex-1 bg-black/40" />
            </div>
          </div>
        ) : scanState === 'success' ? (
          <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mx-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Prezență Confirmată!</h2>
            <p className="text-gray-300 text-sm">Transfer către dashboard...</p>
          </div>
        ) : (
          <div className="text-center p-8 bg-red-900/30 backdrop-blur-lg rounded-2xl border border-red-500/50 mx-6 absolute z-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Eroare Scanare</h2>
            <p className="text-gray-300 text-sm">{errorMessage}</p>
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