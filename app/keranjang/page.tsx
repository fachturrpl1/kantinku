'use client'

import { useState } from 'react'
import { rupiah } from '@/data/menu'
import Link from 'next/link'

interface ItemKeranjang {
    id: number;
    nama: string;
    harga: number;
    jumlah: number;
    stok: number;
}

interface StrukPesanan {
    id: number;
    nama: string;
    kelas: string;
    metode: string;
    item: ItemKeranjang[];
    subtotal: number;
    diskon: number;
    ongkir: number;
    total: number;
    tanggal: string;
}

export default function HalamanKeranjang() {
    // 1. Menggunakan Lazy Initial State untuk menghindari setState di useEffect
    const [keranjang, setKeranjang] = useState<ItemKeranjang[]>(() => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem('keranjang');
        return data ? JSON.parse(data) : [];
    });

    const [inputPromo, setInputPromo] = useState('');
    const [promoAktif, setPromoAktif] = useState(false);
    const [pesanPromo, setPesanPromo] = useState('');
    
    const [metodeKirim, setMetodeKirim] = useState('ambil');
    const [namaPemesan, setNamaPemesan] = useState('');
    const [kelas, setKelas] = useState('');
    const [pesanError, setPesanError] = useState('');

    // 2. Tipe data terdefinisi eksplisit tanpa 'any'
    const [strukData, setStrukData] = useState<StrukPesanan | null>(null);

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
        if (inputPromo.trim().toUpperCase() === 'HEMAT10') {
            if (subtotal >= 20000) {
                setPromoAktif(true);
                setPesanPromo('Promo HEMAT10 dipakai: diskon 10%.');
            } else {
                setPromoAktif(false);
                setPesanPromo('Promo HEMAT10 butuh belanja minimal Rp 20.000.');
            }
        } else {
            setPromoAktif(false);
            setPesanPromo('Kode promo tidak dikenal.');
        }
    };

    const diskon = (promoAktif && subtotal >= 20000) ? Math.round(subtotal * 0.1) : 0;
    const ongkir = metodeKirim === 'diantar' ? 2000 : 0;
    const totalBayar = subtotal - diskon + ongkir;

    const handlePesanSekarang = (e: React.FormEvent) => {
        e.preventDefault();
        if (namaPemesan.trim().length < 3) {
            setPesanError('Nama pemesan wajib diisi minimal 3 huruf.');
            return;
        }
        if (metodeKirim === 'diantar' && kelas.trim().length < 3) {
            setPesanError('Kelas wajib diisi minimal 3 karakter jika diantar.');
            return;
        }

        // 3. Menyiapkan ID & Waktu secara eksplisit saat submit event
        const pesananId = Number(new Date().getTime());
        const waktuSekarang = new Date().toLocaleString();

        const dataPesananBaru: StrukPesanan = {
            id: pesananId,
            nama: namaPemesan,
            kelas: metodeKirim === 'diantar' ? kelas : '-',
            metode: metodeKirim,
            item: keranjang,
            subtotal,
            diskon,
            ongkir,
            total: totalBayar,
            tanggal: waktuSekarang
        };

        const riwayatLama = JSON.parse(localStorage.getItem('riwayat') || '[]');
        localStorage.setItem('riwayat', JSON.stringify([dataPesananBaru, ...riwayatLama]));

        setStrukData(dataPesananBaru);
        localStorage.removeItem('keranjang');
        setKeranjang([]);
        window.dispatchEvent(new Event("keranjang-berubah"));
        setPesanError('');
    };

    if (strukData) {
        return (
            <div className="p-6 max-w-xl mx-auto border border-slate-700 rounded shadow bg-slate-900 text-slate-100 mt-6">
                <h1 className="text-2xl font-bold text-green-500 mb-2">Pesanan Berhasil!</h1>
                <p className="mb-4 text-slate-300">Terima kasih, <strong>{strukData.nama}</strong>.</p>
                
                <div className="border-t border-slate-700 border-b py-3 space-y-2 mb-4">
                    <p className="text-sm font-semibold text-slate-200">Rincian Pesanan:</p>
                    {strukData.item.map((i: ItemKeranjang) => (
                        <div key={i.id} className="flex justify-between text-sm text-slate-300">
                            <span>{i.nama} x{i.jumlah}</span>
                            <span>{rupiah(i.harga * i.jumlah)}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 text-sm text-right mb-6 text-slate-300">
                    <p>Subtotal: {rupiah(strukData.subtotal)}</p>
                    {strukData.diskon > 0 && <p className="text-green-400">Diskon: -{rupiah(strukData.diskon)}</p>}
                    <p>Ongkir: {rupiah(strukData.ongkir)}</p>
                    <p className="text-base font-bold text-slate-100">Total bayar: {rupiah(strukData.total)}</p>
                    <p className="text-xs text-slate-400 mt-2">
                        {strukData.metode === 'diantar' ? `Diantar ke kelas: ${strukData.kelas}` : 'Ambil sendiri di kantin'}
                    </p>
                </div>

                <Link href="/menu" className="block text-center bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700">
                    Kembali ke Menu
                </Link>
            </div>
        );
    }

    if (keranjang.length === 0) {
        return (
            <div className="p-6 text-center text-slate-300">
                <p className="mb-4">Keranjang masih kosong</p>
                <Link href="/menu" className="text-orange-500 hover:underline">
                    Lihat Katalog Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto text-slate-100">
            <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>

            <div className="space-y-4 mb-6">
                {keranjang.map((item) => {
                    const subtotalItem = item.harga * item.jumlah;
                    return (
                        <div key={item.id} className="border border-slate-700 bg-slate-900 p-4 rounded flex justify-between items-center shadow-sm">
                            <div>
                                <h3 className="font-semibold text-slate-100">{item.nama}</h3>
                                <p className="text-sm text-slate-400">
                                    {rupiah(item.harga)} x {item.jumlah} = {rupiah(subtotalItem)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleKurang(item.id)} className="px-2 py-1 border border-slate-600 rounded bg-slate-800 text-slate-200 hover:bg-slate-700">-</button>
                                <span className="text-slate-100">{item.jumlah}</span>
                                <button onClick={() => handleTambah(item.id)} className="px-2 py-1 border border-slate-600 rounded bg-slate-800 text-slate-200 hover:bg-slate-700">+</button>
                                <button onClick={() => handleHapus(item.id)} className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Hapus</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bagian Kode Promo */}
            <div className="border-t border-slate-700 pt-4 mb-6">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={inputPromo}
                        onChange={(e) => setInputPromo(e.target.value)}
                        placeholder="Masukkan kode promo"
                        className="border border-slate-700 bg-slate-900 px-3 py-1 rounded flex-grow text-slate-100 placeholder-slate-500"
                    />
                    <button onClick={handlePakaiPromo} className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-1 rounded hover:bg-slate-700">Pakai</button>
                </div>
                {pesanPromo && <p className="text-sm text-slate-400">{pesanPromo}</p>}
            </div>

            {/* Bagian Pilihan Cara Ambil */}
            <div className="border-t border-slate-700 pt-4 mb-6 space-y-2">
                <p className="font-semibold text-slate-200">Cara Ambil:</p>
                <div className="flex gap-4 text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="metode" checked={metodeKirim === 'ambil'} onChange={() => setMetodeKirim('ambil')} />
                        Ambil sendiri
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="metode" checked={metodeKirim === 'diantar'} onChange={() => setMetodeKirim('diantar')} />
                        Diantar (+Rp 2.000)
                    </label>
                </div>
            </div>

            {/* Formulir Pemesan & Tombol Pesan */}
            <form onSubmit={handlePesanSekarang} className="border-t border-slate-700 pt-4 space-y-4">
                {metodeKirim === 'diantar' && (
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-200">Kelas Tujuan:</label>
                        <input
                            type="text"
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            placeholder="Contoh: X IPA 1"
                            className="border border-slate-700 bg-slate-900 px-3 py-2 rounded w-full text-slate-100 placeholder-slate-500"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-200">Nama Pemesan:</label>
                    <input
                        type="text"
                        value={namaPemesan}
                        onChange={(e) => setNamaPemesan(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="border border-slate-700 bg-slate-900 px-3 py-2 rounded w-full text-slate-100 placeholder-slate-500"
                    />
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-1 text-right text-slate-300">
                    <p>Subtotal: {rupiah(subtotal)}</p>
                    {diskon > 0 && <p className="text-green-400">Diskon: -{rupiah(diskon)}</p>}
                    {metodeKirim === 'diantar' && <p>Ongkir: {rupiah(ongkir)}</p>}
                    <p className="text-xl font-bold text-slate-100">Total: {rupiah(totalBayar)}</p>
                </div>

                {pesanError && <p className="text-sm text-red-400">{pesanError}</p>}

                <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700">
                    Pesan Sekarang
                </button>
            </form>
        </div>
    );
}