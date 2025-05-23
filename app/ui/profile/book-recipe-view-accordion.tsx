'use client'

import { useBookFilterContext } from "@/app/context/book-filter-context";
import { useBookRecipeContext } from "@/app/context/book-recipe-context";
import { useRecipeFilterContext } from "@/app/context/recipe-filter-context";
import { useSession } from "next-auth/react";
import { useState } from "react";

const filters = ["all", "owned", "saved", "shared"];

export default function BookRecipeViewAccordion({ id }: { id: string }) {
    const { data: session } = useSession();
    const { bookRecipeView, setBookRecipeView } = useBookRecipeContext();
    const { bookFilter, setBookFilter } = useBookFilterContext();
    const { recipeFilter, setRecipeFilter } = useRecipeFilterContext();
    const [bookAccordionIsOpen, setBookAccordionIsOpen] = useState(false);
    const [recipeAccordionIsOpen, setRecipeAccordionIsOpen] = useState(false);

    const handleViewChange = (newView: "books" | "recipes") => {
        if (newView) {
            setBookRecipeView(newView);
            localStorage.setItem("profileView", newView);
        }
    }

    return (
        <div>
            <div className="min-w-full flex sm:flex-col">
                <button
                    className={`flex flex-1 items-center justify-center text-sm sm:text-base border border-primary px-4 py-2 transition-colors rounded-tl-md sm:rounded-tr-md ${bookRecipeView === "books" ? "bg-primary text-white hover:bg-opacity-90" : "text-primary border-primary hover:bg-primary/5"} ${bookAccordionIsOpen || recipeAccordionIsOpen ? "" : "rounded-bl-md sm:rounded-bl-none"}`}
                    onClick={() => {
                        handleViewChange("books")
                        if (session?.user?.id === id) {
                            setBookAccordionIsOpen(!bookAccordionIsOpen);
                            setRecipeAccordionIsOpen(false);
                            setBookFilter("all");
                        }
                    }}
                >
                    Books
                </button>
                {bookAccordionIsOpen && (
                    <div className="hidden sm:flex flex-col">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => { setBookFilter(filter as "all" | "owned" | "saved" | "shared") }}
                                className={`w-full text-left px-6 py-2 text-sm hover:bg-primary/5 transition-colors border-x border-b border-gray-200 ${bookFilter === filter ? "bg-primary/10 text-primary font-medium" : "text-gray-600"
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
                <button
                    className={`flex flex-1 items-center justify-center text-sm sm:text-base border border-primary px-4 py-2 transition-colors rounded-tr-md sm:rounded-none ${recipeAccordionIsOpen ? "" : "sm:rounded-b-md"} ${bookRecipeView === "recipes" ? "bg-primary text-white hover:bg-opacity-90" : "text-primary border-primary hover:bg-primary/5"} ${bookAccordionIsOpen || recipeAccordionIsOpen ? "" : "rounded-br-md"}`}
                    onClick={() => {
                        handleViewChange("recipes")
                        if (session?.user?.id === id) {
                            setRecipeAccordionIsOpen(!recipeAccordionIsOpen);
                            setBookAccordionIsOpen(false);
                            setRecipeFilter("all");
                        }
                    }}
                >
                    Recipes
                </button>
                {recipeAccordionIsOpen && (
                    <div className="hidden sm:flex flex-col">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setRecipeFilter(filter as "all" | "owned" | "saved" | "shared")}
                                className={`w-full text-left px-6 py-2 text-sm hover:bg-primary/5 transition-colors border-x border-b border-gray-200 ${filter === "shared" ? "rounded-b-md" : ""} ${recipeFilter === filter ? "bg-primary/10 text-primary font-medium" : "text-gray-600"}`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {bookAccordionIsOpen && (
                <div className="flex flex-col sm:hidden">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => { setBookFilter(filter as "all" | "owned" | "saved" | "shared") }}
                            className={`w-full text-left px-6 py-2 text-sm hover:bg-primary/5 transition-colors border-x border-b border-gray-200 ${filter === "shared" ? "rounded-b-md" : ""} ${bookFilter === filter ? "bg-primary/10 text-primary font-medium" : "text-gray-600"}`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            )}
            {recipeAccordionIsOpen && (
                <div className="flex flex-col sm:hidden">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => { setRecipeFilter(filter as "all" | "owned" | "saved" | "shared") }}
                            className={`w-full text-left px-6 py-2 text-sm hover:bg-primary/5 transition-colors border-x border-b border-gray-200 ${filter === "shared" ? "rounded-b-md" : ""} ${recipeFilter === filter ? "bg-primary/10 text-primary font-medium" : "text-gray-600"}`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}