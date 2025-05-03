'use client'

import { signOut, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Person from '@mui/icons-material/PersonOutline';
import PrimaryButton from './buttons/primary-button';
import { Session } from 'next-auth';
import clsx from 'clsx';
import { fetchUnreadInvitationsCountByUser } from '../lib/data/invitations';
import { getUser } from '../lib/data/user';
import { poppins } from './fonts';

const links = [
    { name: 'Books', href: '/books', icon: <MenuBookIcon className='text-[rgb(30,30,30)] flex-shrink-0' /> },
];

export default function NavLinks() {
    const { data: session, status } = useSession() as { data: Session | null, status: string }
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const hamburgerOpen = Boolean(hamburgerAnchorEl);
    const [loggedIn, setLoggedIn] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const router = useRouter();
    const [invitationsCount, setInvitationsCount] = useState<number | null>(null);

    const fetchUserData = useCallback(async () => {
        if (session?.user?.id) {
            const user = await getUser(session.user.id);
            setProfilePhoto(user?.user_image_url || null);
        }
    }, [session?.user?.id]);

    const fetchInvitations = useCallback(async () => {
        const invitationsCount = await fetchUnreadInvitationsCountByUser();
        setInvitationsCount(invitationsCount || 0);
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            setLoggedIn(true);
            fetchUserData();
            fetchInvitations();
        } else {
            setLoggedIn(false);
        }
    }, [status, fetchUserData, fetchInvitations]);

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

    const handleHamburgerClick = (event: React.MouseEvent<HTMLElement>) => {
        setHamburgerAnchorEl(event.currentTarget);
    };

    const handleHamburgerClose = () => {
        setHamburgerAnchorEl(null);
    };

    if (!loggedIn) {
        return (
            <PrimaryButton text="Sign In" onClick={() => { router.push('/login') }} type="button" />
        )
    }
    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
                {links.map((link) => {
                    return (
                        <div key={link.name} className={clsx('flex items-center', { 'glow': pathname === link.href })}>
                            <Link href={link.href}>
                                <p className={`${poppins.className}`}>{link.name}</p>
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
                        className='relative'
                    >
                        {profilePhoto ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <Image src={profilePhoto} alt="Profile Photo" width={32} height={32} />
                            </div>
                        ) : (
                            <Person className='text-[rgb(30,30,30)]' />)}
                        {invitationsCount !== null && invitationsCount > 0 && (
                            <div className='absolute top-[5px] right-[5px] size-3 rounded-full bg-red-500 flex items-center justify-center'></div>
                        )}
                    </IconButton>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden">
                <IconButton
                    onClick={handleHamburgerClick}
                    size="medium"
                    aria-controls={hamburgerOpen ? 'hamburger-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={hamburgerOpen ? 'true' : undefined}
                >
                    <MenuIcon className='text-[rgb(30,30,30)]' />
                </IconButton>
            </div>

            {/* Profile Menu (Desktop) */}
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
                    <div className="flex items-center gap-2 w-full">
                        {profilePhoto ? (
                            <div className="size-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image src={profilePhoto} alt="Profile Photo" width={32} height={32} />
                            </div>
                        ) : (
                            <div className='flex items-center justify-center size-8'>
                                <Person className='text-[rgb(30,30,30)] flex-shrink-0' />
                            </div>
                        )}
                        <Link href="/profile" className={`w-full ${poppins.className}`}>
                            <span className={`hidden sm:inline ${poppins.className}`}>Profile</span>
                        </Link>
                    </div>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <div className="flex items-center gap-2 w-full">
                        <div className='flex items-center justify-center size-8 relative'>
                            <NotificationsIcon className='text-[rgb(30,30,30)] flex-shrink-0' />
                            {invitationsCount !== null && invitationsCount > 0 && (
                                <div className='absolute top-0 right-0 size-4 rounded-full bg-red-500 flex items-center justify-center'>
                                    <span className='text-white text-xs'>{invitationsCount}</span>
                                </div>
                            )}
                        </div>
                        <Link href="/notifications" className={`w-full ${poppins.className}`}>
                            <span className={`hidden sm:inline ${poppins.className}`}>Notifications</span>
                        </Link>
                    </div>
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
                    <div className="flex items-center gap-2 w-full">
                        <div className='flex items-center justify-center size-8'>
                            <LogoutIcon className='text-[rgb(30,30,30)] flex-shrink-0' />
                        </div>
                        <span className={`hidden sm:inline ${poppins.className}`}>Sign Out</span>
                    </div>
                </MenuItem>
            </Menu>

            {/* Hamburger Menu (Mobile) */}
            <Menu
                anchorEl={hamburgerAnchorEl}
                id="hamburger-menu"
                open={hamburgerOpen}
                onClose={handleHamburgerClose}
                onClick={handleHamburgerClose}
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
                {links.map((link) => (
                    <MenuItem key={link.name} onClick={handleHamburgerClose}>
                        <div className="flex items-center gap-2 w-full">
                            <div className='flex items-center justify-center size-8'>
                                {link.icon}
                            </div>
                            <Link href={link.href} className={`w-full ${poppins.className}`}>
                                {link.name}
                            </Link>
                        </div>
                    </MenuItem>
                ))}
                <MenuItem onClick={handleHamburgerClose}>
                    <div className="flex items-center gap-2 w-full">
                        <div className='flex items-center justify-center size-8 relative'>
                            <NotificationsIcon className='text-[rgb(30,30,30)] flex-shrink-0' />
                            {invitationsCount !== null && invitationsCount > 0 && (
                                <div className='absolute top-0 right-0 size-4 rounded-full bg-red-500 flex items-center justify-center'>
                                    <span className='text-white text-xs'>{invitationsCount}</span>
                                </div>
                            )}
                        </div>
                        <Link href="/notifications" className={`w-full ${poppins.className}`}>
                            Notifications
                        </Link>
                    </div>
                </MenuItem>
                <MenuItem onClick={handleHamburgerClose}>
                    <div className="flex items-center gap-2 w-full">
                        <div className='flex items-center justify-center size-8'>
                            <Person className='text-[rgb(30,30,30)] flex-shrink-0' />
                        </div>
                        <Link href="/profile" className={`w-full ${poppins.className}`}>
                            Profile
                        </Link>
                    </div>
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
                    <div className="flex items-center gap-2 w-full">
                        <div className='flex items-center justify-center size-8'>
                            <LogoutIcon className='text-[rgb(30,30,30)] flex-shrink-0' />
                        </div>
                        <span className={poppins.className}>Sign Out</span>
                    </div>
                </MenuItem>
            </Menu>
        </>
    );
}
