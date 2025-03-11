'use client'

import Link from 'next/link';
import Person from '@mui/icons-material/PersonOutline';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const links = [
    { name: 'Explore', href: '/explore' },
    { name: 'My Books', href: '/books' },
];

export default function NavLinks() {
    const pathname = usePathname()

    return (
        <>
            {links.map((link) => {
                return (
                    <div key={link.name} className={clsx({ 'glow': pathname === link.href })}>
                        <Link href={link.href}>
                            <p className="md:block">{link.name}</p>
                        </Link>
                    </div>
                );
            })}
            <div className={clsx({ 'glow': pathname === '/account' })}>
                <Link href='/account' className={clsx({ 'glow': pathname === '/account' })}>
                    <Person className='md:l' />
                </Link>
            </div>
        </>
    );
}
