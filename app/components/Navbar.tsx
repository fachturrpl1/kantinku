'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ItemKeranjang {
    id: number;
    nama: string;
    harga: number;
    jumlah: number;
    stok: number;
}

export default function Navbar() {
    const pathname = usePathname();
    const [jumlahItem, setJumlahItem] = useState(0);

    useEffect(() => {
        const hitung = () => {
            const data = localStorage.getItem('keranjang');
            if (data) {
                const keranjang: ItemKeranjang[] = JSON.parse(data);
                const total = keranjang.reduce((acc, item) => acc + item.jumlah, 0);
                setJumlahItem(total);
            } else {
                setJumlahItem(0);
            }
        };

        hitung();
        window.addEventListener("keranjang-berubah", hitung);

        return () => {
            window.removeEventListener("keranjang-berubah", hitung);
        };
    }, []);

    const halaman = [
        { href: '/', label: 'Beranda' },
        { href: '/menu', label: 'Menu' },
        { href: '/favorit', label: 'Favorit' },
        { href: '/keranjang', label: `Keranjang${jumlahItem > 0 ? ` (${jumlahItem})` : ''}` },
        { href: '/riwayat', label: 'Riwayat' },
    ];

    return (
        <div>
            <nav className="flex items-center gap-6 border-b border-slate-700 px-6 py-3 bg-slate-900 text-slate-100">
                <span className="text-lg font-bold text-orange-500">
                    KantinKu
                </span>
                {halaman.map((p) => (
                    <Link
                        key={p.href}
                        href={p.href}
                        className={
                            pathname === p.href
                            ? "font-semibold text-orange-400"
                            : "text-slate-400 hover:text-orange-400"
                        }
                    >
                        {p.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}