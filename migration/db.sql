CREATE TABLE kordinator (
  id VARCHAR(100) PRIMARY KEY,
  nama VARCHAR(255),
  no_hp VARCHAR(100),
  nidn VARCHAR(100),
  jabatan VARCHAR(255),
  username VARCHAR(100),
  password VARCHAR(100),
  email VARCHAR(100),
  status VARCHAR(100),
  remember_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pembimbing (
  id VARCHAR(100) PRIMARY KEY,
  nama VARCHAR(255),
  no_hp VARCHAR(100),
  nidn VARCHAR(100),
  jabatan VARCHAR(255),
  username VARCHAR(100),
  password VARCHAR(100),
  email VARCHAR(100),
  status VARCHAR(100),
  remember_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE mahasiswa (
  id VARCHAR(100) PRIMARY KEY,
  nama VARCHAR(255),
  nim VARCHAR(100),
  no_hp VARCHAR(100),
  pembimbing_akademik VARCHAR(255),
  username VARCHAR(100),
  password VARCHAR(100),
  email VARCHAR(100),
  status VARCHAR(100),
  remember_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE form_or_file (
  id VARCHAR(100) PRIMARY KEY,
  deskripsi TEXT,
  url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pengajuan_ta (
  id VARCHAR(100) PRIMARY KEY,
  mahasiswa_id VARCHAR(100),
  form_ta VARCHAR(255),
  judul_pertama TEXT,
  deskripsi_judul_pertama TEXT,
  judul_kedua TEXT,
  deskripsi_judul_kedua TEXT,
  pembimbing_satu VARCHAR(255),
  pembimbing_dua VARCHAR(255),
  pembimbing_tiga VARCHAR(255),
  pembimbing_empat VARCHAR(255),
  transkip_nilai VARCHAR(255),
  krs VARCHAR(255),
  bukti_pembayaran VARCHAR(255),
  bukti_selesai_praktikum VARCHAR(255),
  bukti_selsai_kp VARCHAR(255),
  jumlah_sks VARCHAR(255),
  ipk VARCHAR(255),
  status VARCHAR(100),
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tugas_akhir_disetujui (
  id VARCHAR(100) PRIMARY KEY,
  pengajuan_ta_id VARCHAR(100),
  pembimbing_satu_id VARCHAR(100),
  pembimbing_dua_id VARCHAR(255),
  judul_penelitian TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pengajuan_ta_id) REFERENCES pengajuan_ta(id),
  FOREIGN KEY (pembimbing_satu_id) REFERENCES pembimbing(id),
  FOREIGN KEY (pembimbing_dua_id) REFERENCES pembimbing(id)
);

CREATE TABLE pengajuan_kp (
  id VARCHAR(100) PRIMARY KEY,
  mahasiswa_id VARCHAR(100),
  form_rekomendasi_pa_1 VARCHAR(255),
  form_rekomendasi_pa_2 VARCHAR(255),
  form_persetujuan_perusahaan VARCHAR(255),
  transkip_nilai VARCHAR(255),
  krs VARCHAR(255),
  bukti_pembayaran VARCHAR(255),
  bukti_selesai_praktikum VARCHAR(255),
  ipk VARCHAR(255),
  jumlah_sks VARCHAR(255),
  tanggal_mulai_kp DATE,
  tanggal_selesai_kp DATE,
  status VARCHAR(100),
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE kerja_praktek_disetujui (
  id VARCHAR(100) PRIMARY KEY,
  pengajuan_kp_id VARCHAR(100),
  pembimbing_satu_id VARCHAR(100),
  judul_laporan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pengajuan_kp_id) REFERENCES pengajuan_kp(id),
  FOREIGN KEY (pembimbing_satu_id) REFERENCES pembimbing(id)
);

CREATE TABLE seminar (
  id VARCHAR(100) PRIMARY KEY,
  mahasiswa_id VARCHAR(100),
  jenis_seminar VARCHAR(100),
  details_seminar VARCHAR(100),
  tanggal_seminar DATE,
  jam_mulai_seminar DATETIME,
  jam_akhir_seminar DATETIME,
  status VARCHAR(100),
  ruangan VARCHAR(255),
  lampiran VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE penilaian_seminar_proposal (
  id VARCHAR(100) PRIMARY KEY,
  mahasiswa_id VARCHAR(100),
  seminar_id VARCHAR(100),
  nilai_sempro VARCHAR(255),
  nilai_sidang_komprehensif VARCHAR(255),
  nilai_pembimbing_satu VARCHAR(255),
  niali_pembimbing_dua VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id),
  FOREIGN KEY (seminar_id) REFERENCES seminar(id)
);

CREATE TABLE penilaian_seminar_hasil (
  id VARCHAR(100) PRIMARY KEY,
  mahasiswa_id VARCHAR(100),
  seminar_id VARCHAR(100),
  nilai_semhas VARCHAR(255),
  nilai_sidang_komprehensif VARCHAR(255),
  nilai_pembimbing_satu VARCHAR(255),
  niali_pembimbing_dua VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id),
  FOREIGN KEY (seminar_id) REFERENCES seminar(id)
);

CREATE TABLE penilaian_seminar_kp (
  id VARCHAR(100) PRIMARY KEY,
  mahasiswa_id VARCHAR(100),
  seminar_id VARCHAR(100),
  nilai VARCHAR(255),
  nilai_sidang_komprehensif VARCHAR(255),
  nilai_pembimbing_satu VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id),
  FOREIGN KEY (seminar_id) REFERENCES seminar(id)
);

CREATE TABLE penguji (
  id VARCHAR(100) PRIMARY KEY,
  seminar_id VARCHAR(100),
  penguji_satu VARCHAR(255),
  penguji_dua VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seminar_id) REFERENCES seminar(id)
);
