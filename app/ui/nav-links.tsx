'use client'

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Person from '@mui/icons-material/PersonOutline';
import clsx from 'clsx';

const links = [
    { name: 'My Books', href: '/books' },
];

export default function NavLinks() {
    const { data: session, status } = useSession()
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [status]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' });
        handleClose();
    };

    return (
        <>
            {loggedIn &&
                links.map((link) => {
                    return (
                        <div key={link.name} className={clsx('flex items-center', { 'glow': pathname === link.href })}>
                            <Link href={link.href}>
                                <p className="md:block">{link.name}</p>
                            </Link>
                        </div>
                    );
                })
            }
            <div className={clsx({ 'glow': pathname === '/profile' })}>
                <IconButton
                    onClick={handleClick}
                    size="medium"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Person className='md:l text-[rgb(30,30,30)]' />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: 1.5,
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                '& .MuiList-root': {
                                    padding: 0,
                                }
                            }
                        }
                    }}
                >
                    <MenuItem onClick={handleClose}>
                        <Link href="/profile" className="w-full">
                            Profile
                        </Link>
                    </MenuItem>
                    <MenuItem
                        onClick={loggedIn ? handleSignOut : () => { router.push('/login') }}
                        sx={{
                            backgroundColor: '#fff5f5',
                            '&:hover': {
                                backgroundColor: '#ffe5e5',
                            },
                            margin: 0,
                            borderRadius: 0,
                            '&:last-child': {
                                borderRadius: '0 0 4px 4px',
                            }
                        }}
                    >
                        {loggedIn ? 'Sign Out' : 'Sign In'}
                    </MenuItem>
                </Menu>
            </div>
        </>
    );
}
