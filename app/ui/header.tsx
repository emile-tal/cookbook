'use client'

import { useEffect, useState } from "react";

import Link from "next/link";
import Logo from "./logo";
import NavLinks from "./nav-links";
import { Search } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { playfair } from "./fonts";
import { useContainerWidth } from "../lib/customHooks";

export default function Header() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const { ref: navLinksRef, width } = useContainerWidth<HTMLDivElement>();
    const { ref: searchBarRef, width: searchBarWidth } = useContainerWidth<HTMLDivElement>();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setShowSearchBar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-background text-text bg-opacity-85">
            <div className="py-8 md:pt-12 grid grid-cols-[auto_1fr] items-center container-spacing text-l md:text-xl">
                <Link href='/' className="flex items-center">
                    <Logo w={50} h={50} />
                    <span className={`${playfair.className} text-text font-serif text-2xl font-bold hidden md:block`}>RECIPIZ</span>
                </Link>
                <div className="flex items-center gap-4 w-full justify-end" ref={navLinksRef}>
                    {showSearchBar ? (
                        <div className="min-w-[100px] sm:min-w-[200px] md:min-w-[300px] lg:min-w-[450px]" ref={searchBarRef}>
                            <SearchBar placeholder="Search..." />
                        </div>
                    ) : (
                        <button onClick={() => setShowSearchBar(!showSearchBar)}>
                            <Search className="w-5 h-5" />
                        </button>
                    )}
                    <div>
                        <NavLinks width={width} searchBarWidth={searchBarWidth} />
                    </div>
                </div>
            </div>
        </header>
    )
}