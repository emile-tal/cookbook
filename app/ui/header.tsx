import Link from "next/link";
import NavLinks from "./nav-links";

export default function Header() {
    return (
        <header className="bg-background text-text bg-opacity-85">
            <div className="py-8 md:py-12 flex items-center justify-between container-spacing text-l md:text-xl">
                <Link href='/'><div>CookBook</div></Link>
                <nav className="flex gap-12">
                    <NavLinks />
                </nav>
            </div>
        </header>
    )
}