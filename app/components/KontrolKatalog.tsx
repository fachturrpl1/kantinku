import React from "react";

interface KontrolKatalogProps {
  cari: string;
  setCari: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  urut: string;
  setUrut: (val: string) => void;
  daftarKategori: string[];
}

export default function KontrolKatalog({
  cari,
  setCari,
  kategori,
  setKategori,
  urut,
  setUrut,
  daftarKategori,
}: KontrolKatalogProps) {
  return (
    <div>
      <input
        type="text"
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari menu..."
      />
      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      >
        {daftarKategori.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => setUrut(e.target.value)}
      >
        <option value="awal">Urutan awal</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">Harga termahal</option>
        <option value="nama">Nama A-Z</option>
      </select>
    </div>
  );
}