'use client'

import { useState, useEffect } from 'react'
import { Menu, rupiah } from '@/data/menu'
import Link from 'next/link'

export default function HalamanFavorit() {
    const [favoritIds] = useState<number[]>(() => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('favorit') || '[]');
    });

    const [menuList, setMenuList] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/menu')
            .then((res) => {
                if (!res.ok) throw new Error('Gagal memuat data menu');
                return res.json();
            })
            .then((data) => {
                setMenuList(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6 text-slate-300">Memuat...</div>;
    if (error) return <div className="p-6 text-red-400">Gagal: {error}</div>;

    const menuFavorit = menuList.filter((item) => favoritIds.includes(item.id));

    if (menuFavorit.length === 0) {
        return (
            <div className="p-6 text-center text-slate-300">
                <p className="mb-4">Belum ada menu favorit.</p>
                <Link href="/menu" className="text-orange-500 hover:underline">
                    Lihat Katalog Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto text-slate-100 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Menu Favorit</h1>
            <div className="space-y-3">
                {menuFavorit.map((item) => (
                    <div key={item.id} className="border border-slate-700 bg-slate-900 p-4 rounded flex justify-between items-center shadow-sm">
                        <div>
                            <span className='rounded bg-orange-950 text-orange-400 px-2 py-0.5 text-xs font-semibold'>{item.kategori}</span>
                            <h3 className="font-semibold text-slate-100 mt-1">{item.nama}</h3>
                            <p className="text-sm text-slate-400">{rupiah(item.harga)}</p>
                        </div>
                        <Link href={`/menu/${item.id}`} className="text-orange-400 hover:underline text-sm font-semibold">
                            Lihat Detail &rarr;
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}