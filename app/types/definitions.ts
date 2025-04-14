export type Book = {
    id: string,
    name: string,
    username: string,
    image_url: string,
    is_public: boolean,
    recipe_count: number
}

export type LiteRecipe = {
    id: string,
    title: string,
    image_url: string,
    username: string,
    duration: number,
    categories: string[]
}

export type Ingredient = {
    position: number,
    amount: string,
    ingredient: string
}

export type Instruction = {
    position: number,
    instruction: string
}

export type AverageRating = {
    average_rating: number,
    num_ratings: number
}

export type Comment = {
    id: string,
    content: string,
    created_at: string,
    username: string,
    user_image_url: string
}

export type Recipe = LiteRecipe & {
    recipe_yield: number,
    description: string,
    is_public: boolean,
    average_rating: AverageRating,
    ingredients: Ingredient[],
    instructions: Instruction[],
}

export type User = {
    id: string,
    username: string,
    email: string,
    user_image_url: string
}

export type UserCredentials = {
    id: string,
    username: string,
    password: string,
    email: string,
}

export type Invitation = {
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