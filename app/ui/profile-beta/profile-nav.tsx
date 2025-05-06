'use client'

import { usePathname, useRouter } from "next/navigation";

import AddIcon from '@mui/icons-material/Add';
import BookRecipeViewAccordion from "./book-recipe-view-accordion";
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import NewBookDialog from "@/app/components/NewBookDialog";
import { Tooltip } from "@mui/material";
import { createBook } from "@/app/lib/data/recipebooks";
import { useBookRecipeContext } from "@/app/context/book-recipe-context";
import { useDisplayView } from "@/app/context/display-view-context";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfileNav({ id }: { id: string }) {
    const { displayView, setDisplayView } = useDisplayView();
    const { bookRecipeView } = useBookRecipeContext();
    const { data: session } = useSession();
    const router = useRouter();
    const isOwner = session?.user?.id === id;
    const pathname = usePathname();
    const fullUrl = pathname;
    const [openDialog, setOpenDialog] = useState(false);

    const handleViewChange = (newView: "grid" | "list") => {
        if (newView) {
            setDisplayView(newView);
            localStorage.setItem("displayView", newView);
        }
    }

    const handleCreateRecipeBook = async (recipeBookName: string) => {
        await createBook(recipeBookName);
        router.refresh();
        setOpenDialog(false);
    };

    return (
        <nav>
            <div className="pt-4 sm:pt-8">
                {isOwner && (
                    <div className="pb-4 sm:pb-8 flex flex-1">
                        <button
                            className={`flex flex-1 items-center justify-center text-sm sm:text-base bg-primary text-white px-4 py-2 hover:bg-opacity-90 transition-colors rounded-md`}
                            onClick={() => {
                                if (bookRecipeView === "books") {
                                    setOpenDialog(true);
                                } else {
                                    router.push(`/recipe/add?from=${fullUrl}`);
                                }
                            }}
                        >
                            <AddIcon />
                            {bookRecipeView === "books" ? "Add Book" : "Add Recipe"}
                        </button>
                    </div>
                )}
                <BookRecipeViewAccordion id={id} />
                <div className="pt-4 sm:pt-8 flex gap-2 justify-center">
                    <Tooltip title="Grid View">
                        <button
                            className={`flex items-center justify-center scale-75 sm:scale-100 border border-primary p-4 transition-colors rounded-full ${displayView === "grid" ? "bg-primary text-white hover:bg-opacity-90" : "text-primary border-primary hover:bg-primary/5"}`}
                            onClick={() => handleViewChange("grid")}
                        >
                            <GridViewIcon />
                        </button>
                    </Tooltip>

                    <Tooltip title="List View">
                        <button
                            className={`flex items-center justify-center scale-75 sm:scale-100 border border-primary p-4 transition-colors rounded-full ${displayView === "list" ? "bg-primary text-white hover:bg-opacity-90" : "text-primary border-primary hover:bg-primary/5"}`}
                            onClick={() => handleViewChange("list")}
                        >
                            <ListIcon />
                        </button>
                    </Tooltip>
                </div>

            </div>
            <NewBookDialog open={openDialog} onClose={() => setOpenDialog(false)} createRecipeBook={handleCreateRecipeBook} />
        </nav>
    )
}