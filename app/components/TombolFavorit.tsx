'use client'

import { useState } from 'react'

export default function TombolFavorit({ menuId }: { menuId: number }) {
    // Inisialisasi state langsung dari localStorage agar bebas dari peringatan useEffect
    const [isFavorit, setIsFavorit] = useState(() => {
        if (typeof window === 'undefined') return false;
        const favoritList = JSON.parse(localStorage.getItem('favorit') || '[]');
        return favoritList.includes(menuId);
    });

    const toggleFavorit = () => {
        const favoritList = JSON.parse(localStorage.getItem('favorit') || '[]');
        let daftarBaru;
        if (isFavorit) {
            daftarBaru = favoritList.filter((id: number) => id !== menuId);
        } else {
            daftarBaru = [...favoritList, menuId];
        }
        localStorage.setItem('favorit', JSON.stringify(daftarBaru));
        setIsFavorit(!isFavorit);
    };

    return (
        <button
            onClick={toggleFavorit}
            className="mt-4 px-4 py-2 border border-slate-700 rounded bg-slate-800 text-slate-100 hover:bg-slate-700 flex items-center gap-2 transition-colors"
        >
            {isFavorit ? '♥ Favorit' : '♡ Tambah favorit'}
        </button>
    );
}