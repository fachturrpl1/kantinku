'use client'

import KartuMenu from './KartuMenu'
import KontrolKatalog from './KontrolKatalog';
import { type Menu } from '@/data/menu'
import { useState } from 'react'

export default function KatalogMenu({ menu }: { menu: Menu[] }) {
    const [cari, setCari] = useState('');
    const [kategori, setKategori] = useState('Semua');
    const [urut, setUrut] = useState('awal');


    const daftarKategori = ['Semua', ...new Set(menu.map((item) => item.kategori))];

    const hasilFilter = menu.filter((item) => {
        const sesuaiCari = item.nama.toLowerCase().includes(cari.toLowerCase());
        const sesuaiKategori = kategori === 'Semua' || item.kategori === kategori;
        return sesuaiCari && sesuaiKategori;
    });

    const tersusun = [...hasilFilter].sort((a, b) => {
        if (urut === 'murah') return a.harga - b.harga;
        if (urut === 'mahal') return b.harga - a.harga;
        if (urut === 'nama') return a.nama.localeCompare(b.nama);
        return 0;
    });

    return (
        <div className="p-4">
            <KontrolKatalog
                cari={cari}
                setCari={setCari}
                kategori={kategori}
                setKategori={setKategori}
                urut={urut}
                setUrut={setUrut}
                daftarKategori={daftarKategori}
            />
            {tersusun.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Menu tidak ditemukan.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
                    {tersusun.map((item) => (
                        <KartuMenu key={item.id} menu={item} />
                    ))}
                </div>
            )}
        </div>
    );
}