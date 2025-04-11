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
    amount: string,
    ingredient: string
}

export type Instruction = {
    position: number,
    instruction: string
}

export type Recipe = LiteRecipe & {
    description: string,
    is_public: boolean,
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