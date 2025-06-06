import Image from "next/image";
import { NavLink } from "../types/definitions";
import { useRouter } from "next/navigation";

interface NavHamburgerProps {
    links: NavLink[];
    closeHamburger: () => void;
    handleSignOut: () => void;
    profilePhoto: string | null;
    invitationsCount: number;
    userId: string | null;
}

export default function NavHamburger({ links, closeHamburger, handleSignOut, profilePhoto, invitationsCount, userId }: NavHamburgerProps) {
    const router = useRouter();

    const renderIcon = (link: NavLink) => {
        if (link.name === 'Profile' && profilePhoto) {
            return (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image src={profilePhoto} alt="Profile Photo" width={32} height={32} />
                </div>
            );
        } else if (link.name === 'Notifications' && invitationsCount > 0) {
            return (
                <div className="relative">
                    {link.icon}
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-4 min-h-4 flex items-center justify-center">
                        <span className='text-white text-xs'>{invitationsCount}</span>
                    </div>
                </div>
            );
        } else {
            return link.icon;
        }
    };

    return (
        <div className="min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-100">
            {links.map((link, index) => (
                <div
                    key={index}
                    onClick={() => {
                        if (link.name === 'Sign Out') {
                            handleSignOut();
                        } else if (link.name === 'Profile' && userId) {
                            router.push(`/profile/${userId}`);
                        } else {
                            router.push(link.href);
                        }
                        closeHamburger();
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-[rgb(30,30,30)] text-base rounded-lg"
                >
                    <div className="flex-shrink-0">
                        {renderIcon(link)}
                    </div>
                    <span>{link.name}</span>
                </div>
            ))}
        </div>
    );
}