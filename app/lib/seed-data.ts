const users = [
    {
        id: '410544b2-4001-4271-9855-fec4b6a6442a',
        username: 'User',
        email: 'user@user.com',
        password: '123456',
    }
]

const recipes = [
    {
        id: 'ee70f221-5e9d-46c9-8da6-a462d59ded6b',
        user_id: users[0].id,
        title: 'Almond Cream Tart',
        description: 'Delicious and fruity!',
        image_url: '/images/recipes/almond-cream-tart.JPG',
        is_public: true,
    },
    {
        id: 'eb4d7ad3-c4bb-46a1-b160-5df022bb134d',
        user_id: users[0].id,
        title: "Noa's Chicken",
        description: 'Homey, warm, and filling!',
        image_url: '/images/recipes/noas-chicken.JPG',
        is_public: true,
    }
]

const ingredients = [
    {
        recipe_id: recipes[0].id,
        amount: '',
        ingredient: 'Pate sucree',
    },
    {
        recipe_id: recipes[0].id,
        amount: '100g',
        ingredient: 'Unsalted butter',
    },
    {
        recipe_id: recipes[0].id,
        amount: '100g',
        ingredient: 'Powdered sugar',
    },
    {
        recipe_id: recipes[0].id,
        amount: '100g',
        ingredient: 'Almond flour',
    },
    {
        recipe_id: recipes[0].id,
        amount: '1 Dash',
        ingredient: 'Dark rum',
    },
    {
        recipe_id: recipes[0].id,
        amount: '1T',
        ingredient: 'Vanilla extract',
    },
    {
        recipe_id: recipes[0].id,
        amount: '2',
        ingredient: 'Eggs',
    },
    {
        recipe_id: recipes[0].id,
        amount: '',
        ingredient: 'Berries',
    },
    {
        recipe_id: recipes[1].id,
        amount: '8',
        ingredient: 'Dried dates, pitted',
    },
    {
        recipe_id: recipes[1].id,
        amount: '8',
        ingredient: 'Dried prunes',
    },
    {
        recipe_id: recipes[1].id,
        amount: '2',
        ingredient: 'Apples/pears, cored, cut into quarters',
    },
    {
        recipe_id: recipes[1].id,
        amount: '15',
        ingredient: 'Chicken legs',
    },
    {
        recipe_id: recipes[1].id,
        amount: '',
        ingredient: 'Cooking oil',
    },
    {
        recipe_id: recipes[1].id,
        amount: '',
        ingredient: 'Salt & pepper',
    },
    {
        recipe_id: recipes[1].id,
        amount: '1',
        ingredient: 'Lemon',
    },
    {
        recipe_id: recipes[1].id,
        amount: '1C',
        ingredient: 'Red cooking wine',
    },
    {
        recipe_id: recipes[1].id,
        amount: '3T',
        ingredient: 'Tomato paste',
    },
    {
        recipe_id: recipes[1].id,
        amount: '4T',
        ingredient: 'Honey',
    }
]

const instructions = [
    {
        recipe_id: recipes[0].id,
        order: 1,
        instruction: 'Preheat oven to 340F (170C).'
    },
    {
        recipe_id: recipes[0].id,
        order: 2,
        instruction: 'Grease a 22cm tart dish.'
    },
    {
        recipe_id: recipes[0].id,
        order: 3,
        instruction: 'Spread dough out in the dish (do not attempt to roll out the dough, it is to crumbly, it must be spread out with your hands while already in the dish).'
    },
    {
        recipe_id: recipes[0].id,
        order: 4,
        instruction: 'Bake for 10 minutes.'
    },
    {
        recipe_id: recipes[0].id,
        order: 5,
        instruction: 'Meanwhile, mix butter with powdered sugar and almond flour in an electric mixer. Pour in the vanilla extract and dark rum. Then mix in the eggs.'
    },
    {
        recipe_id: recipes[0].id,
        order: 6,
        instruction: 'When tart has finished cooking, spread out almond cream evenly over tart and bake for additional 15-20 minutes.'
    },
    {
        recipe_id: recipes[0].id,
        order: 7,
        instruction: 'Allow tart to cool off and top with berries.'
    },
    {
        recipe_id: recipes[1].id,
        order: 1,
        instruction: 'Preheat oven to 350F.'
    },
    {
        recipe_id: recipes[1].id,
        order: 2,
        instruction: 'Massage chicken with salt, pepper, and oil.'
    },
    {
        recipe_id: recipes[1].id,
        order: 3,
        instruction: 'Cook chicken covered for 30 minutes.'
    },
    {
        recipe_id: recipes[1].id,
        order: 4,
        instruction: 'Meanwhile, dilute honey with wine and add lemon juice and tomato paste.'
    },
    {
        recipe_id: recipes[1].id,
        order: 5,
        instruction: 'After chicken has cooked, add apples/pears, dates, and prunes to dish. Cover with sauce and cook covered for 45 minutes.'
    },
    {
        recipe_id: recipes[1].id,
        order: 6,
        instruction: 'Remove foil and cook for another hour.'
    }
]

const recipeBooks = [
    {
        id: 'dc42165b-072f-4480-b09e-681461585427',
        user_id: users[0].id,
        name: 'My book'
    }
]

const recipeBookRecipes = [
    {
        book_id: recipeBooks[0].id,
        recipe_id: recipes[0].id
    },
    {
        book_id: recipeBooks[0].id,
        recipe_id: recipes[1].id
    }
]

const permissions = [
    {
        book_id: recipeBooks[0].id,
        user_id: users[0].id,
        can_edit: true
    }
]

export { users, recipes, ingredients, instructions, recipeBooks, recipeBookRecipes, permissions }