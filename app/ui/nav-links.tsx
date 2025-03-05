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
    console.log(pathname)

    return (
        <>
            {links.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            { 'glow': pathname === link.href },
                        )}
                    >
                        <p className="md:block">{link.name}</p>
                    </Link>
                );
            })}
            <Link href='/account' className={clsx({ 'glow': pathname === '/account' })}>
                <Person className='md:l' />
            </Link>
        </>
    );
}
