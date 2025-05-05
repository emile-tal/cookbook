'use client'

import { useBookRecipeContext } from "@/app/context/book-recipe-context"
import { useDisplayView } from "@/app/context/display-view-context"
import { useEffect } from "react"

export default function ProfileStateInitializer() {
    const { setDisplayView } = useDisplayView()
    const { setBookRecipeView } = useBookRecipeContext()

    useEffect(() => {
        // Load display view
        const savedDisplayView = localStorage.getItem("displayView")
        if (savedDisplayView === "list" || savedDisplayView === "grid") {
            setDisplayView(savedDisplayView)
        }

        // Load profile view
        const savedProfileView = localStorage.getItem("profileView")
        if (savedProfileView === "books" || savedProfileView === "recipes") {
            setBookRecipeView(savedProfileView)
        }
    }, [])

    return null
} 