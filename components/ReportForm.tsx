import React, { useState } from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
  onUpdate: (newData: Partial<ReportData>) => void;
}

const Card: React.FC<{ title: string; children: React.ReactNode; color: string }> = ({ title, children, color }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
    <div className={`${color} px-8 py-4 text-white font-black uppercase tracking-widest text-sm`}>
      {title}
    </div>
    <div className="p-8">{children}</div>
  </div>
);

const SelectGroup: React.FC<{ label: string; options: string[]; value: string; onChange: (v: string) => void }> = ({ label, options, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold border-2 transition-all ${value === opt ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const ReportForm: React.FC<Props> = ({ data, onUpdate }) => {
  const [newTeacher, setNewTeacher] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Pengurusan Nama Guru (Master List) */}
      <Card title="Daftar Nama Guru (Sistem Auto-Simpan)" color="bg-slate-800">
        <div className="flex gap-2 mb-4">
          <input 
            className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold uppercase outline-none focus:border-emerald-500"
            placeholder="Taip Nama Guru Untuk Didaftarkan..."
            value={newTeacher}
            onChange={e => setNewTeacher(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMasterTeacher()}
          />
          <button onClick={addMasterTeacher} className="bg-emerald-600 text-white px-8 rounded-2xl font-black hover:bg-emerald-700">DAFTAR</button>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2">
          {data.senaraiGuruMaster.map(n => (
            <span key={n} className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-2">
              {n} <button onClick={() => updateField('senaraiGuruMaster', data.senaraiGuruMaster.filter(x => x !== n))} className="text-red-500">✕</button>
            </span>
          ))}
        </div>
      </Card>

      {/* Maklumat Asas */}
      <Card title="Maklumat Utama Laporan" color="bg-emerald-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Minggu (1-45)</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={data.minggu} onChange={e => updateField('minggu', e.target.value)}>
              <option value="">PILIH MINGGU</option>
              {Array.from({length: 45}, (_, i) => <option key={i+1} value={i+1}>MINGGU {i+1}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Tarikh</label>
            <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={data.tarikh} onChange={e => updateField('tarikh', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Hari</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={data.hari} onChange={e => updateField('hari', e.target.value)}>
              <option value="">PILIH HARI</option>
              {['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'].map(h => <option key={h} value={h}>{h.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.namaGuru.map((val, i) => (
            <div key={i}>
              <label className="text-[9px] font-black text-emerald-600 uppercase mb-1 block">Guru Bertugas {i+1}</label>
              <select className="w-full p-3 bg-white border-2 border-emerald-50 rounded-xl font-bold text-sm" value={val} onChange={e => {
                const copy = [...data.namaGuru];
                copy[i] = e.target.value;
                updateField('namaGuru', copy);
              }}>
                <option value="">-- Pilih Nama --</option>
                {data.senaraiGuruMaster.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          ))}
        </div>
      </Card>

      {/* Perhimpunan */}
      <Card title="Perhimpunan / Aktiviti Pagi" color="bg-blue-600">
        <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Isi Utama Ucapan / Pengumuman</label>
        <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-4 min-h-[120px]" value={data.perhimpunan.isiUtama} onChange={e => updateField('perhimpunan.isiUtama', e.target.value)} />
        <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Komen Perjalanan Perhimpunan</label>
        <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl" value={data.perhimpunan.komen} onChange={e => updateField('perhimpunan.komen', e.target.value)} />
      </Card>

      {/* Kantin */}
      <Card title="Kantin Sekolah" color="bg-orange-600">
        <SelectGroup label="Tahap Kebersihan" options={['Cemerlang', 'Baik', 'Sederhana', 'Lemah']} value={data.kantin.kebersihan} onChange={v => updateField('kantin.kebersihan', v)} />
        <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl mb-6 text-sm" placeholder="Komen Kebersihan..." value={data.kantin.komenKebersihan} onChange={e => updateField('kantin.komenKebersihan', e.target.value)} />
        
        <SelectGroup label="Tahap Kualiti Makanan" options={['Bermutu Tinggi', 'Sederhana', 'Rendah']} value={data.kantin.kualiti} onChange={v => updateField('kantin.kualiti', v)} />
        <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="Komen Kualiti..." value={data.kantin.komenKualiti} onChange={e => updateField('kantin.komenKualiti', e.target.value)} />
      </Card>

      {/* Tandas & Persekitaran */}
      <Card title="Tandas & Persekitaran" color="bg-cyan-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <SelectGroup label="Kebersihan Tandas Murid" options={['Cemerlang', 'Memuaskan', 'Tidak Memuaskan']} value={data.tandas.tahap} onChange={v => updateField('tandas.tahap', v)} />
            <textarea className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm h-20" placeholder="Komen Tandas..." value={data.tandas.komen} onChange={e => updateField('tandas.komen', e.target.value)} />
          </div>
          <div>
            <SelectGroup label="Keceriaan Persekitaran Sekolah" options={['Cemerlang', 'Baik', 'Sederhana', 'Lemah']} value={data.persekitaran.tahap} onChange={v => updateField('persekitaran.tahap', v)} />
            <textarea className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm h-20" placeholder="Komen Persekitaran..." value={data.persekitaran.komen} onChange={e => updateField('persekitaran.komen', e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Statistik Murid */}
      <Card title="Statistik Murid" color="bg-rose-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-rose-50 rounded-2xl">
            <label className="text-[10px] font-black text-rose-800 uppercase block mb-2">Bilangan Pelajar Lewat</label>
            <input className="w-full bg-white p-3 rounded-xl border border-rose-100 font-bold" value={data.statistikMurid.lewat} onChange={e => updateField('statistikMurid.lewat', e.target.value)} />
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl">
            <label className="text-[10px] font-black text-blue-800 uppercase block mb-2">Bil Pelajar Ke Klinik/Balik Awal</label>
            <input className="w-full bg-white p-3 rounded-xl border border-blue-100 font-bold" value={data.statistikMurid.klinik} onChange={e => updateField('statistikMurid.klinik', e.target.value)} />
          </div>
        </div>
      </Card>

      {/* 3K Section */}
      <Card title="Program 3K" color="bg-emerald-800">
        {['keselamatan', 'kesihatan', 'kebersihan'].map((key) => (
          <div key={key} className="mb-6 pb-6 border-b border-slate-100 last:border-0">
            <SelectGroup 
              label={`Tahap ${key.charAt(0).toUpperCase() + key.slice(1)} Sekolah`} 
              options={['Cemerlang', 'Baik', 'Sederhana', 'Lemah']} 
              value={(data.tigaK as any)[key].tahap} 
              onChange={v => updateField(`tigaK.${key}.tahap`, v)} 
            />
            <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder={`Catatan ${key}...`} value={(data.tigaK as any)[key].komen} onChange={e => updateField(`tigaK.${key}.komen`, e.target.value)} />
          </div>
        ))}
      </Card>

      {/* Disiplin */}
      <Card title="Disiplin Pelajar" color="bg-indigo-700">
        <SelectGroup label="Tahap Disiplin Keseluruhan" options={['Cemerlang', 'Baik', 'Sederhana', 'Lemah']} value={data.disiplin.tahap} onChange={v => updateField('disiplin.tahap', v)} />
        <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-4 h-20" placeholder="Komen Disiplin..." value={data.disiplin.komen} onChange={e => updateField('disiplin.komen', e.target.value)} />
        <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Kes Paling Serius (Jika Ada)</label>
        <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl h-20" value={data.disiplin.kesSerius} onChange={e => updateField('disiplin.kesSerius', e.target.value)} />
      </Card>

      {/* Kehadiran Guru */}
      <Card title="Semakan Kehadiran Guru" color="bg-slate-700">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <label className="text-[10px] font-black text-emerald-800 uppercase block mb-1">Hadir</label>
            <input className="w-full bg-transparent border-none text-2xl font-black outline-none" value={data.kehadiranGuru.hadir} onChange={e => updateField('kehadiranGuru.hadir', e.target.value)} />
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <label className="text-[10px] font-black text-amber-800 uppercase block mb-1">Tidak Hadir</label>
            <input className="w-full bg-transparent border-none text-2xl font-black outline-none" value={data.kehadiranGuru.tidakHadir} onChange={e => updateField('kehadiranGuru.tidakHadir', e.target.value)} />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Senarai Guru Tidak Hadir</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.kehadiranGuru.senaraiTidakHadir.map((v, i) => (
            <select key={i} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={v} onChange={e => {
              const copy = [...data.kehadiranGuru.senaraiTidakHadir];
              copy[i] = e.target.value;
              updateField('kehadiranGuru.senaraiTidakHadir', copy);
            }}>
              <option value="">-- Tiada --</option>
              {data.senaraiGuruMaster.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          ))}
        </div>
      </Card>

      {/* Pelawat VIP */}
      <Card title="Pelawat (VIP / Pegawai)" color="bg-yellow-600">
        {data.pelawat.map((p, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <input className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" placeholder={`Nama Pegawai ${i+1}`} value={p.nama} onChange={e => {
              const copy = [...data.pelawat];
              copy[i] = { ...copy[i], nama: e.target.value };
              updateField('pelawat', copy);
            }} />
            <input className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs" placeholder="Urusan" value={p.urusan} onChange={e => {
              const copy = [...data.pelawat];
              copy[i] = { ...copy[i], urusan: e.target.value };
              updateField('pelawat', copy);
            }} />
          </div>
        ))}
      </Card>

      {/* Ulasan Akhir */}
      <Card title="Ulasan / Catatan Keseluruhan" color="bg-emerald-900">
        <textarea className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl min-h-[150px] font-medium mb-6" placeholder="Tulis rumusan hari ini di sini..." value={data.ulasanCatatan} onChange={e => updateField('ulasanCatatan', e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Nama Guru Pelapor</label>
              <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500" value={data.namaGuruPelapor} onChange={e => updateField('namaGuruPelapor', e.target.value)}>
                <option value="">-- Pilih Nama --</option>
                {data.senaraiGuruMaster.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
           </div>
           <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Tarikh Laporan Dibuat</label>
              <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500" value={data.tarikhLaporan} onChange={e => updateField('tarikhLaporan', e.target.value)} />
           </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportForm;