export type LiteBook = {
    id: string,
    name: string,
    username: string
}

export type Book = LiteBook & {
    recipes: LiteRecipe[]
}

export type LiteRecipe = {
    id: string,
    title: string,
    image_url: string
}

export type Recipe = LiteRecipe & {
    description: string,
    is_public: boolean
}