'use client'

import Link from "next/link";
import Logo from "./logo";
import NavLinks from "./nav-links";
import { SearchBar } from "../components/SearchBar";
import { Suspense } from "react";
import { playfair } from "./fonts";

export default function Header() {

    return (
        <header className="bg-background text-text bg-opacity-85">
            <div className="py-8 md:py-12 flex items-center justify-between container-spacing text-l md:text-xl">
                <Link href='/' className="flex items-center">
                    <Logo w={50} h={50} />
                    <span className={`${playfair.className} text-text font-serif text-2xl font-bold`}>RECIPIZ</span>
                </Link>
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