import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    id: "taco-bowls", title: "Smoky taco bowls", tagline: "Big flavor, one pan, zero stress.", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80", time: 25, cost: "$$", difficulty: "Easy", tags: ["One pan", "High protein"],
    ingredients: [
      { id: "chicken", name: "Chicken breast", amount: "1 lb", metricAmount: "454 g", category: "Protein", calories: 748 },
      { id: "rice", name: "Long-grain rice", amount: "1 cup", metricAmount: "185 g", category: "Pantry", calories: 675 },
      { id: "beans", name: "Black beans", amount: "1 can", metricAmount: "425 g can", category: "Pantry", calories: 350 },
      { id: "avocado", name: "Avocado", amount: "1", metricAmount: "1", category: "Produce", calories: 240 },
      { id: "lime", name: "Limes", amount: "2", metricAmount: "2", category: "Produce", calories: 40 }
    ],
    steps: ["Rinse the rice and cook it with 2 cups of water.", "Dice and season the chicken with paprika, cumin, salt, and pepper.", "Cook the chicken in a hot oiled pan for 6–8 minutes.", "Warm the beans and slice the avocado and limes.", "Build each bowl and finish with a squeeze of lime."],
    safety: "Cook chicken to 165°F in the thickest piece.",
    nutrition: { protein: 46, carbohydrates: 71, fat: 18 }
  },
  {
    id: "lemon-pasta", title: "Bright lemon pasta", tagline: "Silky, sunny, and ready in twenty.", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80", time: 20, cost: "$", difficulty: "Very easy", tags: ["Vegetarian", "5 ingredients"],
    ingredients: [
      { id: "pasta", name: "Spaghetti", amount: "12 oz", metricAmount: "340 g", category: "Pantry", calories: 1260 },
      { id: "lemon", name: "Lemons", amount: "2", metricAmount: "2", category: "Produce", calories: 34 },
      { id: "parmesan", name: "Parmesan", amount: "3 oz", metricAmount: "85 g", category: "Dairy", calories: 330 },
      { id: "butter", name: "Butter", amount: "3 tbsp", metricAmount: "42 g", category: "Dairy", calories: 306 },
      { id: "spinach", name: "Baby spinach", amount: "5 oz", metricAmount: "142 g", category: "Produce", calories: 35 }
    ],
    steps: ["Boil salted water and cook the pasta until just tender.", "Zest and juice the lemons, then grate the Parmesan.", "Save 1 cup pasta water and drain.", "Toss pasta with butter, lemon, spinach, and a splash of pasta water.", "Stir in Parmesan off the heat and season to taste."],
    nutrition: { protein: 24, carbohydrates: 91, fat: 24 }
  },
  {
    id: "salmon-tray", title: "Honey salmon tray", tagline: "Dinner that basically cooks itself.", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80", imagePosition: "center 58%", time: 30, cost: "$$$", difficulty: "Easy", tags: ["Sheet pan", "No fuss"],
    ingredients: [
      { id: "salmon", name: "Salmon fillets", amount: "4", metricAmount: "4", category: "Protein", calories: 936 },
      { id: "broccoli", name: "Broccoli florets", amount: "12 oz", metricAmount: "340 g", category: "Produce", calories: 120 },
      { id: "potatoes", name: "Baby potatoes", amount: "1 lb", metricAmount: "454 g", category: "Produce", calories: 590 },
      { id: "honey", name: "Honey", amount: "2 tbsp", metricAmount: "42 g", category: "Pantry", calories: 128 }
    ],
    steps: ["Heat the oven to 425°F.", "Toss the potatoes with oil and salt; roast for 12 minutes.", "Mix honey with soy sauce and brush it over the salmon.", "Add salmon and broccoli; roast for 10–12 minutes.", "Brush with the remaining glaze and serve."],
    safety: "Cook salmon to 145°F or until opaque and easily flaked.",
    nutrition: { protein: 34, carbohydrates: 42, fat: 18 }
  },
  {
    id: "breakfast-pitas", title: "Crispy breakfast pitas", tagline: "Breakfast with main-character energy.", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80", time: 15, cost: "$", difficulty: "Very easy", tags: ["Breakfast", "Quick"],
    ingredients: [
      { id: "eggs", name: "Eggs", amount: "4", metricAmount: "4", category: "Protein", calories: 288 },
      { id: "pita", name: "Pita bread", amount: "2", metricAmount: "2", category: "Pantry", calories: 330 },
      { id: "tomato", name: "Cherry tomatoes", amount: "1 cup", metricAmount: "150 g", category: "Produce", calories: 27 },
      { id: "feta", name: "Feta", amount: "2 oz", metricAmount: "57 g", category: "Dairy", calories: 150 }
    ],
    steps: ["Toast the pitas and cut them in half.", "Halve the tomatoes and crumble the feta.", "Scramble the eggs over medium-low heat.", "Fill each pita and serve warm."],
    safety: "Cook eggs until the whites and yolks are firm.",
    nutrition: { protein: 24, carbohydrates: 40, fat: 19 }
  },
  {
    id: "chickpea-curry", title: "Creamy chickpea curry", tagline: "A cozy pantry dinner with a bright finish.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80", time: 25, cost: "$", difficulty: "Very easy", tags: ["Vegetarian", "One pan"],
    ingredients: [
      { id: "chickpeas", name: "Chickpeas", amount: "2 cans", metricAmount: "2 × 425 g cans", category: "Pantry", calories: 700 },
      { id: "coconut-milk", name: "Coconut milk", amount: "1 can", metricAmount: "400 ml", category: "Pantry", calories: 600 },
      { id: "spinach", name: "Baby spinach", amount: "5 oz", metricAmount: "142 g", category: "Produce", calories: 35 },
      { id: "lime", name: "Lime", amount: "1", metricAmount: "1", category: "Produce", calories: 20 }
    ],
    steps: ["Warm curry powder in a lightly oiled skillet for 30 seconds.", "Add drained chickpeas and coconut milk; simmer for 12 minutes.", "Fold in spinach until wilted and finish with lime."],
    nutrition: { protein: 18, carbohydrates: 55, fat: 28 }
  },
  {
    id: "bean-quesadillas", title: "Crispy bean quesadillas", tagline: "Golden edges, melty middles, dinner handled.", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=1200&q=80", time: 20, cost: "$", difficulty: "Very easy", tags: ["Vegetarian", "Quick"],
    ingredients: [
      { id: "tortillas", name: "Flour tortillas", amount: "8", metricAmount: "8", category: "Pantry", calories: 1040 },
      { id: "beans", name: "Black beans", amount: "1 can", metricAmount: "425 g can", category: "Pantry", calories: 350 },
      { id: "cheddar", name: "Cheddar", amount: "6 oz", metricAmount: "170 g", category: "Dairy", calories: 684 },
      { id: "salsa", name: "Fresh salsa", amount: "1 cup", metricAmount: "240 ml", category: "Produce", calories: 70 }
    ],
    steps: ["Mash the drained beans with half the salsa.", "Spread the filling and cheese over four tortillas and top with the rest.", "Cook in a dry skillet for 2–3 minutes per side, then cut into wedges."],
    nutrition: { protein: 28, carbohydrates: 86, fat: 23 }
  },
  {
    id: "pesto-gnocchi", title: "Skillet pesto gnocchi", tagline: "Pillowy, herby, and happily low effort.", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80", time: 18, cost: "$$", difficulty: "Very easy", tags: ["Vegetarian", "One pan"],
    ingredients: [
      { id: "gnocchi", name: "Shelf-stable gnocchi", amount: "1 lb", metricAmount: "454 g", category: "Pantry", calories: 900 },
      { id: "pesto", name: "Basil pesto", amount: "1/3 cup", metricAmount: "80 ml", category: "Pantry", calories: 520 },
      { id: "tomato", name: "Cherry tomatoes", amount: "2 cups", metricAmount: "300 g", category: "Produce", calories: 54 },
      { id: "mozzarella", name: "Mozzarella pearls", amount: "4 oz", metricAmount: "113 g", category: "Dairy", calories: 320 }
    ],
    steps: ["Brown the gnocchi in a wide oiled skillet for 6–8 minutes.", "Add the tomatoes and cook until they begin to soften.", "Remove from heat and fold through pesto and mozzarella."],
    nutrition: { protein: 22, carbohydrates: 72, fat: 26 }
  },
  {
    id: "chicken-veg-tray", title: "Paprika chicken tray", tagline: "Colorful vegetables and crisp-edged chicken.", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80", time: 35, cost: "$$", difficulty: "Easy", tags: ["Sheet pan", "High protein"],
    ingredients: [
      { id: "chicken", name: "Chicken breast", amount: "1 lb", metricAmount: "454 g", category: "Protein", calories: 748 },
      { id: "pepper", name: "Bell peppers", amount: "3", metricAmount: "3", category: "Produce", calories: 111 },
      { id: "zucchini", name: "Zucchini", amount: "2", metricAmount: "2", category: "Produce", calories: 66 },
      { id: "potatoes", name: "Baby potatoes", amount: "1 lb", metricAmount: "454 g", category: "Produce", calories: 590 }
    ],
    steps: ["Heat the oven to 425°F and line a sheet pan.", "Cut everything into even pieces and toss with oil, paprika, salt, and pepper.", "Roast for 24–28 minutes, turning once, until the chicken reaches 165°F."],
    safety: "Wash hands and surfaces after handling raw chicken. Cook chicken to 165°F in the thickest piece.",
    nutrition: { protein: 48, carbohydrates: 39, fat: 14 }
  },
  {
    id: "overnight-oats", title: "Berry overnight oats", tagline: "Tomorrow morning just got much easier.", image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80", time: 10, cost: "$", difficulty: "Very easy", tags: ["Breakfast", "No cook"],
    ingredients: [
      { id: "oats", name: "Rolled oats", amount: "2 cups", metricAmount: "180 g", category: "Pantry", calories: 700 },
      { id: "milk", name: "Milk", amount: "2 cups", metricAmount: "475 ml", category: "Dairy", calories: 244 },
      { id: "yogurt", name: "Greek yogurt", amount: "1 cup", metricAmount: "245 g", category: "Dairy", calories: 150 },
      { id: "berries", name: "Mixed berries", amount: "2 cups", metricAmount: "280 g", category: "Produce", calories: 140 }
    ],
    steps: ["Stir the oats, milk, and yogurt together in a covered container.", "Fold in half the berries and refrigerate overnight.", "Top with the remaining berries and serve cold."],
    safety: "Refrigerate promptly and eat within three days.",
    nutrition: { protein: 22, carbohydrates: 68, fat: 9 }
  },
  {
    id: "tuna-melts", title: "Open-face tuna melts", tagline: "Crunchy, savory, and ready for lunch.", image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=1200&q=80", time: 15, cost: "$", difficulty: "Very easy", tags: ["Lunch", "High protein"],
    ingredients: [
      { id: "tuna", name: "Canned tuna", amount: "2 cans", metricAmount: "2 × 142 g cans", category: "Protein", calories: 300 },
      { id: "bread", name: "Whole-grain bread", amount: "4 slices", metricAmount: "4 slices", category: "Pantry", calories: 360 },
      { id: "cheddar", name: "Cheddar", amount: "4 oz", metricAmount: "113 g", category: "Dairy", calories: 456 },
      { id: "celery", name: "Celery", amount: "2 stalks", metricAmount: "2 stalks", category: "Produce", calories: 14 }
    ],
    steps: ["Heat the broiler and line a small tray.", "Mix drained tuna with finely chopped celery and a spoonful of mayonnaise.", "Pile onto bread, top with cheddar, and broil until bubbling and golden."],
    safety: "Refrigerate opened tuna promptly and do not leave the prepared mixture at room temperature over two hours.",
    nutrition: { protein: 39, carbohydrates: 24, fat: 19 }
  }
];
