import React from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
}

const PDFTemplate: React.FC<Props> = ({ data }) => {
  // Logo URL dengan caching bypass untuk CORS yang lebih baik
  const LOGO_URL = "https://lh3.googleusercontent.com/d/1K-R9lPvaKmrraz-vkACiDNoemOq7qHTW";

  return (
    <div id="pdf-content" className="bg-white text-black p-[12mm] min-h-[297mm] w-[210mm] shadow-none mx-auto leading-tight text-[10pt] font-sans border border-transparent">
      {/* Header */}
      <div className="text-center mb-6">
        <img 
          src={LOGO_URL} 
          className="h-20 mx-auto mb-2" 
          alt="Logo" 
          crossOrigin="anonymous" 
        />
        <h1 className="text-[12pt] font-bold uppercase" style={{ display: 'block' }}>Sekolah Kebangsaan Bandar Endau</h1>
        <h2 className="text-[11pt] font-bold uppercase" style={{ display: 'block' }}>Laporan Guru Bertugas Harian 2026</h2>
      </div>

      {/* Info Bar */}
      <div className="flex justify-between mb-4 font-bold border-b border-black pb-2">
        <div className="w-1/3 text-left">Minggu: <span className="font-normal underline decoration-dotted">{data.minggu || '....'}</span></div>
        <div className="w-1/3 text-center">Tarikh: <span className="font-normal underline decoration-dotted">{data.tarikh || '....'}</span></div>
        <div className="w-1/3 text-right">Hari: <span className="font-normal underline decoration-dotted">{data.hari || '....'}</span></div>
      </div>

      {/* Nama Guru - Menggunakan Flex instead of Grid for better PDF rendering */}
      <div className="mb-4">
        <div className="flex flex-wrap">
          {data.namaGuru.map((n, i) => (
            <div key={i} className="w-1/2 flex items-end mb-1 pr-4">
              <span className="text-[8pt] font-bold whitespace-nowrap mr-1">{i+1}. Guru Bertugas:</span>
              <span className="flex-1 border-b border-dotted border-black uppercase font-bold text-[8pt] min-h-[14pt] leading-none">
                {n || ' '}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table Main Content */}
      <table className="w-full border-collapse border border-black mb-4">
        <tbody>
          {/* Perhimpunan */}
          <tr>
            <td className="border border-black p-2 w-[130px] font-bold uppercase align-top text-[8pt] bg-gray-50">Perhimpunan / Aktiviti Pagi</td>
            <td className="border border-black p-2 align-top">
              <div className="font-bold text-[8pt] mb-1">Guru Yang Berucap & Isi Utama Ucapan:</div>
              <div className="min-h-[50px] whitespace-pre-wrap text-[9pt] border-b border-gray-100 pb-2 mb-2">{data.perhimpunan.isiUtama || '-'}</div>
              <div className="font-bold text-[8pt] mb-1">Komen Perjalanan:</div>
              <div className="text-[9pt] italic">{data.perhimpunan.komen || '-'}</div>
            </td>
          </tr>

          {/* Kantin */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Kantin Sekolah</td>
            <td className="border border-black p-2">
              <div className="mb-1">
                Kebersihan: <strong>{data.kantin.kebersihan}</strong> | Komen: <span className="italic">{data.kantin.komenKebersihan || '-'}</span>
              </div>
              <div>
                Kualiti: <strong>{data.kantin.kualiti}</strong> | Komen: <span className="italic">{data.kantin.komenKualiti || '-'}</span>
              </div>
            </td>
          </tr>

          {/* Tandas & Persekitaran */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Tandas & Persekitaran</td>
            <td className="border border-black p-2">
              <div className="mb-1">Tandas: <strong>{data.tandas.tahap}</strong> | <span className="italic">{data.tandas.komen || '-'}</span></div>
              <div>Persekitaran: <strong>{data.persekitaran.tahap}</strong> | <span className="italic">{data.persekitaran.komen || '-'}</span></div>
            </td>
          </tr>

          {/* Statistik */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Statistik Murid</td>
            <td className="border border-black p-2">
              <div className="flex">
                <div className="mr-10">Bil. Lewat: <strong>{data.statistikMurid.lewat || '0'}</strong></div>
                <div>Klinik/Balik Awal: <strong>{data.statistikMurid.klinik || '0'}</strong></div>
              </div>
            </td>
          </tr>

          {/* 3K Sections */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Program 3K</td>
            <td className="border border-black p-2 text-[9pt]">
              <div className="flex flex-col">
                <div className="mb-1">🛡️ Keselamatan: <strong>{data.tigaK.keselamatan.tahap}</strong> | <span className="italic">{data.tigaK.keselamatan.komen}</span></div>
                <div className="mb-1">🏥 Kesihatan: <strong>{data.tigaK.kesihatan.tahap}</strong> | <span className="italic">{data.tigaK.kesihatan.komen}</span></div>
                <div>🧹 Kebersihan: <strong>{data.tigaK.kebersihan.tahap}</strong> | <span className="italic">{data.tigaK.kebersihan.komen}</span></div>
              </div>
            </td>
          </tr>

          {/* Disiplin */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Disiplin Pelajar</td>
            <td className="border border-black p-2 text-[9pt]">
              <div className="mb-1">Tahap: <strong>{data.disiplin.tahap}</strong> | Komen: <span className="italic">{data.disiplin.komen}</span></div>
              <div className="font-bold border-t border-gray-200 pt-1">Kes Serius: <span className="font-normal">{data.disiplin.kesSerius || 'Tiada'}</span></div>
            </td>
          </tr>

          {/* Kehadiran Guru */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Kehadiran Guru</td>
            <td className="border border-black p-2 text-[9pt]">
              <div className="font-bold mb-1 underline">Hadir: {data.kehadiranGuru.hadir} | Tidak Hadir: {data.kehadiranGuru.tidakHadir}</div>
              <div className="flex flex-wrap">
                {data.kehadiranGuru.senaraiTidakHadir.map((n, i) => (
                  <div key={i} className="w-1/2 text-[8pt]">
                    {i+1}. {n || '................................'}
                  </div>
                ))}
              </div>
            </td>
          </tr>

          {/* Pelawat */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Pelawat (VIP/PPD)</td>
            <td className="border border-black p-0">
               <table className="w-full">
                 <thead>
                   <tr className="bg-gray-100 text-[8pt]">
                     <th className="border-r border-black p-1 w-1/2">Nama Pegawai</th>
                     <th className="p-1 w-1/2">Urusan</th>
                   </tr>
                 </thead>
                 <tbody>
                   {data.pelawat.map((p, i) => (
                     <tr key={i} className="border-t border-black text-[8pt]">
                       <td className="border-r border-black p-1">{p.nama || ' '}</td>
                       <td className="p-1">{p.urusan || ' '}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </td>
          </tr>

          {/* Ulasan Akhir */}
          <tr>
            <td className="border border-black p-2 font-bold uppercase align-top text-[8pt] bg-gray-50">Ulasan / Catatan</td>
            <td className="border border-black p-2 min-h-[60px] text-[9pt] whitespace-pre-wrap align-top">
              {data.ulasanCatatan || '-'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pengesahan */}
      <div className="mt-8 flex justify-between px-10 text-[9pt]">
        <div className="text-center w-[200px]">
          <p className="mb-12">Disediakan Oleh,</p>
          <div className="border-b border-black w-full mb-1"></div>
          <p className="font-bold uppercase mb-1">{data.namaGuruPelapor || '................................'}</p>
          <p className="font-bold text-[8pt]">TARIKH: {data.tarikhLaporan || '................................'}</p>
        </div>
        <div className="text-center w-[200px]">
          <p className="mb-12">Disahkan Oleh,</p>
          <div className="border-b border-black w-full mb-1"></div>
          <p className="font-bold uppercase tracking-tighter text-[10pt]">COP JAWATAN</p>
        </div>
      </div>
    </div>
  );
};

export default PDFTemplate;