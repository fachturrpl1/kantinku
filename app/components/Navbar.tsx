'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const halaman = [
    { href: '/', label : 'Beranda'},
    { href: '/menu', label : 'Menu'},
    { href: '/favorit', label : 'Favorit'},
    { href: '/keranjang', label : 'Keranjang'},
    { href: '/riwayat', label: 'Riwayat'},
]

export default function Navbar() {
    const pathname = usePathname();
    return (
        <nav className="flex items-center border-b px-6 py-3">
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
                
                </Link>
            ))}

        </nav>
    )
}