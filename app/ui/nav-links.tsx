'use client'

import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Person from '@mui/icons-material/PersonOutline';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
    { name: 'Explore', href: '/explore' },
    { name: 'My Books', href: '/books' },
];

export default function NavLinks() {
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
        handleClose();
    };

    return (
        <>
            {links.map((link) => {
                return (
                    <div key={link.name} className={clsx('flex items-center', { 'glow': pathname === link.href })}>
                        <Link href={link.href}>
                            <p className="md:block">{link.name}</p>
                        </Link>
                    </div>
                );
            })}
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
                        onClick={handleSignOut}
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
                        Sign Out
                    </MenuItem>
                </Menu>
            </div>
        </>
    );
}
