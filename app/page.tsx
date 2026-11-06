import Link from 'next/link';

export default function Beranda() {
  return(
    <div >
      <section className='py-12 text-center'>
        <h1 className='font-bold text-4xl'>Temukan menu pilihan Anda</h1>
        <p className='mt-3'>
          Makanan, minuman, ada disini.
        </p>
        <Link
          href='/menu'
          className='mt-6 inline-block rounded-lg px-5 py-2 font-medium bg-orange-600 hover:bg-green-600'
        >
          Lihat semua memu
        </Link>
      </section>
    </div>
  )

}