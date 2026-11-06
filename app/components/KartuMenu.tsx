import { type Menu, rupiah } from '@/data/menu'
import Link from 'next/link'

export default function KartuMenu({ menu } : { menu : Menu }) {
    const sisa = menu.stok
    return(
        <div className="border p-4 shadow-sm">
            <span className='rounded bg-orange-100 text-orange-600 px-2 py-0.5 text-xs'>{menu.kategori}</span>
            <h3 className='ml-2 text-lg font-semibold'>{menu.nama}</h3>
            <p className='mt-2 font-medium'>{rupiah(menu.harga)}</p>
            <p
                className={
                    sisa === 0 ? 'text-red-600' : 'text-green-600'
                }
            >{sisa == 0 ? 'Stok Habis' : `Stok sisa ${sisa}`}</p>
            <Link
                href={`/menu/${menu.id}`}
                className='text-blue-600 hover:underline'
            >
                Lihat detail
            </Link>
        </div>
    )
}