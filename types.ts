export interface ReportData {
  minggu: string;
  tarikh: string;
  hari: string;
  namaGuru: string[]; // 1-8
  senaraiGuruMaster: string[];
  
  perhimpunan: {
    isiUtama: string;
    komen: string;
  };
  
  kantin: {
    kebersihan: string; // Cemerlang, Baik, Sederhana, Lemah
    komenKebersihan: string;
    kualiti: string; // Bermutu Tinggi, Sederhana, Rendah
    komenKualiti: string;
  };
  
  tandas: {
    tahap: string; // Cemerlang, Memuaskan, Tidak Memuaskan
    komen: string;
  };
  
  persekitaran: {
    tahap: string; // Cemerlang, Baik, Sederhana, Lemah
    komen: string;
  };
  
  statistikMurid: {
    lewat: string;
    klinik: string;
  };
  
  tigaK: {
    keselamatan: { tahap: string; komen: string };
    kesihatan: { tahap: string; komen: string };
    kebersihan: { tahap: string; komen: string };
  };
  
  disiplin: {
    tahap: string;
    komen: string;
    kesSerius: string;
  };
  
  kehadiranGuru: {
    hadir: string;
    tidakHadir: string;
    senaraiTidakHadir: string[]; // 1-8
  };
  
  pelawat: { nama: string; urusan: string }[]; // 1-4
  
  ulasanCatatan: string;
  namaGuruPelapor: string;
  tarikhLaporan: string;
}

export const INITIAL_DATA: ReportData = {
  minggu: '',
  tarikh: '',
  hari: '',
  namaGuru: Array(8).fill(''),
  senaraiGuruMaster: [],
  perhimpunan: { isiUtama: '', komen: '' },
  kantin: { kebersihan: 'Baik', komenKebersihan: '', kualiti: 'Sederhana', komenKualiti: '' },
  tandas: { tahap: 'Memuaskan', komen: '' },
  persekitaran: { tahap: 'Baik', komen: '' },
  statistikMurid: { lewat: '', klinik: '' },
  tigaK: {
    keselamatan: { tahap: 'Baik', komen: '' },
    kesihatan: { tahap: 'Baik', komen: '' },
    kebersihan: { tahap: 'Baik', komen: '' },
  },
  disiplin: { tahap: 'Baik', komen: '', kesSerius: '' },
  kehadiranGuru: { hadir: '', tidakHadir: '', senaraiTidakHadir: Array(8).fill('') },
  pelawat: Array(4).fill({ nama: '', urusan: '' }),
  ulasanCatatan: '',
  namaGuruPelapor: '',
  tarikhLaporan: ''
};