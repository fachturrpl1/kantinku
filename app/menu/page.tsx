'use client'

import KatalogMenu from "@/app/components/KatalogMenu";
import { menu } from "@/data/menu";

export default function HalamanMenu() {
    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Katalog Menu KantinKu</h1>
            <KatalogMenu menu={menu} /> 
        </main>
    );
}