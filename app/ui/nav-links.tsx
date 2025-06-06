'use client'

import { signOut, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import LoginIcon from '@mui/icons-material/Login';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import NavHamburger from './nav-hamburger';
import { NavLink } from '../types/definitions';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Person from '@mui/icons-material/PersonOutline';
import PrimaryButton from './buttons/primary-button';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Session } from 'next-auth';
import clsx from 'clsx';
import { fetchUnreadBookInvitationsCountByUser } from '../lib/data/recipebookinvitations';
import { fetchUnreadRecipeInvitationsCountByUser } from '../lib/data/recipeinvitations';
import { getUserPublicInfo } from '../lib/data/user';

const defaultLinks: NavLink[] = [
    { name: 'Recipes', href: '/recipe', icon: <RestaurantIcon className='text-[rgb(30,30,30)] flex-shrink-0' /> },
    { name: 'Books', href: '/books', icon: <MenuBookIcon className='text-[rgb(30,30,30)] flex-shrink-0' /> },
    { name: 'Notifications', href: '/notifications', icon: <NotificationsIcon className='text-[rgb(30,30,30)] flex-shrink-0' /> },
    { name: 'Profile', href: '/profile', icon: <Person className='text-[rgb(30,30,30)] flex-shrink-0' /> },
    { name: 'Sign In', href: '/login', icon: <LoginIcon className='text-[rgb(30,30,30)] flex-shrink-0' /> },
];

interface NavLinksProps {
    width: number;
    searchBarWidth: number;
}

export default function NavLinks({ width, searchBarWidth }: NavLinksProps) {
    const { data: session, status } = useSession() as { data: Session | null, status: string }
    const pathname = usePathname();
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const router = useRouter();
    const [invitationsCount, setInvitationsCount] = useState<number | null>(null);
    const [links, setLinks] = useState<NavLink[]>(defaultLinks);

    const [visibleLinks, setVisibleLinks] = useState(0);
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    const fetchUserData = useCallback(async () => {
        if (session?.user?.id) {
            const userPublicInfo = await getUserPublicInfo(session.user.id);
            setProfilePhoto(userPublicInfo?.user_image_url || null);
        }
    }, [session?.user?.id]);

    const fetchInvitations = useCallback(async () => {
        const invitationsCount = (await fetchUnreadBookInvitationsCountByUser()) + (await fetchUnreadRecipeInvitationsCountByUser());
        setInvitationsCount(invitationsCount || 0);
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            setLinks(defaultLinks.map(link => ({ ...link, name: link.name.replace('Sign In', 'Sign Out') })));
            fetchUserData();
            fetchInvitations();

        } else {
            setLinks(defaultLinks.filter(link => link.name === "Recipes" || link.name === "Books" || link.name === "Sign In"));
        }
    }, [status, fetchUserData, fetchInvitations]);

    useEffect(() => {
        if (width > 0) {
            setVisibleLinks(Math.floor((width - searchBarWidth) / 100) - 1);
        }
    }, [width, searchBarWidth]);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div className='flex items-center gap-4'>
            {links.slice(0, visibleLinks).map((link, index) => (
                link.name === 'Sign In' ? (
                    <PrimaryButton key={index} onClick={() => router.push('/login')} type="button" text="Sign In" />
                ) : (<button
                    key={index}
                    onClick={() => {
                        if (link.name === 'Sign Out') {
                            handleSignOut();
                        } else if (link.name === 'Profile' && session?.user?.id) {
                            router.push(`/profile/${session.user.id}`);
                        } else {
                            router.push(link.href);
                        }
                    }}
                    className={clsx('flex items-center cursor-pointer', { 'glow': pathname === link.href || (link.name === 'Profile' && pathname === `/profile/${session?.user?.id}`) })}>
                    {link.name}
                </button>
                )))}
            {visibleLinks < links.length && (
                <div className='relative'>
                    <MenuIcon onClick={() => setHamburgerOpen(!hamburgerOpen)} className='hover:cursor-pointer' />
                    {hamburgerOpen && (
                        <div className='absolute top-full right-0 mt-2 bg-white shadow-lg hover:cursor-pointer z-10 rounded-lg'>
                            <NavHamburger
                                links={links.slice(visibleLinks, links.length)}
                                closeHamburger={() => setHamburgerOpen(false)}
                                handleSignOut={handleSignOut}
                                profilePhoto={profilePhoto}
                                invitationsCount={invitationsCount || 0}
                                userId={session?.user?.id || null}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}