
import React, { useState, useRef, useEffect } from 'react';
import { ReportData, INITIAL_DATA, SENARAI_GURU_RASMI } from './types';
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
    const savedReport = localStorage.getItem('skbe_v5_current_report');
    const savedCustomTeachers = localStorage.getItem('skbe_v5_custom_teachers');
    
    // Gabungkan senarai hardcoded dengan sebarang nama tambahan yang pernah didaftar secara manual
    const customList = savedCustomTeachers ? JSON.parse(savedCustomTeachers) : [];
    const masterList = Array.from(new Set([...SENARAI_GURU_RASMI, ...customList])).sort();
    
    const baseReport = savedReport ? JSON.parse(savedReport) : { ...INITIAL_DATA };
    return { ...baseReport, senaraiGuruMaster: masterList };
  });

  const [status, setStatus] = useState<'IDLE' | 'BUSY' | 'SUCCESS' | 'ERROR'>('IDLE');
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('skbe_v5_current_report', JSON.stringify(data));
    // Simpan hanya nama yang TIADA dalam senarai rasmi ke dalam custom_teachers
    const customOnly = data.senaraiGuruMaster.filter(n => !SENARAI_GURU_RASMI.includes(n));
    localStorage.setItem('skbe_v5_custom_teachers', JSON.stringify(customOnly));
  }, [data]);

  const handleUpdate = (newData: Partial<ReportData>) => setData(prev => ({ ...prev, ...newData }));

  const resetBorang = () => {
    setData(prev => ({
      ...INITIAL_DATA,
      senaraiGuruMaster: prev.senaraiGuruMaster, // Kekalkan senarai guru sedia ada
      namaGuru: Array(8).fill(''),
      kehadiranGuru: { hadir: '', tidakHadir: '', senaraiTidakHadir: Array(8).fill('') },
      pelawat: Array(4).fill({ nama: '', urusan: '' })
    }));
    localStorage.removeItem('skbe_v5_current_report');
  };

  const processPDF = async (action: 'download' | 'upload') => {
    const element = captureRef.current;
    if (!element || !window.html2pdf) {
      alert("Sistem penjanaan PDF belum sedia sepenuhnya.");
      return;
    }
    
    setStatus('BUSY');
    window.scrollTo(0, 0);

    const fileName = `LAPORAN_SKBE_M${data.minggu || 'X'}_${data.tarikh || 'HARIAN'}.pdf`;
    
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const worker = window.html2pdf().from(element).set(opt);

      if (action === 'download') {
        await worker.save();
        setStatus('SUCCESS');
        setTimeout(() => setStatus('IDLE'), 3000);
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
        
        setTimeout(() => {
          resetBorang();
          setStatus('IDLE');
          alert("Laporan berjaya dihantar dan borang telah dikosongkan.");
        }, 2000);
      }
    } catch (err) {
      console.error("Ralat PDF:", err);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-64">
      <header className="bg-emerald-900 text-white pt-16 pb-24 px-6 text-center relative">
         <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-full shadow-2xl inline-block mb-6">
              <img src="https://lh3.googleusercontent.com/d/1K-R9lPvaKmrraz-vkACiDNoemOq7qHTW" className="h-16" alt="SKBE Logo" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight">E-Laporan Guru Bertugas</h1>
            <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-2 opacity-80">Portal Laporan Harian SK Bandar Endau</p>
         </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-12 relative">
        <ReportForm data={data} onUpdate={handleUpdate} />

        <div className="mt-12 mb-20 flex justify-center">
            <button 
              onClick={() => { if(confirm("Bersihkan borang? Senarai guru rasmi tidak akan dipadam.")) resetBorang() }}
              className="bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 transition-all border border-red-100 shadow-sm"
            >
              🗑️ Padam & Bersihkan Borang Semasa
            </button>
        </div>

        <div className="mt-20 mb-10">
          <div className="text-center mb-8">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Previu Laporan Rasmi</h2>
          </div>
          <div className="bg-slate-200/50 p-6 md:p-12 rounded-[3rem] shadow-inner flex justify-center border border-slate-200 overflow-hidden">
             <div className="bg-white shadow-2xl origin-top transition-transform scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.95]">
                <PDFTemplate data={data} />
             </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '210mm' }}>
          <div ref={captureRef}>
             <PDFTemplate data={data} />
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-2xl z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
             {status === 'BUSY' && (
               <div className="flex items-center gap-3 text-blue-700">
                 <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                 <span className="font-black text-[11px] uppercase tracking-wider">Memproses...</span>
               </div>
             )}
             {status === 'SUCCESS' && <span className="text-emerald-700 font-black text-[11px] uppercase tracking-wider">Berjaya!</span>}
             {status === 'ERROR' && <span className="text-red-600 font-black text-[11px] uppercase">Ralat!</span>}
             {status === 'IDLE' && (
               <div className="text-slate-400">
                 <p className="font-black text-[9px] uppercase tracking-widest">Semak semula data sebelum hantar</p>
                 <p className="text-[10px] font-medium mt-0.5 italic">Nama guru tersedia secara automatik di semua peranti.</p>
               </div>
             )}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => processPDF('download')} disabled={status === 'BUSY'} className="flex-1 md:flex-none bg-slate-100 text-slate-800 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 disabled:opacity-50 transition-all">Simpan PDF</button>
            <button onClick={() => processPDF('upload')} disabled={status === 'BUSY'} className="flex-1 md:flex-none bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all transform hover:-translate-y-1">Hantar Laporan & Reset</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
