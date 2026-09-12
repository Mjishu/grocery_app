import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    id: "taco-bowls", title: "Smoky taco bowls", tagline: "Big flavor, one pan, zero stress.", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80", time: 25, cost: "$$", difficulty: "Easy", tags: ["One pan", "High protein"],
    ingredients: [
      { id: "chicken", name: "Chicken breast", amount: "1 lb", category: "Protein", calories: 748 },
      { id: "rice", name: "Long-grain rice", amount: "1 cup", category: "Pantry", calories: 675 },
      { id: "beans", name: "Black beans", amount: "1 can", category: "Pantry", calories: 350 },
      { id: "avocado", name: "Avocado", amount: "1", category: "Produce", calories: 240 },
      { id: "lime", name: "Limes", amount: "2", category: "Produce", calories: 40 }
    ],
    steps: ["Rinse the rice and cook it with 2 cups of water.", "Dice and season the chicken with paprika, cumin, salt, and pepper.", "Cook the chicken in a hot oiled pan for 6–8 minutes.", "Warm the beans and slice the avocado and limes.", "Build each bowl and finish with a squeeze of lime."],
    safety: "Cook chicken to 165°F in the thickest piece."
  },
  {
    id: "lemon-pasta", title: "Bright lemon pasta", tagline: "Silky, sunny, and ready in twenty.", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80", time: 20, cost: "$", difficulty: "Very easy", tags: ["Vegetarian", "5 ingredients"],
    ingredients: [
      { id: "pasta", name: "Spaghetti", amount: "12 oz", category: "Pantry", calories: 1260 },
      { id: "lemon", name: "Lemons", amount: "2", category: "Produce", calories: 34 },
      { id: "parmesan", name: "Parmesan", amount: "3 oz", category: "Dairy", calories: 330 },
      { id: "butter", name: "Butter", amount: "3 tbsp", category: "Dairy", calories: 306 },
      { id: "spinach", name: "Baby spinach", amount: "5 oz", category: "Produce", calories: 35 }
    ],
    steps: ["Boil salted water and cook the pasta until just tender.", "Zest and juice the lemons, then grate the Parmesan.", "Save 1 cup pasta water and drain.", "Toss pasta with butter, lemon, spinach, and a splash of pasta water.", "Stir in Parmesan off the heat and season to taste."]
  },
  {
    id: "salmon-tray", title: "Honey salmon tray", tagline: "Dinner that basically cooks itself.", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80", imagePosition: "center 58%", time: 30, cost: "$$$", difficulty: "Easy", tags: ["Sheet pan", "No fuss"],
    ingredients: [
      { id: "salmon", name: "Salmon fillets", amount: "4", category: "Protein", calories: 936 },
      { id: "broccoli", name: "Broccoli florets", amount: "12 oz", category: "Produce", calories: 120 },
      { id: "potatoes", name: "Baby potatoes", amount: "1 lb", category: "Produce", calories: 590 },
      { id: "honey", name: "Honey", amount: "2 tbsp", category: "Pantry", calories: 128 }
    ],
    steps: ["Heat the oven to 425°F.", "Toss the potatoes with oil and salt; roast for 12 minutes.", "Mix honey with soy sauce and brush it over the salmon.", "Add salmon and broccoli; roast for 10–12 minutes.", "Brush with the remaining glaze and serve."],
    safety: "Cook salmon to 145°F or until opaque and easily flaked."
  },
  {
    id: "breakfast-pitas", title: "Crispy breakfast pitas", tagline: "Breakfast with main-character energy.", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80", time: 15, cost: "$", difficulty: "Very easy", tags: ["Breakfast", "Quick"],
    ingredients: [
      { id: "eggs", name: "Eggs", amount: "4", category: "Protein", calories: 288 },
      { id: "pita", name: "Pita bread", amount: "2", category: "Pantry", calories: 330 },
      { id: "tomato", name: "Cherry tomatoes", amount: "1 cup", category: "Produce", calories: 27 },
      { id: "feta", name: "Feta", amount: "2 oz", category: "Dairy", calories: 150 }
    ],
    steps: ["Toast the pitas and cut them in half.", "Halve the tomatoes and crumble the feta.", "Scramble the eggs over medium-low heat.", "Fill each pita and serve warm."],
    safety: "Cook eggs until the whites and yolks are firm."
  }
];
