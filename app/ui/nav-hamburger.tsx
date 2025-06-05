import { NavLink } from "../types/definitions";
import clsx from 'clsx';
import { useRouter } from "next/navigation";

interface NavHamburgerProps {
    links: NavLink[];
    closeHamburger: () => void;
}

export default function NavHamburger({ links, closeHamburger }: NavHamburgerProps) {
    const router = useRouter();

    return (
        <div className="min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-100">
            {links.map((link, index) => (
                <div
                    key={index}
                    onClick={() => { router.push(link.href); closeHamburger(); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-[rgb(30,30,30)] text-base rounded-lg"
                >
                    <div className="flex-shrink-0">{link.icon}</div>
                    <span>{link.name}</span>
                </div>
            ))}
        </div>
    );
}