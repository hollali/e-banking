import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Sidebar = ({user}:SiderbarProps) => {
  return (
    <section>
        <nav className='flex flex-col gap-4'>
            <Link href="/"className='mb-12 cursor-pointer items-center gap-2'>
            <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
            />
            </Link>
        </nav>
    </section>
  )
}

export default Sidebar