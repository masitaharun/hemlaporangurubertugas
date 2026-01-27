import React, { useState, useRef, useEffect } from 'react';
import { ReportData, INITIAL_DATA } from './types';
import ReportForm from './components/ReportForm';
import PDFTemplate from './components/PDFTemplate';

declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyS48qCtS7ZuNWUYMz30sO2NSNPqxUa6IQbOlHc2crA2cvNmCc8-NPg-NSQUYqhWWtZ/exec";

  const [data, setData] = useState<ReportData>(() => {
    const savedMaster = localStorage.getItem('skbe_v4_master');
    const savedReport = localStorage.getItem('skbe_v4_report');
    const base = savedReport ? JSON.parse(savedReport) : INITIAL_DATA;
    return { ...base, senaraiGuruMaster: savedMaster ? JSON.parse(savedMaster) : [] };
  });

  const [status, setStatus] = useState<'IDLE' | 'BUSY' | 'SUCCESS' | 'ERROR'>('IDLE');
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('skbe_v4_master', JSON.stringify(data.senaraiGuruMaster));
    localStorage.setItem('skbe_v4_report', JSON.stringify(data));
  }, [data]);

  const handleUpdate = (newData: Partial<ReportData>) => setData(prev => ({ ...prev, ...newData }));

  const processPDF = async (action: 'download' | 'upload') => {
    const element = captureRef.current;
    if (!element || !window.html2pdf) {
      alert("Sistem PDF belum sedia.");
      return;
    }
    
    setStatus('BUSY');

    // Scroll ke atas untuk memastikan html2canvas tidak terganggu dengan posisi scroll
    window.scrollTo(0, 0);

    const fileName = `LAPORAN_SKBE_M${data.minggu || 'X'}_${data.tarikh || 'HARIAN'}.pdf`;
    
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Tunggu render selesai
      await new Promise(resolve => setTimeout(resolve, 800));

      const worker = window.html2pdf().from(element).set(opt);

      if (action === 'download') {
        await worker.save();
        setStatus('SUCCESS');
      } else {
        const pdfBase64 = await worker.outputPdf('datauristring');
        const b64 = pdfBase64.split(',')[1];

        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: b64, filename: fileName })
        });
        setStatus('SUCCESS');
      }
      setTimeout(() => setStatus('IDLE'), 3000);
    } catch (err) {
      console.error("PDF Error:", err);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-64">
      {/* Header UI */}
      <header className="bg-emerald-900 text-white pt-16 pb-20 px-6 text-center shadow-lg relative overflow-hidden">
         <div className="max-w-4xl mx-auto relative z-10">
            <div className="bg-white inline-block p-3 rounded-3xl shadow-xl mb-6">
              <img src="https://lh3.googleusercontent.com/d/1K-R9lPvaKmrraz-vkACiDNoemOq7qHTW" className="h-20" alt="Logo" />
            </div>
            <h1 className="text-4xl font-black tracking-tight uppercase leading-tight">E-Laporan Guru Bertugas</h1>
            <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mt-3 opacity-90">SK Bandar Endau • Sistem Laporan Harian</p>
         </div>
         {/* Decorative Circle */}
         <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-800 rounded-full opacity-20 blur-3xl"></div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <ReportForm data={data} onUpdate={handleUpdate} />

        {/* Real-time Preview */}
        <div className="mt-16 mb-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px bg-slate-300 w-20"></div>
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Previu Laporan Rasmi</h2>
            <div className="h-px bg-slate-300 w-20"></div>
          </div>
          
          <div className="bg-slate-200 p-4 md:p-12 rounded-[2.5rem] shadow-inner flex justify-center border-2 border-slate-300 overflow-hidden">
            <div className="bg-white shadow-2xl origin-top transition-transform duration-300 transform scale-[0.4] sm:scale-[0.55] md:scale-[0.75] lg:scale-[0.9]">
              <PDFTemplate data={data} />
            </div>
          </div>
        </div>

        {/* CAPTURE ZONE - Tetap dalam DOM tetapi diluar pandangan mata */}
        <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '210mm', overflow: 'hidden', background: 'white' }}>
          <div ref={captureRef} style={{ width: '210mm' }}>
             <PDFTemplate data={data} />
          </div>
        </div>
      </main>

      {/* Floating Control Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 text-center md:text-left">
             {status === 'BUSY' && (
               <div className="flex items-center justify-center md:justify-start gap-2">
                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                 <span className="text-blue-700 font-black text-[10px] uppercase">Menjana Dokumen...</span>
               </div>
             )}
             {status === 'SUCCESS' && (
               <div className="flex items-center justify-center md:justify-start gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                 <span className="text-emerald-700 font-black text-[10px] uppercase">Berjaya Disimpan!</span>
               </div>
             )}
             {status === 'ERROR' && <span className="text-red-600 font-black text-[10px] uppercase">Ralat Sistem PDF!</span>}
             {status === 'IDLE' && <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Semak previu sebelum jana fail</span>}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => processPDF('download')} 
              disabled={status === 'BUSY'} 
              className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg"
            >
              Simpan PDF (Manual)
            </button>
            <button 
              onClick={() => processPDF('upload')} 
              disabled={status === 'BUSY'} 
              className="flex-1 md:flex-none bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-xl shadow-emerald-200/50 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition-all border-b-4 border-emerald-800"
            >
              Hantar ke Cloud Drive
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;