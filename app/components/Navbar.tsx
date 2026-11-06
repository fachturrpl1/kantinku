'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const pathname = usePathname();
    const [jumlahItem, setJumlahItem] = useState(0);

    useEffect(() => {
        const hitung = () => {
            const data = localStorage.getItem('keranjang');
            if (data) {
                const keranjang = JSON.parse(data);
                const total = keranjang.reduce((acc: number, item: any) => acc + item.jumlah, 0);
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
            <nav className="flex items-center gap-6 border-b px-6 py-3">
                <span className="text-lg font-bold text-orange-600">
                    KantinKu
                </span>
                {halaman.map((p) => (
                    <Link
                        key={p.href}
                        href={p.href}
                        className={
                            pathname === p.href
                            ? "font-semibold text-orange-500"
                            : "text-slate-600 hover:text-orange-500"
                        }
                    >
                        {p.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}