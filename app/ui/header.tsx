'use client'

import Link from "next/link";
import NavLinks from "./nav-links";
import { SearchBar } from "../components/SearchBar";
import { Suspense } from "react";

export default function Header() {

    return (
        <header className="bg-background text-text bg-opacity-85">
            <div className="py-8 md:py-12 flex items-center justify-between container-spacing text-l md:text-xl">
                <Link href='/'><div>CookBook</div></Link>
                <div className="flex-1 min-w-[300px] max-w-[500px] mx-2">
                    <Suspense fallback={null}>
                        <SearchBar placeholder="Search..." />
                    </Suspense>
                </div>
                <nav className="flex gap-12">
                    <NavLinks />
                </nav>
            </div>
        </header>
    )
}