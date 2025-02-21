import NavLinks from "./nav-links";

export default function Header() {
    return (
        <header className="flex justify-between">
            <div>CookBook</div>
            <nav className="flex gap-4">
                <NavLinks />
            </nav>
        </header>
    )
}