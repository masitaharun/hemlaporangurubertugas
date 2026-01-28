
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

/**
 * SALIN DAN LEKAT SENARAI NAMA GURU ANDA DI SINI.
 * Pastikan setiap nama diletakkan dalam pembuka dan penutup kata " " dan dipisahkan dengan koma.
 */
export const SENARAI_GURU_RASMI: string[] = [
  "ZAHAREL BIN ATAN",
  "KURSINA BINTI AYOB",
  "SUHAILY BINTI SAMSUDIN",
  "AZRUL NOR BIN FADZILAH",
  "NORHADI SHAM BIN HAMZAH",
  "SYLVIANO BIN ABU BAKAR",
  "ZUL AZWAL BIN MOHAMED",
  "MOHD RAZIF BIN FATHLAN",
  "SYLVIANO BIN ABU BAKAR",
  "MUHAMMAD HAKIM BIN MOHD SHARIF",
  "MUHAMMAD IZZUDDIN BIN ABDUL WAHAB",
  "SURIANI BINTI ANDI MAPPEASSE",
  "NORIZAN BINTI MOHAMAD NOR",
  "ROSLIZA BINTI ABD MANAP",
  "SALMAH BINTI SALIMAN",
  "NORHUDA BINTI ABD RAZAK",
  "ALHANIM BINTI HAMZAH",
  "ROSILAWATI BINTI GHAZALI",
  "JUNAIDAH  BINTI YATIM",
  "NURUL BALQIS BINTI RASHID@MOHAMAD",
  "RUHAILAH BINTI MOHD SAFIAN",
  "MASHITAH BINTI MOHD FAKRI",
  "NORAIDAH BINTI MAT ZAIMIN",
  "NOOR MASITAH BINTI HARUN",
  "SYAFIKAH AINUN BINTI MOHAMMAD SABRI",
  "NUR ATIRAH BINTI ZALAHUDDIN",
  "NUR SYAKILA BINTI ZAHARLUDIN",
  "SITI NUR ASMIRA BINTI NOR SHAH",
  "SITI NAZIHA BINTI JOPRI",
  "THARSHINIE A/P SUPPIAH",
  "NUR AMIRAH BINTI MOHD ADENAN",
  "FATIN NUR AMELIA BINTI AZIZON",
  "NORLAILI BINTI MUHAMMAD ZAMBERI",
  "NADIA NATASHA BINTI MHD ROSLAILE",
  "NOR NAEZAH BINTI ABU TALIB",
  "NUR AMIRAH BINTI SUHAIMI",
  // Tambah lagi nama guru di sini mengikut keperluan sekolah anda
].sort();

export const INITIAL_DATA: ReportData = {
  minggu: '',
  tarikh: '',
  hari: '',
  namaGuru: Array(8).fill(''),
  senaraiGuruMaster: SENARAI_GURU_RASMI, // Menggunakan senarai rasmi sebagai default
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
