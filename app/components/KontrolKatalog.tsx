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
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari menu..."
        className="border border-slate-700 bg-slate-900 px-3 py-2 rounded flex-grow text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
      />
      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="border border-slate-700 bg-slate-900 px-3 py-2 rounded text-slate-100 focus:outline-none focus:border-orange-500"
      >
        {daftarKategori.map((k) => (
          <option key={k} value={k} className="bg-slate-900 text-slate-100">
            {k}
          </option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => setUrut(e.target.value)}
        className="border border-slate-700 bg-slate-900 px-3 py-2 rounded text-slate-100 focus:outline-none focus:border-orange-500"
      >
        <option value="awal" className="bg-slate-900 text-slate-100">Urutan awal</option>
        <option value="murah" className="bg-slate-900 text-slate-100">Harga termurah</option>
        <option value="mahal" className="bg-slate-900 text-slate-100">Harga termahal</option>
        <option value="nama" className="bg-slate-900 text-slate-100">Nama A-Z</option>
      </select>
    </div>
  );
}