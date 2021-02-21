const redis = require("async-redis");
const client = redis.createClient();

const fridge = {
  ingredients: {
    "milk": 200,
    "buns": 1000,
    "bread": 1000,
    "egg": 100,
    "hollandaise": 50,
    "bacon": 100
  },
  preferences: new Set([
    "healthy",
    "easy",
    "carbs",
    "protein"
  ])
};

const data = {
  "French Toast": {
    ingredients: {
      "egg": 100,
      "milk": 50,
      "bread": 500,
      "salt": 20,
      "sunfloweroil": 100
    },
    tags: new Set([
      "carbs",
      "easy"
    ])
  },
  "Bacon Cheese Hamburger": {
    ingredients: {
      "buns": 200,
      "beef": 300,
      "cheese": 10,
      "bacon": 10,
      "mayonnaise": 5,
      "ketchup": 5,
      "salt": 1
    },
    tags: new Set([
      "carbs",
      "protein"
    ])
  },
  "Eggs Benny": {
    ingredients: {
      "egg": 100,
      "buns": 200,
      "hollandaise": 50,
      "bacon": 100
    },
    tags: new Set([
      "carbs"
    ])
  },
  "Seaweed Salad": {
    ingredients: {
      "seaweed": 50,
      "oliveoil": 20,
      "soysauce": 40,
      "salt": 10
    },
    tags: new Set([
      "healthy",
      "easy"
    ])
  }
};

async function run() {

  // QUERY THE DATA.
  const results = new Set();
  for (const [ingredient, amount] of Object.entries(fridge.ingredients)) {
    const r = await client.zrangebyscore(`ingredient:${ingredient}`, 0, amount);
    for (x of r) results.add(x);
  }
  const recipes = [...results].map(x => { return { name: x, ...data[x] }})

  // COMPUTE SCORES
  recipes.forEach(recipe => {
    let canMake = true;
    for (const [ing, amt] of Object.entries(recipe.ingredients)) {
      if (!fridge.ingredients[ing] || fridge.ingredients[ing] < amt) {
        canMake = false;
        break;
      }
    }

    const ix = [...recipe.tags].filter(x => fridge.preferences.has(x));
    let score = ix.length;

    recipe.canMake = false;
    if (canMake) {
      recipe.canMake = true;
      score += 1000;
    }

    recipe.score = score;
  });

  // SORT THE RESULTS
  recipes.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });

  console.log(recipes)
}

run();
