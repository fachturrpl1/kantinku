'use client'

import { useState, useEffect } from 'react'
import { rupiah } from '@/data/menu'
import Link from 'next/link'

interface ItemKeranjang {
    id: number;
    nama: string;
    harga: number;
    jumlah: number;
    stok: number;
}

export default function HalamanKeranjang() {
    const [keranjang, setKeranjang] = useState<ItemKeranjang[]>([]);
    const [kodePromo, setKodePromo] = useState('');
    const [diskon, setDiskon] = useState(0);
    const [pesanPromo, setPesanPromo] = useState('');

    useEffect(() => {
        const data = localStorage.getItem('keranjang');
        if (data) {
            setKeranjang(JSON.parse(data));
        }
    }, []);

    const simpanDanPerbarui = (dataBaru: ItemKeranjang[]) => {
        setKeranjang(dataBaru);
        localStorage.setItem('keranjang', JSON.stringify(dataBaru));
        window.dispatchEvent(new Event("keranjang-berubah"));
    };

    const handleKurang = (id: number) => {
        const dataBaru = keranjang.map((item) => {
            if (item.id === id && item.jumlah > 1) {
                return { ...item, jumlah: item.jumlah - 1 };
            }
            return item;
        });
        simpanDanPerbarui(dataBaru);
    };

    const handleTambah = (id: number) => {
        const dataBaru = keranjang.map((item) => {
            if (item.id === id && item.jumlah < item.stok) {
                return { ...item, jumlah: item.jumlah + 1 };
            }
            return item;
        });
        simpanDanPerbarui(dataBaru);
    };

    const handleHapus = (id: number) => {
        const dataBaru = keranjang.filter((item) => item.id !== id);
        simpanDanPerbarui(dataBaru);
    };

    const subtotal = keranjang.reduce((acc, item) => acc + item.harga * item.jumlah, 0);

    const handlePakaiPromo = () => {
        if (kodePromo.trim().toUpperCase() === 'HEMAT10') {
            if (subtotal >= 20000) {
                const nilaiDiskon = Math.round(subtotal * 0.1);
                setDiskon(nilaiDiskon);
                setPesanPromo('Promo HEMAT10 dipakai: diskon 10%.');
            } else {
                setDiskon(0);
                setPesanPromo('Promo HEMAT10 butuh belanja minimal Rp 20.000.');
            }
        } else {
            setDiskon(0);
            setPesanPromo('Kode promo tidak dikenal.');
        }
    };

    useEffect(() => {
        if (subtotal < 20000 && diskon > 0) {
            setDiskon(0);
            setPesanPromo('Belanja kurang dari Rp 20.000, diskon otomatis dibatalkan.');
        }
    }, [subtotal, diskon]);

    if (keranjang.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-slate-500 mb-4">Keranjang masih kosong</p>
                <Link href="/menu" className="text-blue-600 hover:underline">
                    Lihat Katalog Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
            
            <div className="space-y-4 mb-6">
                {keranjang.map((item) => {
                    const subtotalItem = item.harga * item.jumlah;
                    return (
                        <div key={item.id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{item.nama}</h3>
                                <p className="text-sm text-slate-600">
                                    {rupiah(item.harga)} x {item.jumlah} = {rupiah(subtotalItem)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleKurang(item.id)}
                                    className="px-2 py-1 border rounded bg-slate-100"
                                >
                                    -
                                </button>
                                <span>{item.jumlah}</span>
                                <button
                                    onClick={() => handleTambah(item.id)}
                                    className="px-2 py-1 border rounded bg-slate-100"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => handleHapus(item.id)}
                                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t pt-4 mb-6">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={kodePromo}
                        onChange={(e) => setKodePromo(e.target.value)}
                        placeholder="Masukkan kode promo"
                        className="border px-3 py-1 rounded flex-grow"
                    />
                    <button
                        onClick={handlePakaiPromo}
                        className="bg-slate-800 text-white px-4 py-1 rounded"
                    >
                        Pakai
                    </button>
                </div>
                {pesanPromo && <p className="text-sm text-slate-600">{pesanPromo}</p>}
            </div>

            <div className="border-t pt-4 space-y-1 text-right">
                <p>Subtotal: {rupiah(subtotal)}</p>
                {diskon > 0 && <p className="text-green-600">Diskon: -{rupiah(diskon)}</p>}
                <p className="text-xl font-bold">Total: {rupiah(subtotal - diskon)}</p>
            </div>
        </div>
    );
}