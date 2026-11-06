import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";
import Link from "next/link";
import FormPesan from "@/app/components/FormPesan";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailMenu({ params }: PageProps) {
  const { id } = await params;
  const menuItem = menu.find((item) => item.id === Number(id));
  if (!menuItem) notFound();

  const menuTerkait = menu.filter(
    (item) => item.kategori === menuItem.kategori && item.id !== menuItem.id
  );

  return (
    <article className="p-6 max-w-xl mx-auto">
      <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-600 rounded mb-2">
        {menuItem.kategori}
      </span>
      <h1 className="text-3xl font-bold mb-1">{menuItem.nama}</h1>
      <p className="text-lg font-semibold text-slate-800">{rupiah(menuItem.harga)}</p>
      <p className="text-sm text-slate-600 mb-4">
        Stok: {menuItem.stok === 0 ? "Habis" : menuItem.stok}
      </p>

      <FormPesan menu={menuItem} />

      <div className="mt-8 border-t pt-4">
        <h3 className="mb-2 text-lg font-semibold">Menu Terkait</h3>
        {menuTerkait.length === 0 ? (
          <p className="text-slate-500">Belum ada menu terkait.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {menuTerkait.map((item) => (
              <li key={item.id}>
                <Link href={`/menu/${item.id}`} className="text-blue-600 hover:underline">
                  {item.nama}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <Link href="/menu" className="text-blue-600 hover:underline">
          &larr; Kembali ke Katalog
        </Link>
      </div>
    </article>
  );
}