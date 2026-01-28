
import React, { useState } from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
  onUpdate: (newData: Partial<ReportData>) => void;
}

const Card: React.FC<{ title: string; children: React.ReactNode; color: string }> = ({ title, children, color }) => (
  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8 transition-all hover:shadow-md">
    <div className={`${color} px-8 py-5 text-white font-black uppercase tracking-[0.2em] text-[11px]`}>
      {title}
    </div>
    <div className="p-8">{children}</div>
  </div>
);

const SelectGroup: React.FC<{ label: string; options: string[]; value: string; onChange: (v: string) => void }> = ({ label, options, value, onChange }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all border-2 ${value === opt ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-emerald-100 hover:text-emerald-600'}`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

const ReportForm: React.FC<Props> = ({ data, onUpdate }) => {
  const [newTeacher, setNewTeacher] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const nextData = { ...data };
    let current: any = nextData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdate(nextData);
  };

  const addMasterTeacher = () => {
    if (!newTeacher.trim()) return;
    const name = newTeacher.toUpperCase().trim();
    if (!data.senaraiGuruMaster.includes(name)) {
      updateField('senaraiGuruMaster', [...data.senaraiGuruMaster, name].sort());
    }
    setNewTeacher('');
  };

  const addBulkTeachers = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.split('\n');
    const newNames = lines
      .map(line => line.trim().toUpperCase())
      .filter(line => line.length > 0 && !data.senaraiGuruMaster.includes(line));
    
    if (newNames.length > 0) {
      updateField('senaraiGuruMaster', [...data.senaraiGuruMaster, ...newNames].sort());
      setBulkInput('');
      setShowBulk(false);
      alert(`${newNames.length} nama guru telah didaftarkan ke dalam sistem.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ⚙️ PANEL ADMIN - KHUSUS UNTUK DAFTAR GURU */}
      <Card title="⚙️ Panel Admin: Pendaftaran Guru SKBE" color="bg-slate-900">
        <div className="mb-6">
           <p className="text-[11px] text-slate-500 font-bold mb-4 uppercase tracking-wider leading-relaxed">
             Daftarkan senarai nama semua guru sekolah di sini. Guru bertugas hanya perlu klik nama mereka dari senarai dropdown di bawah nanti.
           </p>
           
           <div className="flex gap-3">
             <input 
               className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold uppercase text-sm outline-none focus:border-emerald-500 transition-all"
               placeholder="Tambah Nama Guru (Cth: AHMAD BIN ALI)..."
               value={newTeacher}
               onChange={e => setNewTeacher(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && addMasterTeacher()}
             />
             <button onClick={addMasterTeacher} className="bg-emerald-600 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all">Tambah</button>
           </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
           <button 
             onClick={() => setShowBulk(!showBulk)}
             className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-70 transition-all"
           >
             {showBulk ? '✖️ Tutup Panel Pukal' : '📥 Tambah Banyak Nama Sekaligus (Bulk Add)'}
           </button>
           
           {showBulk && (
             <div className="mt-4 p-5 bg-emerald-50/50 rounded-3xl border-2 border-dashed border-emerald-100 animate-in fade-in slide-in-from-top-2">
               <textarea 
                 className="w-full p-5 rounded-2xl border-none outline-none font-bold text-sm h-40 mb-4 shadow-inner"
                 placeholder="Paste senarai nama guru dari Excel atau WhatsApp di sini (Satu nama setiap baris)..."
                 value={bulkInput}
                 onChange={e => setBulkInput(e.target.value)}
               />
               <button onClick={addBulkTeachers} className="w-full bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 shadow-xl shadow-emerald-200 transition-all">Daftarkan Semua Nama</button>
             </div>
           )}
        </div>

        {/* Senarai Guru Sedia Ada */}
        <div className="mt-8">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senarai Berdaftar ({data.senaraiGuruMaster.length})</h4>
              {data.senaraiGuruMaster.length > 0 && (
                <button 
                  onClick={() => { if(confirm("Padam SEMUA nama guru? Tindakan ini tidak boleh diundur.")) updateField('senaraiGuruMaster', []) }}
                  className="text-red-400 font-bold text-[9px] uppercase hover:underline"
                >
                  Padam Semua
                </button>
              )}
           </div>
           <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
             {data.senaraiGuruMaster.length === 0 ? (
               <div className="w-full text-center py-6 text-slate-300 italic text-xs uppercase font-black tracking-widest">Tiada guru berdaftar</div>
             ) : (
               data.senaraiGuruMaster.map(n => (
                 <div key={n} className="bg-white border border-slate-200 pl-4 pr-2 py-2 rounded-xl text-[10px] font-bold flex items-center gap-3 shadow-sm group hover:border-emerald-300">
                   <span className="text-slate-700">{n}</span>
                   <button 
                     onClick={() => updateField('senaraiGuruMaster', data.senaraiGuruMaster.filter(x => x !== n))}
                     className="text-slate-300 hover:text-red-500 transition-all"
                   >
                     ✕
                   </button>
                 </div>
               ))
             )}
           </div>
        </div>
      </Card>

      {/* 📝 BORANG LAPORAN HARIAN (UNTUK GURU BERTUGAS) */}
      <Card title="📅 Maklumat Asas Laporan" color="bg-emerald-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minggu</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500 appearance-none" value={data.minggu} onChange={e => updateField('minggu', e.target.value)}>
              <option value="">PILIH MINGGU</option>
              {Array.from({length: 45}, (_, i) => <option key={i+1} value={i+1}>MINGGU {i+1}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarikh</label>
            <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500" value={data.tarikh} onChange={e => updateField('tarikh', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500 appearance-none" value={data.hari} onChange={e => updateField('hari', e.target.value)}>
              <option value="">PILIH HARI</option>
              {['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'].map(h => <option key={h} value={h}>{h.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-slate-100">
          <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] block mb-6">Pilih Nama Guru Bertugas (Hari Ini)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.namaGuru.map((val, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[8px] font-black text-slate-300 uppercase">Slot {i+1}</span>
                <select 
                  className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-[10px] outline-none focus:border-emerald-500"
                  value={val}
                  onChange={e => {
                    const copy = [...data.namaGuru];
                    copy[i] = e.target.value;
                    updateField('namaGuru', copy);
                  }}
                >
                  <option value="">-- PILIH NAMA --</option>
                  {data.senaraiGuruMaster.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Aktiviti & Perhimpunan */}
      <Card title="📢 Perhimpunan & Aktiviti Pagi" color="bg-blue-600">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Isi Utama Ucapan / Pengumuman</label>
            <textarea className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-medium text-sm min-h-[120px] outline-none focus:border-blue-500" value={data.perhimpunan.isiUtama} onChange={e => updateField('perhimpunan.isiUtama', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Komen Perjalanan Program</label>
            <textarea className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-medium text-sm min-h-[80px] outline-none focus:border-blue-500" value={data.perhimpunan.komen} onChange={e => updateField('perhimpunan.komen', e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Kantin */}
      <Card title="🍴 Kantin Sekolah" color="bg-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div>
              <SelectGroup label="Tahap Kebersihan Kantin" options={['Cemerlang', 'Baik', 'Sederhana', 'Lemah']} value={data.kantin.kebersihan} onChange={v => updateField('kantin.kebersihan', v)} />
              <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-orange-500" placeholder="Catatan kebersihan..." value={data.kantin.komenKebersihan} onChange={e => updateField('kantin.komenKebersihan', e.target.value)} />
           </div>
           <div>
              <SelectGroup label="Tahap Kualiti Makanan" options={['Bermutu Tinggi', 'Sederhana', 'Rendah']} value={data.kantin.kualiti} onChange={v => updateField('kantin.kualiti', v)} />
              <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-orange-500" placeholder="Catatan kualiti..." value={data.kantin.komenKualiti} onChange={e => updateField('kantin.komenKualiti', e.target.value)} />
           </div>
        </div>
      </Card>

      {/* Kebersihan & Tandas */}
      <Card title="🚻 Tandas & Persekitaran" color="bg-cyan-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <SelectGroup label="Kebersihan Tandas Murid" options={['Cemerlang', 'Memuaskan', 'Lemah']} value={data.tandas.tahap} onChange={v => updateField('tandas.tahap', v)} />
            <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium h-24 outline-none focus:border-cyan-500" placeholder="Komen tandas..." value={data.tandas.komen} onChange={e => updateField('tandas.komen', e.target.value)} />
          </div>
          <div>
            <SelectGroup label="Keceriaan Kawasan Sekolah" options={['Cemerlang', 'Baik', 'Sederhana', 'Lemah']} value={data.persekitaran.tahap} onChange={v => updateField('persekitaran.tahap', v)} />
            <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium h-24 outline-none focus:border-cyan-500" placeholder="Komen persekitaran..." value={data.persekitaran.komen} onChange={e => updateField('persekitaran.komen', e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Disiplin & 3K */}
      <Card title="🛡️ Disiplin & Keselamatan (3K)" color="bg-rose-600">
        <div className="mb-10">
          <SelectGroup label="Tahap Disiplin Murid Hari Ini" options={['Cemerlang', 'Baik', 'Sederhana', 'Lemah']} value={data.disiplin.tahap} onChange={v => updateField('disiplin.tahap', v)} />
          <textarea className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-4 text-sm font-medium outline-none focus:border-rose-500" placeholder="Komen disiplin secara umum..." value={data.disiplin.komen} onChange={e => updateField('disiplin.komen', e.target.value)} />
          <input className="w-full p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-sm font-bold placeholder:text-rose-300 outline-none focus:border-rose-400" placeholder="🚨 KES SERIUS (Tinggalkan kosong jika tiada)" value={data.disiplin.kesSerius} onChange={e => updateField('disiplin.kesSerius', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bilangan Murid Lewat</label>
              <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl" value={data.statistikMurid.lewat} onChange={e => updateField('statistikMurid.lewat', e.target.value)} />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Murid Ke Klinik / Balik Awal</label>
              <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl" value={data.statistikMurid.klinik} onChange={e => updateField('statistikMurid.klinik', e.target.value)} />
           </div>
        </div>
      </Card>

      {/* Kehadiran Guru */}
      <Card title="👥 Kehadiran Guru" color="bg-slate-700">
        <div className="grid grid-cols-2 gap-6 mb-8">
           <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-100">
              <label className="block text-[10px] font-black text-emerald-800 uppercase mb-2">Jumlah Hadir</label>
              <input className="w-full bg-transparent border-none text-4xl font-black text-emerald-900 outline-none" value={data.kehadiranGuru.hadir} onChange={e => updateField('kehadiranGuru.hadir', e.target.value)} />
           </div>
           <div className="p-6 bg-amber-50 rounded-3xl border-2 border-amber-100">
              <label className="block text-[10px] font-black text-amber-800 uppercase mb-2">Tidak Hadir</label>
              <input className="w-full bg-transparent border-none text-4xl font-black text-amber-900 outline-none" value={data.kehadiranGuru.tidakHadir} onChange={e => updateField('kehadiranGuru.tidakHadir', e.target.value)} />
           </div>
        </div>
        
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sila Pilih Nama Guru Tidak Hadir</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.kehadiranGuru.senaraiTidakHadir.map((v, i) => (
            <select key={i} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-slate-400" value={v} onChange={e => {
              const copy = [...data.kehadiranGuru.senaraiTidakHadir];
              copy[i] = e.target.value;
              updateField('kehadiranGuru.senaraiTidakHadir', copy);
            }}>
              <option value="">-- Tiada / Pilih Nama --</option>
              {data.senaraiGuruMaster.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          ))}
        </div>
      </Card>

      {/* Pelawat */}
      <Card title="🏢 Rekod Pelawat (VIP / PPD / JPN)" color="bg-yellow-600">
        <div className="space-y-3">
          {data.pelawat.map((p, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-xs" placeholder={`Nama Pegawai / Pelawat ${i+1}`} value={p.nama} onChange={e => {
                const copy = [...data.pelawat];
                copy[i] = { ...copy[i], nama: e.target.value.toUpperCase() };
                updateField('pelawat', copy);
              }} />
              <input className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-medium" placeholder="Urusan / Jawatan" value={p.urusan} onChange={e => {
                const copy = [...data.pelawat];
                copy[i] = { ...copy[i], urusan: e.target.value };
                updateField('pelawat', copy);
              }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Rumusan Akhir */}
      <Card title="✍️ Ulasan & Catatan Keseluruhan" color="bg-emerald-900">
        <textarea className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] min-h-[180px] font-medium text-sm mb-8 outline-none focus:border-emerald-500" placeholder="Tuliskan rumusan atau sebarang perkara penting yang berlaku hari ini untuk rujukan pentadbiran..." value={data.ulasanCatatan} onChange={e => updateField('ulasanCatatan', e.target.value)} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Disediakan Oleh (Nama Pelapor)</label>
              <select className="w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl font-black text-xs outline-none focus:border-emerald-500 shadow-sm" value={data.namaGuruPelapor} onChange={e => updateField('namaGuruPelapor', e.target.value)}>
                <option value="">-- PILIH NAMA ANDA --</option>
                {data.senaraiGuruMaster.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tarikh Laporan Dibuat</label>
              <input type="date" className="w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl font-black text-xs outline-none focus:border-emerald-500 shadow-sm" value={data.tarikhLaporan} onChange={e => updateField('tarikhLaporan', e.target.value)} />
           </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportForm;
