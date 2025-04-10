'use client'

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { Invitation } from '../types/definitions';
import Link from 'next/link';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Person from '@mui/icons-material/PersonOutline';
import clsx from 'clsx';
import { fetchUnreadInvitationsByUser } from '../lib/data/invitations';
import { getUser } from '../lib/data/user';

const links = [
    { name: 'My Books', href: '/books' },
];

export default function NavLinks() {
    const { data: session, status } = useSession()
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [loggedIn, setLoggedIn] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const router = useRouter();
    const [invitations, setInvitations] = useState<Invitation[] | null>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            setLoggedIn(true);
            fetchUserData()
            fetchInvitations()
        } else {
            setLoggedIn(false);
        }
    }, [status]);

    const fetchUserData = async () => {
        if (session?.user?.id) {
            const user = await getUser(session?.user?.id);
            setProfilePhoto(user?.user_image_url || null);
        }
    }

    const fetchInvitations = async () => {
        const invitations = await fetchUnreadInvitationsByUser();
        console.log(invitations)
        setInvitations(invitations);
    }

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
                    className='relative'
                >
                    {profilePhoto ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image src={profilePhoto} alt="Profile Photo" width={32} height={32} />
                        </div>
                    ) : (
                        <Person className='text-[rgb(30,30,30)]' />)}
                    {invitations && invitations.length > 0 && (
                        <div className='absolute top-[5px] right-[5px] size-3 rounded-full bg-red-500 flex items-center justify-center'></div>
                    )}
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
                            <Link href="/profile" className="w-full">
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                        </div>
                    </MenuItem>
                    {loggedIn && (
                        <MenuItem onClick={handleClose}>
                            <div className="flex items-center gap-2 w-full">
                                <div className='flex items-center justify-center size-8 relative'>
                                    <NotificationsIcon className='text-[rgb(30,30,30)] flex-shrink-0' />
                                    {invitations && invitations.length > 0 && (
                                        <div className='absolute top-0 right-0 size-4 rounded-full bg-red-500 flex items-center justify-center'>
                                            <span className='text-white text-xs'>{invitations.length}</span>
                                        </div>
                                    )}
                                </div>
                                <Link href="/notifications" className="w-full">
                                    <span className="hidden sm:inline">Notifications</span>
                                </Link>
                            </div>
                        </MenuItem>
                    )}
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
                        <div className="flex items-center gap-2 w-full">
                            <div className='flex items-center justify-center size-8'>
                                {loggedIn ?
                                    <LogoutIcon className='text-[rgb(30,30,30)] flex-shrink-0' /> :
                                    <LoginIcon className='text-[rgb(30,30,30)] flex-shrink-0' />
                                }
                            </div>
                            <span className="hidden sm:inline">{loggedIn ? 'Sign Out' : 'Sign In'}</span>
                        </div>
                    </MenuItem>
                </Menu>
            </div>
        </>
    );
}
