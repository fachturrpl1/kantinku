'use client'

import { useState } from 'react'
import { rupiah } from '@/data/menu'
import Link from 'next/link'

interface ItemPesanan {
    id: number;
    nama: string;
    harga: number;
    jumlah: number;
    stok: number;
}

interface Pesanan {
    id: number;
    nama: string;
    kelas: string;
    metode: string;
    item: ItemPesanan[];
    subtotal: number;
    diskon: number;
    ongkir: number;
    total: number;
    tanggal: string;
}

export default function HalamanRiwayat() {
    const [riwayat, setRiwayat] = useState<Pesanan[]>(() => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem('riwayat');
        return data ? JSON.parse(data) : [];
    });

    const handleHapusRiwayat = () => {
        const konfirmasi = window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pesanan?');
        if (konfirmasi) {
            localStorage.removeItem('riwayat');
            setRiwayat([]);
        }
    };

    if (riwayat.length === 0) {
        return (
            <div className="p-6 text-center text-slate-300">
                <p className="mb-4">Belum ada pesanan.</p>
                <Link href="/menu" className="text-orange-500 hover:underline">
                    Mulai Belanja
                </Link>
            </div>
        );
    }

    const totalBelanjaSemua = riwayat.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6 text-slate-100">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
                <button
                    onClick={handleHapusRiwayat}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                    Hapus Riwayat
                </button>
            </div>
            
            {/* Ringkasan Pesanan & Total Belanja */}
            <div className="border border-slate-700 bg-slate-900 p-4 rounded text-sm space-y-1 text-slate-300">
                <p>Ringkasan: <span className="font-semibold text-slate-100">{riwayat.length} pesanan</span></p>
                <p>Total belanja keseluruhan: <span className="font-semibold text-orange-400">{rupiah(totalBelanjaSemua)}</span></p>
            </div>

            {riwayat.map((pesanan) => (
                <div key={pesanan.id} className="border border-slate-700 bg-slate-900 p-4 rounded shadow-sm space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>{pesanan.tanggal}</span>
                        <span className="font-semibold text-orange-500 uppercase">{pesanan.metode}</span>
                    </div>
                    <p className="font-bold text-slate-100">Pemesan: {pesanan.nama} ({pesanan.kelas})</p>
                    <div className="border-t border-slate-700 border-b py-2 space-y-1">
                        {pesanan.item.map((i) => (
                            <div key={i.id} className="flex justify-between text-sm text-slate-300">
                                <span>{i.nama} x{i.jumlah}</span>
                                <span>{rupiah(i.harga * i.jumlah)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-right text-sm space-y-1 text-slate-300">
                        <p>Subtotal: {rupiah(pesanan.subtotal)}</p>
                        {pesanan.diskon > 0 && <p className="text-green-400">Diskon: -{rupiah(pesanan.diskon)}</p>}
                        {pesanan.ongkir > 0 && <p>Ongkir: {rupiah(pesanan.ongkir)}</p>}
                        <p className="font-bold text-base text-slate-100">Total: {rupiah(pesanan.total)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}