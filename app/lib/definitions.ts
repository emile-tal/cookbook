export type Book = {
    id: string,
    name: string,
    username: string
}

export type LiteRecipe = {
    id: string,
    title: string,
    image_url: string,
    username: string
}

export type Recipe = LiteRecipe & {
    description: string,
    is_public: boolean
}