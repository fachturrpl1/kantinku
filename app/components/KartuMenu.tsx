'use client'

import { useState } from 'react'
import { type Menu, rupiah } from '@/data/menu'
import Link from 'next/link'

export default function KartuMenu({ menu }: { menu: Menu }) {
    const sisa = menu.stok;
    
    const [isFavorit, setIsFavorit] = useState(() => {
        if (typeof window === 'undefined') return false;
        const favoritList = JSON.parse(localStorage.getItem('favorit') || '[]');
        return favoritList.includes(menu.id);
    });

    const toggleFavorit = (e: React.MouseEvent) => {
        e.preventDefault(); // Mencegah pindah halaman saat tombol diklik
        const favoritList = JSON.parse(localStorage.getItem('favorit') || '[]');
        let daftarBaru;
        if (isFavorit) {
            daftarBaru = favoritList.filter((id: number) => id !== menu.id);
        } else {
            daftarBaru = [...favoritList, menu.id];
        }
        localStorage.setItem('favorit', JSON.stringify(daftarBaru));
        setIsFavorit(!isFavorit);
    };

    return (
        <div className={`border border-slate-700 bg-slate-900 p-4 rounded shadow-sm text-slate-100 relative ${sisa === 0 ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <span className='rounded bg-orange-950 text-orange-400 px-2 py-0.5 text-xs font-semibold'>{menu.kategori}</span>
                <button 
                    onClick={toggleFavorit}
                    className="text-lg text-orange-400 hover:scale-110 transition-transform"
                    title="Favorit"
                >
                    {isFavorit ? '♥' : '♡'}
                </button>
            </div>
            
            <h3 className='text-lg font-semibold text-slate-100'>{menu.nama}</h3>
            <p className='mt-1 font-medium text-slate-200'>{rupiah(menu.harga)}</p>
            
            <p className={`text-sm mt-1 mb-3 ${sisa === 0 ? 'text-red-400 font-semibold' : 'text-green-400'}`}>
                {sisa == 0 ? 'Stok Habis' : `Stok sisa ${sisa}`}
            </p>

            <Link
                href={`/menu/${menu.id}`}
                className={`inline-block text-sm font-semibold ${sisa === 0 ? 'text-slate-500 pointer-events-none' : 'text-orange-400 hover:underline'}`}
            >
                Lihat detail &rarr;
            </Link>
        </div>
    )
}