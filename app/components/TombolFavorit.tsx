'use client'

import { useState, useEffect } from 'react'

export default function TombolFavorit({ menuId }: { menuId: number }) {
    const [isFavorit, setIsFavorit] = useState(false);

    useEffect(() => {
        const favoritList = JSON.parse(localStorage.getItem('favorit') || '[]');
        setIsFavorit(favoritList.includes(menuId));
    }, [menuId]);

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
            className="mt-4 px-4 py-2 border border-slate-700 rounded bg-slate-800 text-slate-100 hover:bg-slate-700 flex items-center gap-2"
        >
            {isFavorit ? '♥ Favorit' : '♡ Tambah favorit'}
        </button>
    );
}