// Simpan data pengaduan di sistem
let dataAduan = JSON.parse(localStorage.getItem('db_aduan_semparuk')) || [];

// 1. Fungsi saat warga menekan tombol 'Kirim Pengaduan' -> Buat ID Token Otomatis
function submitAduan(e) {
  e.preventDefault();
  const nama = document.getElementById('namaPelapor').value;
  const kontak = document.getElementById('kontakPelapor').value;
  const isi = document.getElementById('isiAduan').value;
  
  // Membuat Nomor Token ID acak (Contoh: ADU-7K9P2)
  const token = 'ADU-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  
  const aduanBaru = {
    idToken: token,
    tanggal: new Date().toLocaleDateString('id-ID'),
    nama: nama,
    kontak: kontak,
    isi: isi,
    status: 'Belum Ditanggapi',
    tanggapan: 'Belum ada tanggapan atau balasan dari admin.'
  };

  dataAduan.push(aduanBaru);
  localStorage.setItem('db_aduan_semparuk', JSON.stringify(dataAduan));

  // Tampilkan Token ke layar masyarakat
  document.getElementById('displayToken').innerText = token;
  document.getElementById('alertToken').classList.remove('d-none');
  document.getElementById('formAduan').reset();
}

// 2. Fungsi saat warga menekan 'Cek Status' -> Memeriksa ID Token
function cekStatusAduan() {
  const tokenInput = document.getElementById('inputTokenCek').value.trim().toUpperCase();
  const hasilDiv = document.getElementById('hasilCekAduan');
  
  // Cari aduan berdasarkan ID Token
  const aduan = dataAduan.find(item => item.idToken === tokenInput);

  if (!aduan) {
    hasilDiv.innerHTML = `<div class="alert alert-danger mt-2">ID Token tidak ditemukan! Silakan periksa kembali nomor token Anda.</div>`;
    return;
  }

  const badgeColor = aduan.status === 'Selesai' ? 'bg-success' : 'bg-warning text-dark';
  
  // Tampilkan isi pengaduan dan balasan admin
  hasilDiv.innerHTML = `
    <div class="card border border-success mt-2">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge ${badgeColor}">${aduan.status}</span>
          <small class="text-muted">${aduan.tanggal}</small>
        </div>
        <p class="mb-2"><strong>Pengaduan Anda:</strong><br>${aduan.isi}</p>
        <hr>
        <p class="mb-0 text-success"><strong>Tanggapan/Balasan Admin:</strong><br>${aduan.tanggapan}</p>
      </div>
    </div>
  `;
}

// 3. Fungsi Login Admin
function loginAdmin() {
  const pass = document.getElementById('passAdmin').value;
  if (pass === "admin123") { 
    alert("Login Admin Berhasil!");
    window.location.href = "admin.html";
  } else {
    alert("Password Admin Salah! (Password default: admin123)");
  }
}

// 4. Fungsi Logout Admin
function logoutAdmin() {
  alert("Admin berhasil keluar.");
  window.location.href = "index.html";
}

// 5. Menampilkan daftar aduan di halaman admin.html
function renderTabelAdmin() {
  const tbody = document.getElementById('tabelAduanAdmin');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (dataAduan.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Belum ada aduan masuk.</td></tr>`;
    return;
  }

  dataAduan.forEach((aduan, index) => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${aduan.idToken}</strong></td>
        <td>${aduan.nama}<br><small class="text-muted">${aduan.kontak}</small></td>
        <td>${aduan.isi}</td>
        <td><span class="badge ${aduan.status === 'Selesai' ? 'bg-success' : 'bg-warning text-dark'}">${aduan.status}</span></td>
        <td>
          <textarea id="balasan-${index}" class="form-control form-control-sm" rows="2" placeholder="Ketik balasan admin di sini...">${aduan.tanggapan !== 'Belum ada tanggapan atau balasan dari admin.' ? aduan.tanggapan : ''}</textarea>
        </td>
        <td>
          <button class="btn btn-sm btn-success fw-bold" onclick="simpanBalasanAdmin(${index})">
            <i class="bi bi-reply-fill"></i> Balas
          </button>
        </td>
      </tr>
    `;
  });
}

// 6. Menyimpan Balasan Admin
function simpanBalasanAdmin(index) {
  const teksBalasan = document.getElementById(`balasan-${index}`).value;
  if (teksBalasan.trim() === '') {
    alert("Isi balasan tidak boleh kosong!");
    return;
  }
  
  dataAduan[index].tanggapan = teksBalasan;
  dataAduan[index].status = 'Selesai';
  localStorage.setItem('db_aduan_semparuk', JSON.stringify(dataAduan));
  
  alert("Tanggapan berhasil disimpan dan dapat dilihat oleh masyarakat menggunakan ID Token!");
  renderTabelAdmin();
}
