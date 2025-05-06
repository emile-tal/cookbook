export type Book = {
    id: string,
    name: string,
    username: string,
    image_url: string,
    is_public: boolean,
    recipe_count: number
}

export type Ingredient = {
    id: string,
    position: number,
    amount: string,
    ingredient: string
}

export type Instruction = {
    id: string,
    position: number,
    instruction: string
}

export type AverageRating = {
    average_rating: number,
    num_ratings: number
}

export type Comment = {
    id: string,
    comment: string,
    created_at: string,
    username: string,
    user_image_url: string
}

export type LiteRecipe = {
    id: string,
    title: string,
    image_url: string,
    username: string,
    duration: number,
    categories: string[]
}

export type Recipe = LiteRecipe & {
    recipe_yield: number,
    description: string,
    is_public: boolean,
    average_rating: AverageRating,
    ingredients: Ingredient[],
    instructions: Instruction[],
}

export type UserPublicInfo = {
    id: string,
    username: string,
    user_image_url: string,
    recipe_count: number,
    book_count: number,
}

export type UserCredentials = {
    id: string,
    username: string,
    password: string,
    email: string,
}

export type BookInvitation = {
    id: string,
    book_id: string,
    book_name: string,
    book_image_url: string,
    sender_username: string,
    recipient_email: string,
    message: string,
    can_edit: boolean,
    created_at: string,
}

export type RecipeInvitation = {
    id: string,
    recipe_id: string,
    recipe_title: string,
    recipe_image_url: string,
    sender_username: string,
    recipient_email: string,
    message: string,
    can_edit: boolean,
    created_at: string,
}

export type ImportedRecipe = {
    title: string,
    description: string,
    categories: string[],
    duration: number | null,
    recipe_yield: number | null,
    ingredients: {
        position: number,
        amount: string,
        ingredient: string
    }[],
    instructions: {
        position: number,
        instruction: string
    }[],
}

export type UserPersonalInfo = {
    id: string,
    username: string,
    user_image_url: string,
}