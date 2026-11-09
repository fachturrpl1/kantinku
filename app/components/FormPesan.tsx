'use client'

import { useState } from 'react'
import { Menu, rupiah } from '@/data/menu'

interface ItemKeranjang {
    id: number;
    nama: string;
    harga: number;
    jumlah: number;
    stok: number;
}

export default function FormPesan({ menu }: { menu: Menu }) {
    const [jumlah, setJumlah] = useState(1);
    const [pesan, setPesan] = useState('');

    if (menu.stok === 0) {
        return <p className="text-red-400 font-bold mt-4">Menu ini habis</p>;
    }

    const handleKurang = () => {
        if (jumlah > 1) {
            setJumlah(jumlah - 1);
            setPesan('');
        }
    };

    const handleTambah = () => {
        if (jumlah < menu.stok) {
            setJumlah(jumlah + 1);
            setPesan('');
        } else {
            setPesan(`Jumlah tidak boleh melebihi stok (${menu.stok})`);
        }
    };

    const handleSimpanKeKeranjang = () => {
        if (jumlah < 1 || jumlah > menu.stok) {
            setPesan('Jumlah pesanan tidak valid.');
            return;
        }

        const keranjangLama: ItemKeranjang[] = JSON.parse(localStorage.getItem('keranjang') || '[]');
        const indexItem = keranjangLama.findIndex((item) => item.id === menu.id);

        if (indexItem > -1) {
            const totalBaru = keranjangLama[indexItem].jumlah + jumlah;
            if (totalBaru > menu.stok) {
                setPesan(`Total di keranjang melebihi stok (${menu.stok})`);
                return;
            }
            keranjangLama[indexItem].jumlah = totalBaru;
        } else {
            keranjangLama.push({
                id: menu.id,
                nama: menu.nama,
                harga: menu.harga,
                jumlah: jumlah,
                stok: menu.stok
            });
        }

        localStorage.setItem('keranjang', JSON.stringify(keranjangLama));
        window.dispatchEvent(new Event("keranjang-berubah"));
        setPesan('Ditambahkan ke keranjang!');
    };

    const totalHarga = menu.harga * jumlah;

    return (
        <div className="mt-6 border-t border-slate-700 pt-4 text-slate-100">
            <p className="font-semibold mb-2 text-slate-200">Total Harga: {rupiah(totalHarga)}</p>
            
            <div className="flex items-center gap-3 mb-4">
                <button 
                    onClick={handleKurang}
                    className="px-3 py-1 border border-slate-600 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                    -
                </button>
                <span className="font-medium text-lg text-slate-100">{jumlah}</span>
                <button 
                    onClick={handleTambah}
                    className="px-3 py-1 border border-slate-600 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                    +
                </button>
            </div>

            <button
                onClick={handleSimpanKeKeranjang}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-medium"
            >
                Tambah ke keranjang
            </button>

            {pesan && (
                <p className={`mt-2 text-sm ${pesan.includes('Ditambahkan') ? 'text-green-400' : 'text-red-400'}`}>
                    {pesan}
                </p>
            )}
        </div>
    );
}