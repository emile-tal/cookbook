export type Book = {
    id: string,
    name: string,
    username: string,
    image_url: string,
    is_public: boolean
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