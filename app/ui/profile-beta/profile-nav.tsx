'use client'

import BookRecipeViewAccordion from "./book-recipe-view-accordion";
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import { Tooltip } from "@mui/material";
import { useDisplayView } from "@/app/context/display-view-context";

export default function ProfileNav({ id }: { id: string }) {
    const { displayView, setDisplayView } = useDisplayView();

    const handleViewChange = (newView: "grid" | "list") => {
        if (newView) {
            setDisplayView(newView);
            localStorage.setItem("displayView", newView);
        }
    }

    return (
        <nav>
            <div className="pt-8">
                <BookRecipeViewAccordion id={id} />
                <div className="pt-8 flex gap-2 justify-center">
                    <Tooltip title="Grid View">
                        <button
                            className={`flex items-center justify-center text-sm sm:text-base border border-primary p-4 transition-colors rounded-full ${displayView === "grid" ? "bg-primary text-white hover:bg-opacity-90" : "text-primary border-primary hover:bg-primary/5"}`}
                            onClick={() => handleViewChange("grid")}
                        >
                            <GridViewIcon />
                        </button>
                    </Tooltip>

                    <Tooltip title="List View">
                        <button
                            className={`flex items-center justify-center text-sm sm:text-base border border-primary p-4 transition-colors rounded-full ${displayView === "list" ? "bg-primary text-white hover:bg-opacity-90" : "text-primary border-primary hover:bg-primary/5"}`}
                            onClick={() => handleViewChange("list")}
                        >
                            <ListIcon />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </nav>
    )
}