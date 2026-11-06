import { type Menu, rupiah } from '@/data/menu'
import Link from 'next/link'

export default function KartuMenu({ menu } : { menu : Menu }) {
    const sisa = menu.stok
    return(
        <div className="border border-slate-700 bg-slate-900 p-4 rounded shadow-sm text-slate-100">
            <span className='rounded bg-orange-950 text-orange-400 px-2 py-0.5 text-xs font-semibold'>{menu.kategori}</span>
            <h3 className='mt-2 text-lg font-semibold text-slate-100'>{menu.nama}</h3>
            <p className='mt-1 font-medium text-slate-200'>{rupiah(menu.harga)}</p>
            <p
                className={`text-sm mt-1 mb-3 ${
                    sisa === 0 ? 'text-red-400 font-semibold' : 'text-green-400'
                }`}
            >
                {sisa == 0 ? 'Stok Habis' : `Stok sisa ${sisa}`}
            </p>
            <Link
                href={`/menu/${menu.id}`}
                className='inline-block text-orange-400 hover:underline text-sm font-semibold'
            >
                Lihat detail &rarr;
            </Link>
        </div>
    )
}