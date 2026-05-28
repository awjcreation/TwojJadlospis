/*
  Twój jadłospis v1.0.0
  Statyczna aplikacja PWA: jadłospisy, przepisy, produkty, lista zakupów,
  kopie zapasowe, import/eksport JSON i tryb offline.
  Dane użytkownika są przechowywane lokalnie w localStorage.
*/

(() => {
  "use strict";

  const VERSION = "1.0.7";
  const STORAGE_KEY = "twoj-jadlospis-state-v1";
  const STORAGE_BACKUP_KEY = "twoj-jadlospis-state-v1-backup";

  const mealOrder = ["breakfast1", "breakfast2", "lunch", "snack", "dinner"];
  const mealLabels = {
    breakfast1: "Śniadanie",
    breakfast2: "Drugie śniadanie",
    lunch: "Obiad",
    snack: "Podwieczorek",
    dinner: "Kolacja"
  };

  const defaultMealTimes = {
    breakfast1: "07:30",
    breakfast2: "10:30",
    lunch: "13:30",
    snack: "16:30",
    dinner: "19:00"
  };

  const todayISO = toISODate(new Date());

  const seedRecipes = [
    {
      id: uid(),
      title: "Owsianka z owocami",
      category: "Śniadania",
      recipeType: "single",
      mealCategory: "breakfast1",
      prep: "Wymieszaj płatki z mlekiem, dodaj owoce.",
      image: "assets/placeholder-breakfast.png",
      ingredients: [
        ingredient("płatki owsiane", 50, 389, 16.9, 6.9, 66.3),
        ingredient("mleko 1,5%", 200, 47, 3.4, 1.5, 4.9),
        ingredient("borówki", 50, 57, 0.7, 0.3, 14.5),
        ingredient("banan", 100, 89, 1.1, 0.3, 22.8)
      ]
    },
    {
      id: uid(),
      title: "Sałatka z kurczakiem",
      category: "Sałatki",
      recipeType: "single",
      mealCategory: "breakfast2",
      prep: "",
      image: "assets/placeholder-salad.png",
      ingredients: [
        ingredient("pierś z kurczaka", 140, 165, 31, 3.6, 0),
        ingredient("sałata", 80, 15, 1.4, 0.2, 2.9),
        ingredient("pomidor", 100, 18, 0.9, 0.2, 3.9),
        ingredient("oliwa", 8, 884, 0, 100, 0)
      ]
    },
    {
      id: uid(),
      title: "Makaron pełnoziarnisty z sosem bolońskim",
      category: "Obiady",
      recipeType: "single",
      mealCategory: "lunch",
      prep: "",
      image: "assets/placeholder-dinner.png",
      ingredients: [
        ingredient("makaron pełnoziarnisty", 90, 348, 13, 2.5, 71),
        ingredient("mięso mielone z indyka", 140, 150, 21, 7, 0),
        ingredient("passata pomidorowa", 150, 33, 1.6, 0.2, 6),
        ingredient("oliwa", 10, 884, 0, 100, 0)
      ]
    },
    {
      id: uid(),
      title: "Jogurt naturalny z orzechami",
      category: "Przekąski",
      recipeType: "single",
      mealCategory: "snack",
      prep: "",
      image: "assets/placeholder-snack.png",
      ingredients: [
        ingredient("jogurt naturalny", 180, 61, 3.5, 3.3, 4.7),
        ingredient("orzechy włoskie", 20, 654, 15, 65, 14),
        ingredient("miód", 10, 304, 0.3, 0, 82)
      ]
    },
    {
      id: uid(),
      title: "Łosoś pieczony z warzywami",
      category: "Obiady",
      recipeType: "single",
      mealCategory: "dinner",
      prep: "",
      image: "assets/placeholder-supper.png",
      ingredients: [
        ingredient("łosoś filet", 130, 208, 20, 13, 0),
        ingredient("ziemniaki", 150, 77, 2, 0.1, 17),
        ingredient("brokuł", 120, 34, 2.8, 0.4, 7)
      ]
    }
  ];


  const importedRecipes = [
  {
    "id": "import-sok",
    "title": "sok",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-musli",
    "title": "Musli",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-musli-naturalne-25107",
        "name": "musli naturalne",
        "weight": 80.0,
        "kcal100": 366.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-melon-42111",
        "name": "melon",
        "weight": 120.0,
        "kcal100": 40.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-42575",
        "name": "jogurt naturalny",
        "weight": 250.0,
        "kcal100": 61.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-kanapka",
    "title": "kanapka",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-grahamka-26376",
        "name": "grahamka",
        "weight": 50.0,
        "kcal100": 260.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ser-zolty-hit-36727",
        "name": "ser żółty HIT",
        "weight": 20.0,
        "kcal100": 300.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-koncentrat-pomidorowy-74440",
        "name": "koncentrat pomidorowy",
        "weight": 9.0,
        "kcal100": 100.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-surowka",
    "title": "surówka",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-warzywa-wiosenne-64742",
        "name": "warzywa wiosenne",
        "weight": 200.0,
        "kcal100": 40.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-23976",
        "name": "jogurt naturalny",
        "weight": 48.0,
        "kcal100": 60.4,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-ryba-pieczona-w-folii",
    "title": "ryba pieczona w folii",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-mintaj-95335",
        "name": "mintaj",
        "weight": 150.0,
        "kcal100": 160.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-przyprawy-27462",
        "name": "przyprawy",
        "weight": 0,
        "kcal100": 0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-olej-62500",
        "name": "olej",
        "weight": 18.0,
        "kcal100": 872.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-ziemniaki",
    "title": "ziemniaki",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-ziemniaki-gotowane-60679",
        "name": "ziemniaki gotowane",
        "weight": 180.0,
        "kcal100": 77.8,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-koktajl",
    "title": "koktajl",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-truskawki-mrozone-4806",
        "name": "truskawki mrożone",
        "weight": 150.0,
        "kcal100": 28.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-kefir-30793",
        "name": "kefir",
        "weight": 200.0,
        "kcal100": 51.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-owoc",
    "title": "owoc",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-jablko-32701",
        "name": "jabłko",
        "weight": 200.0,
        "kcal100": 47.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-ryba-pieczona",
    "title": "ryba pieczona",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-ryba-93696",
        "name": "ryba",
        "weight": 200.0,
        "kcal100": 160.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-warzywa-gotowane",
    "title": "warzywa gotowane",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-warzywa-82448",
        "name": "warzywa",
        "weight": 200.0,
        "kcal100": 60.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-warzywa-z-patelni",
    "title": "warzywa z patelni",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-olej-20223",
        "name": "olej",
        "weight": 18.0,
        "kcal100": 844.4,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jajo-99543",
        "name": "jajo",
        "weight": 50.0,
        "kcal100": 152.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-mrozone-2684",
        "name": "warzywa mrożone",
        "weight": 300.0,
        "kcal100": 37.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-zupa",
    "title": "zupa",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-typu-barszcz-bialy-98688",
        "name": "typu barszcz biały",
        "weight": 200.0,
        "kcal100": 120.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-ryba-smazona-saute",
    "title": "ryba smażona saute",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-mintaj-sol-cytryna-42975",
        "name": "mintaj, sól, cytryna",
        "weight": 200.0,
        "kcal100": 70.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-olej-przyprawy-42995",
        "name": "olej, przyprawy",
        "weight": 18.0,
        "kcal100": 877.8,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-jogurt",
    "title": "jogurt",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-jogurt-owocowy-pitny-36989",
        "name": "jogurt owocowy pitny",
        "weight": 250.0,
        "kcal100": 81.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-makaron-z-serem",
    "title": "makaron z serem",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-makaron-22613",
        "name": "makaron",
        "weight": 60.0,
        "kcal100": 366.7,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-23976",
        "name": "jogurt naturalny",
        "weight": 48.0,
        "kcal100": 60.4,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-cukier-68696",
        "name": "cukier",
        "weight": 5.0,
        "kcal100": 400.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ser-bialy-chudy-81888",
        "name": "ser biały chudy",
        "weight": 50.0,
        "kcal100": 104.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-serek",
    "title": "serek",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-danio-80249",
        "name": "danio",
        "weight": 150.0,
        "kcal100": 161.3,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-salatka-sledziowa",
    "title": "sałatka śledziowa",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sledz-45499",
        "name": "śledź",
        "weight": 100.0,
        "kcal100": 87.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-cebula-72414",
        "name": "cebula",
        "weight": 40.0,
        "kcal100": 32.5,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ziemniaki-gotowane-2192",
        "name": "ziemniaki gotowane",
        "weight": 60.0,
        "kcal100": 78.3,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jajo-w-kosteczke-53717",
        "name": "jajo w kosteczkę",
        "weight": 50.0,
        "kcal100": 152.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-oliwa-37209",
        "name": "oliwa",
        "weight": 9.0,
        "kcal100": 900.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-salatka-z-feta",
    "title": "sałatka z fetą",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-pomidor-34114",
        "name": "pomidor",
        "weight": 100.0,
        "kcal100": 28.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-papryka-45855",
        "name": "papryka",
        "weight": 80.0,
        "kcal100": 28.7,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-feta-light-93675",
        "name": "feta light",
        "weight": 40.0,
        "kcal100": 180.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-cebula-24207",
        "name": "cebula",
        "weight": 100.0,
        "kcal100": 23.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ogorki-73648",
        "name": "ogórki",
        "weight": 100.0,
        "kcal100": 14.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-oliwa-88136",
        "name": "oliwa",
        "weight": 18.0,
        "kcal100": 894.4,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-salata-lodowa-96757",
        "name": "sałata lodowa",
        "weight": 50.0,
        "kcal100": 32.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-pieczywo",
    "title": "pieczywo",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-grahamka-26376",
        "name": "grahamka",
        "weight": 50.0,
        "kcal100": 260.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-maslo-97542",
        "name": "masło",
        "weight": 5.0,
        "kcal100": 780.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-napoj-b-c",
    "title": "napój b/c",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-herbata-zielona-5049",
        "name": "herbata zielona",
        "weight": 0,
        "kcal100": 0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-jajo-na-miekko",
    "title": "jajo na miękko",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-jajo-99543",
        "name": "jajo",
        "weight": 50.0,
        "kcal100": 152.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-szczypiorek-salata-74943",
        "name": "szczypiorek, sałata",
        "weight": 10.0,
        "kcal100": 10.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-ryba-w-warzywach",
    "title": "ryba w warzywach",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-np-mintaj-30683",
        "name": "np. mintaj",
        "weight": 200.0,
        "kcal100": 80.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-mieszane-55857",
        "name": "warzywa mieszane",
        "weight": 200.0,
        "kcal100": 37.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-olej-74705",
        "name": "olej",
        "weight": 18.0,
        "kcal100": 877.8,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-salatka-owocowa",
    "title": "sałatka owocowa",
    "category": "Importowane",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-kiwi-73552",
        "name": "kiwi",
        "weight": 80.0,
        "kcal100": 40.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-49677",
        "name": "jogurt naturalny",
        "weight": 48.0,
        "kcal100": 61.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-banan-47921",
        "name": "banan",
        "weight": 60.0,
        "kcal100": 97.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-pomarancza-98082",
        "name": "pomarańcza",
        "weight": 100.0,
        "kcal100": 47.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-poniedzialek-vi-dzien-sniadanie-i",
    "title": "Śniadanie I",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast1",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-musli-naturalne-25107",
        "name": "musli naturalne",
        "weight": 80.0,
        "kcal100": 366.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-melon-42111",
        "name": "melon",
        "weight": 120.0,
        "kcal100": 40.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-42575",
        "name": "jogurt naturalny",
        "weight": 250.0,
        "kcal100": 61.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-poniedzialek-vi-dzien-obiad",
    "title": "Obiad",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-warzywa-wiosenne-64742",
        "name": "warzywa wiosenne",
        "weight": 200.0,
        "kcal100": 40.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-23976",
        "name": "jogurt naturalny",
        "weight": 48.0,
        "kcal100": 60.4,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-mintaj-95335",
        "name": "mintaj",
        "weight": 150.0,
        "kcal100": 160.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-przyprawy-27462",
        "name": "przyprawy",
        "weight": 0,
        "kcal100": 0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-olej-62500",
        "name": "olej",
        "weight": 18.0,
        "kcal100": 872.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ziemniaki-gotowane-60679",
        "name": "ziemniaki gotowane",
        "weight": 180.0,
        "kcal100": 77.8,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-wtorek-v-dzien-sniadanie-i",
    "title": "Śniadanie I",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast1",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-musli-naturalne-14616",
        "name": "musli naturalne",
        "weight": 70.0,
        "kcal100": 365.7,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-melon-42111",
        "name": "melon",
        "weight": 120.0,
        "kcal100": 40.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-42575",
        "name": "jogurt naturalny",
        "weight": 250.0,
        "kcal100": 61.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-wtorek-v-dzien-sniadanie-ii",
    "title": "Śniadanie II",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast2",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-jablko-32701",
        "name": "jabłko",
        "weight": 200.0,
        "kcal100": 47.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-grahamka-26376",
        "name": "grahamka",
        "weight": 50.0,
        "kcal100": 260.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-kefir-30793",
        "name": "kefir",
        "weight": 200.0,
        "kcal100": 51.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-wtorek-v-dzien-lunch",
    "title": "Lunch",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-ryba-93696",
        "name": "ryba",
        "weight": 200.0,
        "kcal100": 160.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-82448",
        "name": "warzywa",
        "weight": 200.0,
        "kcal100": 60.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-sroda-ii-dzien-sniadanie-i",
    "title": "Śniadanie I",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast1",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-musli-naturalne-81458",
        "name": "musli naturalne",
        "weight": 60.0,
        "kcal100": 366.7,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-banan-90552",
        "name": "banan",
        "weight": 120.0,
        "kcal100": 96.7,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-38721",
        "name": "jogurt naturalny",
        "weight": 200.0,
        "kcal100": 61.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-sroda-ii-dzien-lunch",
    "title": "Lunch",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-typu-barszcz-bialy-98688",
        "name": "typu barszcz biały",
        "weight": 200.0,
        "kcal100": 120.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jablka-67773",
        "name": "jabłka",
        "weight": 400.0,
        "kcal100": 47.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-sroda-ii-dzien-kolacja",
    "title": "Kolacja",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "dinner",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-mintaj-sol-cytryna-42975",
        "name": "mintaj, sól, cytryna",
        "weight": 200.0,
        "kcal100": 70.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-olej-przyprawy-42995",
        "name": "olej, przyprawy",
        "weight": 18.0,
        "kcal100": 877.8,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-kiszona-kapusta-marchew-63989",
        "name": "kiszona kapusta, marchew",
        "weight": 150.0,
        "kcal100": 30.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-czwartek-iii-dzien-sniadanie-i",
    "title": "Śniadanie I",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast1",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-musli-naturalne-25107",
        "name": "musli naturalne",
        "weight": 80.0,
        "kcal100": 366.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-banan-68598",
        "name": "banan",
        "weight": 60.0,
        "kcal100": 98.3,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-42575",
        "name": "jogurt naturalny",
        "weight": 250.0,
        "kcal100": 61.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-czwartek-iii-dzien-lunch",
    "title": "Lunch",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-ryba-6979",
        "name": "ryba",
        "weight": 150.0,
        "kcal100": 160.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-82448",
        "name": "warzywa",
        "weight": 200.0,
        "kcal100": 60.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-piatek-iv-dzien-sniadanie-i",
    "title": "Śniadanie I",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast1",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-musli-naturalne-90785",
        "name": "musli naturalne",
        "weight": 32.0,
        "kcal100": 365.6,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-42575",
        "name": "jogurt naturalny",
        "weight": 250.0,
        "kcal100": 61.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-piatek-iv-dzien-lunch",
    "title": "Lunch",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-ryba-93696",
        "name": "ryba",
        "weight": 200.0,
        "kcal100": 160.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-82448",
        "name": "warzywa",
        "weight": 200.0,
        "kcal100": 60.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ziemniaki-gotowane-60679",
        "name": "ziemniaki gotowane",
        "weight": 180.0,
        "kcal100": 77.8,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-sobota-i-dzien-sniadanie-i",
    "title": "Śniadanie I",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast1",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-chleb-razowy-5491",
        "name": "chleb razowy",
        "weight": 70.0,
        "kcal100": 228.6,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-maslo-44040",
        "name": "masło",
        "weight": 10.0,
        "kcal100": 0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-poledwica-19783",
        "name": "polędwica",
        "weight": 40.0,
        "kcal100": 165.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-na-kanapke-27634",
        "name": "warzywa na kanapkę",
        "weight": 100.0,
        "kcal100": 14.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-sobota-i-dzien-lunch",
    "title": "Lunch",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-ryba-93696",
        "name": "ryba",
        "weight": 200.0,
        "kcal100": 160.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-82448",
        "name": "warzywa",
        "weight": 200.0,
        "kcal100": 60.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-sobota-i-dzien-obiado-kolacja",
    "title": "Obiado-kolacja",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-pomidor-34114",
        "name": "pomidor",
        "weight": 100.0,
        "kcal100": 28.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-papryka-45855",
        "name": "papryka",
        "weight": 80.0,
        "kcal100": 28.7,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-feta-light-93675",
        "name": "feta light",
        "weight": 40.0,
        "kcal100": 180.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-cebula-24207",
        "name": "cebula",
        "weight": 100.0,
        "kcal100": 23.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ogorki-73648",
        "name": "ogórki",
        "weight": 100.0,
        "kcal100": 14.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-oliwa-88136",
        "name": "oliwa",
        "weight": 18.0,
        "kcal100": 894.4,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-salata-lodowa-96757",
        "name": "sałata lodowa",
        "weight": 50.0,
        "kcal100": 32.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-grahamka-26376",
        "name": "grahamka",
        "weight": 50.0,
        "kcal100": 260.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-maslo-97542",
        "name": "masło",
        "weight": 5.0,
        "kcal100": 780.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-niedziela-vii-dzien-sniadanie-i",
    "title": "Śniadanie I",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast1",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-sok-owocowy-swiezy-8605",
        "name": "sok owocowy świeży",
        "weight": 200.0,
        "kcal100": 44.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-musli-naturalne-25107",
        "name": "musli naturalne",
        "weight": 80.0,
        "kcal100": 366.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-banan-39240",
        "name": "banan",
        "weight": 60.0,
        "kcal100": 96.7,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jogurt-naturalny-42575",
        "name": "jogurt naturalny",
        "weight": 250.0,
        "kcal100": 61.2,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-niedziela-vii-dzien-sniadanie-ii",
    "title": "Śniadanie II",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "breakfast2",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-herbata-zielona-5049",
        "name": "herbata zielona",
        "weight": 0,
        "kcal100": 0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-grahamka-26376",
        "name": "grahamka",
        "weight": 50.0,
        "kcal100": 260.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-jajo-99543",
        "name": "jajo",
        "weight": 50.0,
        "kcal100": 152.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-szczypiorek-salata-74943",
        "name": "szczypiorek, sałata",
        "weight": 10.0,
        "kcal100": 10.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  },
  {
    "id": "import-niedziela-vii-dzien-obiad",
    "title": "Obiad",
    "category": "Importowane posiłki",
    "recipeType": "single",
    "mealCategory": "lunch",
    "prep": "",
    "image": "",
    "ingredients": [
      {
        "id": "ing-np-mintaj-30683",
        "name": "np. mintaj",
        "weight": 200.0,
        "kcal100": 80.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-warzywa-mieszane-55857",
        "name": "warzywa mieszane",
        "weight": 200.0,
        "kcal100": 37.0,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-olej-74705",
        "name": "olej",
        "weight": 18.0,
        "kcal100": 877.8,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      },
      {
        "id": "ing-ziemniaki-gotowane-82929",
        "name": "ziemniaki gotowane",
        "weight": 120.0,
        "kcal100": 78.3,
        "protein100": 0,
        "fat100": 0,
        "carbs100": 0
      }
    ]
  }
];

  const importedMealPlans = [
  {
    "id": "import-plan-poniedzialek-vi-dzien",
    "name": "Poniedziałek – VI dzień",
    "meals": [
      {
        "meal": "breakfast1",
        "recipeId": "import-poniedzialek-vi-dzien-sniadanie-i",
        "portionWeight": 650.0,
        "customIngredients": [
          {
            "id": "ing-sok-owocowy-swiezy-8605",
            "name": "sok owocowy świeży",
            "weight": 200.0,
            "kcal100": 44.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-musli-naturalne-25107",
            "name": "musli naturalne",
            "weight": 80.0,
            "kcal100": 366.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-melon-42111",
            "name": "melon",
            "weight": 120.0,
            "kcal100": 40.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-42575",
            "name": "jogurt naturalny",
            "weight": 250.0,
            "kcal100": 61.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "breakfast2",
        "recipeId": "import-kanapka",
        "portionWeight": 79.0,
        "customIngredients": [
          {
            "id": "ing-grahamka-26376",
            "name": "grahamka",
            "weight": 50.0,
            "kcal100": 260.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ser-zolty-hit-36727",
            "name": "ser żółty HIT",
            "weight": 20.0,
            "kcal100": 300.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-koncentrat-pomidorowy-74440",
            "name": "koncentrat pomidorowy",
            "weight": 9.0,
            "kcal100": 100.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "lunch",
        "recipeId": "import-poniedzialek-vi-dzien-obiad",
        "portionWeight": 596.0,
        "customIngredients": [
          {
            "id": "ing-warzywa-wiosenne-64742",
            "name": "warzywa wiosenne",
            "weight": 200.0,
            "kcal100": 40.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-23976",
            "name": "jogurt naturalny",
            "weight": 48.0,
            "kcal100": 60.4,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-mintaj-95335",
            "name": "mintaj",
            "weight": 150.0,
            "kcal100": 160.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-przyprawy-27462",
            "name": "przyprawy",
            "weight": 0,
            "kcal100": 0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-olej-62500",
            "name": "olej",
            "weight": 18.0,
            "kcal100": 872.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ziemniaki-gotowane-60679",
            "name": "ziemniaki gotowane",
            "weight": 180.0,
            "kcal100": 77.8,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "dinner",
        "recipeId": "import-koktajl",
        "portionWeight": 350.0,
        "customIngredients": [
          {
            "id": "ing-truskawki-mrozone-4806",
            "name": "truskawki mrożone",
            "weight": 150.0,
            "kcal100": 28.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-kefir-30793",
            "name": "kefir",
            "weight": 200.0,
            "kcal100": 51.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      }
    ]
  },
  {
    "id": "import-plan-wtorek-v-dzien",
    "name": "Wtorek – V dzień",
    "meals": [
      {
        "meal": "breakfast1",
        "recipeId": "import-wtorek-v-dzien-sniadanie-i",
        "portionWeight": 640.0,
        "customIngredients": [
          {
            "id": "ing-sok-owocowy-swiezy-8605",
            "name": "sok owocowy świeży",
            "weight": 200.0,
            "kcal100": 44.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-musli-naturalne-14616",
            "name": "musli naturalne",
            "weight": 70.0,
            "kcal100": 365.7,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-melon-42111",
            "name": "melon",
            "weight": 120.0,
            "kcal100": 40.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-42575",
            "name": "jogurt naturalny",
            "weight": 250.0,
            "kcal100": 61.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "breakfast2",
        "recipeId": "import-wtorek-v-dzien-sniadanie-ii",
        "portionWeight": 450.0,
        "customIngredients": [
          {
            "id": "ing-jablko-32701",
            "name": "jabłko",
            "weight": 200.0,
            "kcal100": 47.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-grahamka-26376",
            "name": "grahamka",
            "weight": 50.0,
            "kcal100": 260.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-kefir-30793",
            "name": "kefir",
            "weight": 200.0,
            "kcal100": 51.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "lunch",
        "recipeId": "import-wtorek-v-dzien-lunch",
        "portionWeight": 400.0,
        "customIngredients": [
          {
            "id": "ing-ryba-93696",
            "name": "ryba",
            "weight": 200.0,
            "kcal100": 160.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-warzywa-82448",
            "name": "warzywa",
            "weight": 200.0,
            "kcal100": 60.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "dinner",
        "recipeId": "import-warzywa-z-patelni",
        "portionWeight": 368.0,
        "customIngredients": [
          {
            "id": "ing-olej-20223",
            "name": "olej",
            "weight": 18.0,
            "kcal100": 844.4,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jajo-99543",
            "name": "jajo",
            "weight": 50.0,
            "kcal100": 152.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-warzywa-mrozone-2684",
            "name": "warzywa mrożone",
            "weight": 300.0,
            "kcal100": 37.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      }
    ]
  },
  {
    "id": "import-plan-sroda-ii-dzien",
    "name": "Środa – II dzień",
    "meals": [
      {
        "meal": "breakfast1",
        "recipeId": "import-sroda-ii-dzien-sniadanie-i",
        "portionWeight": 580.0,
        "customIngredients": [
          {
            "id": "ing-sok-owocowy-swiezy-8605",
            "name": "sok owocowy świeży",
            "weight": 200.0,
            "kcal100": 44.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-musli-naturalne-81458",
            "name": "musli naturalne",
            "weight": 60.0,
            "kcal100": 366.7,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-banan-90552",
            "name": "banan",
            "weight": 120.0,
            "kcal100": 96.7,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-38721",
            "name": "jogurt naturalny",
            "weight": 200.0,
            "kcal100": 61.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "breakfast2",
        "recipeId": "import-kanapka",
        "portionWeight": 79.0,
        "customIngredients": [
          {
            "id": "ing-grahamka-26376",
            "name": "grahamka",
            "weight": 50.0,
            "kcal100": 260.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ser-zolty-hit-36727",
            "name": "ser żółty HIT",
            "weight": 20.0,
            "kcal100": 300.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-koncentrat-pomidorowy-74440",
            "name": "koncentrat pomidorowy",
            "weight": 9.0,
            "kcal100": 100.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "lunch",
        "recipeId": "import-sroda-ii-dzien-lunch",
        "portionWeight": 600.0,
        "customIngredients": [
          {
            "id": "ing-typu-barszcz-bialy-98688",
            "name": "typu barszcz biały",
            "weight": 200.0,
            "kcal100": 120.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jablka-67773",
            "name": "jabłka",
            "weight": 400.0,
            "kcal100": 47.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "dinner",
        "recipeId": "import-sroda-ii-dzien-kolacja",
        "portionWeight": 368.0,
        "customIngredients": [
          {
            "id": "ing-mintaj-sol-cytryna-42975",
            "name": "mintaj, sól, cytryna",
            "weight": 200.0,
            "kcal100": 70.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-olej-przyprawy-42995",
            "name": "olej, przyprawy",
            "weight": 18.0,
            "kcal100": 877.8,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-kiszona-kapusta-marchew-63989",
            "name": "kiszona kapusta, marchew",
            "weight": 150.0,
            "kcal100": 30.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      }
    ]
  },
  {
    "id": "import-plan-czwartek-iii-dzien",
    "name": "Czwartek – III dzień",
    "meals": [
      {
        "meal": "breakfast1",
        "recipeId": "import-czwartek-iii-dzien-sniadanie-i",
        "portionWeight": 590.0,
        "customIngredients": [
          {
            "id": "ing-sok-owocowy-swiezy-8605",
            "name": "sok owocowy świeży",
            "weight": 200.0,
            "kcal100": 44.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-musli-naturalne-25107",
            "name": "musli naturalne",
            "weight": 80.0,
            "kcal100": 366.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-banan-68598",
            "name": "banan",
            "weight": 60.0,
            "kcal100": 98.3,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-42575",
            "name": "jogurt naturalny",
            "weight": 250.0,
            "kcal100": 61.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "breakfast2",
        "recipeId": "import-jogurt",
        "portionWeight": 250.0,
        "customIngredients": [
          {
            "id": "ing-jogurt-owocowy-pitny-36989",
            "name": "jogurt owocowy pitny",
            "weight": 250.0,
            "kcal100": 81.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "lunch",
        "recipeId": "import-czwartek-iii-dzien-lunch",
        "portionWeight": 350.0,
        "customIngredients": [
          {
            "id": "ing-ryba-6979",
            "name": "ryba",
            "weight": 150.0,
            "kcal100": 160.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-warzywa-82448",
            "name": "warzywa",
            "weight": 200.0,
            "kcal100": 60.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "dinner",
        "recipeId": "import-makaron-z-serem",
        "portionWeight": 163.0,
        "customIngredients": [
          {
            "id": "ing-makaron-22613",
            "name": "makaron",
            "weight": 60.0,
            "kcal100": 366.7,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-23976",
            "name": "jogurt naturalny",
            "weight": 48.0,
            "kcal100": 60.4,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-cukier-68696",
            "name": "cukier",
            "weight": 5.0,
            "kcal100": 400.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ser-bialy-chudy-81888",
            "name": "ser biały chudy",
            "weight": 50.0,
            "kcal100": 104.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      }
    ]
  },
  {
    "id": "import-plan-piatek-iv-dzien",
    "name": "Piątek – IV dzień",
    "meals": [
      {
        "meal": "breakfast1",
        "recipeId": "import-piatek-iv-dzien-sniadanie-i",
        "portionWeight": 482.0,
        "customIngredients": [
          {
            "id": "ing-sok-owocowy-swiezy-8605",
            "name": "sok owocowy świeży",
            "weight": 200.0,
            "kcal100": 44.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-musli-naturalne-90785",
            "name": "musli naturalne",
            "weight": 32.0,
            "kcal100": 365.6,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-42575",
            "name": "jogurt naturalny",
            "weight": 250.0,
            "kcal100": 61.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "breakfast2",
        "recipeId": "import-serek",
        "portionWeight": 150.0,
        "customIngredients": [
          {
            "id": "ing-danio-80249",
            "name": "danio",
            "weight": 150.0,
            "kcal100": 161.3,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "lunch",
        "recipeId": "import-piatek-iv-dzien-lunch",
        "portionWeight": 580.0,
        "customIngredients": [
          {
            "id": "ing-ryba-93696",
            "name": "ryba",
            "weight": 200.0,
            "kcal100": 160.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-warzywa-82448",
            "name": "warzywa",
            "weight": 200.0,
            "kcal100": 60.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ziemniaki-gotowane-60679",
            "name": "ziemniaki gotowane",
            "weight": 180.0,
            "kcal100": 77.8,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "dinner",
        "recipeId": "import-salatka-sledziowa",
        "portionWeight": 259.0,
        "customIngredients": [
          {
            "id": "ing-sledz-45499",
            "name": "śledź",
            "weight": 100.0,
            "kcal100": 87.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-cebula-72414",
            "name": "cebula",
            "weight": 40.0,
            "kcal100": 32.5,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ziemniaki-gotowane-2192",
            "name": "ziemniaki gotowane",
            "weight": 60.0,
            "kcal100": 78.3,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jajo-w-kosteczke-53717",
            "name": "jajo w kosteczkę",
            "weight": 50.0,
            "kcal100": 152.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-oliwa-37209",
            "name": "oliwa",
            "weight": 9.0,
            "kcal100": 900.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      }
    ]
  },
  {
    "id": "import-plan-sobota-i-dzien",
    "name": "Sobota – I dzień",
    "meals": [
      {
        "meal": "breakfast1",
        "recipeId": "import-sobota-i-dzien-sniadanie-i",
        "portionWeight": 420.0,
        "customIngredients": [
          {
            "id": "ing-sok-owocowy-swiezy-8605",
            "name": "sok owocowy świeży",
            "weight": 200.0,
            "kcal100": 44.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-chleb-razowy-5491",
            "name": "chleb razowy",
            "weight": 70.0,
            "kcal100": 228.6,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-maslo-44040",
            "name": "masło",
            "weight": 10.0,
            "kcal100": 0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-poledwica-19783",
            "name": "polędwica",
            "weight": 40.0,
            "kcal100": 165.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-warzywa-na-kanapke-27634",
            "name": "warzywa na kanapkę",
            "weight": 100.0,
            "kcal100": 14.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "breakfast2",
        "recipeId": "import-kanapka",
        "portionWeight": 79.0,
        "customIngredients": [
          {
            "id": "ing-grahamka-26376",
            "name": "grahamka",
            "weight": 50.0,
            "kcal100": 260.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ser-zolty-hit-36727",
            "name": "ser żółty HIT",
            "weight": 20.0,
            "kcal100": 300.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-koncentrat-pomidorowy-74440",
            "name": "koncentrat pomidorowy",
            "weight": 9.0,
            "kcal100": 100.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "lunch",
        "recipeId": "import-sobota-i-dzien-lunch",
        "portionWeight": 400.0,
        "customIngredients": [
          {
            "id": "ing-ryba-93696",
            "name": "ryba",
            "weight": 200.0,
            "kcal100": 160.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-warzywa-82448",
            "name": "warzywa",
            "weight": 200.0,
            "kcal100": 60.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      }
    ]
  },
  {
    "id": "import-plan-niedziela-vii-dzien",
    "name": "Niedziela – VII dzień",
    "meals": [
      {
        "meal": "breakfast1",
        "recipeId": "import-niedziela-vii-dzien-sniadanie-i",
        "portionWeight": 590.0,
        "customIngredients": [
          {
            "id": "ing-sok-owocowy-swiezy-8605",
            "name": "sok owocowy świeży",
            "weight": 200.0,
            "kcal100": 44.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-musli-naturalne-25107",
            "name": "musli naturalne",
            "weight": 80.0,
            "kcal100": 366.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-banan-39240",
            "name": "banan",
            "weight": 60.0,
            "kcal100": 96.7,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-42575",
            "name": "jogurt naturalny",
            "weight": 250.0,
            "kcal100": 61.2,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "breakfast2",
        "recipeId": "import-niedziela-vii-dzien-sniadanie-ii",
        "portionWeight": 110.0,
        "customIngredients": [
          {
            "id": "ing-herbata-zielona-5049",
            "name": "herbata zielona",
            "weight": 0,
            "kcal100": 0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-grahamka-26376",
            "name": "grahamka",
            "weight": 50.0,
            "kcal100": 260.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jajo-99543",
            "name": "jajo",
            "weight": 50.0,
            "kcal100": 152.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-szczypiorek-salata-74943",
            "name": "szczypiorek, sałata",
            "weight": 10.0,
            "kcal100": 10.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "lunch",
        "recipeId": "import-niedziela-vii-dzien-obiad",
        "portionWeight": 538.0,
        "customIngredients": [
          {
            "id": "ing-np-mintaj-30683",
            "name": "np. mintaj",
            "weight": 200.0,
            "kcal100": 80.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-warzywa-mieszane-55857",
            "name": "warzywa mieszane",
            "weight": 200.0,
            "kcal100": 37.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-olej-74705",
            "name": "olej",
            "weight": 18.0,
            "kcal100": 877.8,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-ziemniaki-gotowane-82929",
            "name": "ziemniaki gotowane",
            "weight": 120.0,
            "kcal100": 78.3,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      },
      {
        "meal": "dinner",
        "recipeId": "import-salatka-owocowa",
        "portionWeight": 288.0,
        "customIngredients": [
          {
            "id": "ing-kiwi-73552",
            "name": "kiwi",
            "weight": 80.0,
            "kcal100": 40.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-jogurt-naturalny-49677",
            "name": "jogurt naturalny",
            "weight": 48.0,
            "kcal100": 61.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-banan-47921",
            "name": "banan",
            "weight": 60.0,
            "kcal100": 97.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          },
          {
            "id": "ing-pomarancza-98082",
            "name": "pomarańcza",
            "weight": 100.0,
            "kcal100": 47.0,
            "protein100": 0,
            "fat100": 0,
            "carbs100": 0
          }
        ]
      }
    ]
  }
];

  const importedAssignments = {
  "2006-01-26": "import-plan-niedziela-vii-dzien"
};

  const planMeals = [
    { meal: "breakfast1", recipeId: seedRecipes[0].id, portionWeight: 400, customIngredients: clone(seedRecipes[0].ingredients) },
    { meal: "breakfast2", recipeId: seedRecipes[1].id, portionWeight: 330, customIngredients: clone(seedRecipes[1].ingredients) },
    { meal: "lunch", recipeId: seedRecipes[2].id, portionWeight: 390, customIngredients: clone(seedRecipes[2].ingredients) },
    { meal: "snack", recipeId: seedRecipes[3].id, portionWeight: 210, customIngredients: clone(seedRecipes[3].ingredients) },
    { meal: "dinner", recipeId: seedRecipes[4].id, portionWeight: 400, customIngredients: clone(seedRecipes[4].ingredients) }
  ];


  const baseProducts = [
  {
    "id": "base-platki-owsiane",
    "name": "płatki owsiane",
    "category": "zbożowe",
    "kcal100": 389,
    "protein100": 16.9,
    "fat100": 6.9,
    "carbs100": 66.3,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-ryz-bialy-suchy",
    "name": "ryż biały suchy",
    "category": "zbożowe",
    "kcal100": 365,
    "protein100": 7.1,
    "fat100": 0.7,
    "carbs100": 80.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-ryz-brazowy-suchy",
    "name": "ryż brązowy suchy",
    "category": "zbożowe",
    "kcal100": 370,
    "protein100": 7.9,
    "fat100": 2.9,
    "carbs100": 77.2,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-kasza-gryczana-sucha",
    "name": "kasza gryczana sucha",
    "category": "zbożowe",
    "kcal100": 343,
    "protein100": 13.3,
    "fat100": 3.4,
    "carbs100": 71.5,
    "source": "EU food composition tables"
  },
  {
    "id": "base-kasza-jaglana-sucha",
    "name": "kasza jaglana sucha",
    "category": "zbożowe",
    "kcal100": 378,
    "protein100": 11.0,
    "fat100": 4.2,
    "carbs100": 72.9,
    "source": "EU food composition tables"
  },
  {
    "id": "base-makaron-pszenny-suchy",
    "name": "makaron pszenny suchy",
    "category": "zbożowe",
    "kcal100": 371,
    "protein100": 13.0,
    "fat100": 1.5,
    "carbs100": 75.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-makaron-pelnoziarnisty-suchy",
    "name": "makaron pełnoziarnisty suchy",
    "category": "zbożowe",
    "kcal100": 348,
    "protein100": 13.0,
    "fat100": 2.5,
    "carbs100": 71.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-chleb-zytni",
    "name": "chleb żytni",
    "category": "pieczywo",
    "kcal100": 259,
    "protein100": 8.5,
    "fat100": 3.3,
    "carbs100": 48.0,
    "source": "EU food composition tables"
  },
  {
    "id": "base-chleb-pszenny",
    "name": "chleb pszenny",
    "category": "pieczywo",
    "kcal100": 265,
    "protein100": 9.0,
    "fat100": 3.2,
    "carbs100": 49.0,
    "source": "EU food composition tables"
  },
  {
    "id": "base-maka-pszenna",
    "name": "mąka pszenna",
    "category": "zbożowe",
    "kcal100": 364,
    "protein100": 10.3,
    "fat100": 1.0,
    "carbs100": 76.3,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-mleko-15",
    "name": "mleko 1,5%",
    "category": "nabiał",
    "kcal100": 47,
    "protein100": 3.4,
    "fat100": 1.5,
    "carbs100": 4.9,
    "source": "EU food composition tables"
  },
  {
    "id": "base-mleko-32",
    "name": "mleko 3,2%",
    "category": "nabiał",
    "kcal100": 61,
    "protein100": 3.2,
    "fat100": 3.3,
    "carbs100": 4.8,
    "source": "EU food composition tables"
  },
  {
    "id": "base-jogurt-naturalny",
    "name": "jogurt naturalny",
    "category": "nabiał",
    "kcal100": 61,
    "protein100": 3.5,
    "fat100": 3.3,
    "carbs100": 4.7,
    "source": "EU food composition tables"
  },
  {
    "id": "base-jogurt-grecki",
    "name": "jogurt grecki",
    "category": "nabiał",
    "kcal100": 97,
    "protein100": 9.0,
    "fat100": 5.0,
    "carbs100": 3.8,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-twarog-poltlusty",
    "name": "twaróg półtłusty",
    "category": "nabiał",
    "kcal100": 133,
    "protein100": 18.7,
    "fat100": 4.7,
    "carbs100": 3.7,
    "source": "EU food composition tables"
  },
  {
    "id": "base-ser-zolty",
    "name": "ser żółty",
    "category": "nabiał",
    "kcal100": 356,
    "protein100": 24.9,
    "fat100": 27.4,
    "carbs100": 2.2,
    "source": "EU food composition tables"
  },
  {
    "id": "base-jajko-kurze",
    "name": "jajko kurze",
    "category": "jaja",
    "kcal100": 143,
    "protein100": 12.6,
    "fat100": 9.5,
    "carbs100": 0.7,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-piers-z-kurczaka",
    "name": "pierś z kurczaka",
    "category": "mięso",
    "kcal100": 120,
    "protein100": 22.5,
    "fat100": 2.6,
    "carbs100": 0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-piers-z-indyka",
    "name": "pierś z indyka",
    "category": "mięso",
    "kcal100": 114,
    "protein100": 24.0,
    "fat100": 1.2,
    "carbs100": 0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-wolowina-chuda",
    "name": "wołowina chuda",
    "category": "mięso",
    "kcal100": 158,
    "protein100": 22.0,
    "fat100": 7.0,
    "carbs100": 0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-schab-wieprzowy",
    "name": "schab wieprzowy",
    "category": "mięso",
    "kcal100": 143,
    "protein100": 21.0,
    "fat100": 6.0,
    "carbs100": 0,
    "source": "EU food composition tables"
  },
  {
    "id": "base-losos-filet",
    "name": "łosoś filet",
    "category": "ryby",
    "kcal100": 208,
    "protein100": 20.0,
    "fat100": 13.0,
    "carbs100": 0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-dorsz-filet",
    "name": "dorsz filet",
    "category": "ryby",
    "kcal100": 82,
    "protein100": 18.0,
    "fat100": 0.7,
    "carbs100": 0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-tunczyk-w-sosie-wlasnym",
    "name": "tuńczyk w sosie własnym",
    "category": "ryby",
    "kcal100": 116,
    "protein100": 25.5,
    "fat100": 1.0,
    "carbs100": 0,
    "source": "EU food composition tables"
  },
  {
    "id": "base-soczewica-czerwona-sucha",
    "name": "soczewica czerwona sucha",
    "category": "strączki",
    "kcal100": 352,
    "protein100": 24.6,
    "fat100": 1.1,
    "carbs100": 63.4,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-ciecierzyca-gotowana",
    "name": "ciecierzyca gotowana",
    "category": "strączki",
    "kcal100": 164,
    "protein100": 8.9,
    "fat100": 2.6,
    "carbs100": 27.4,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-fasola-biala-gotowana",
    "name": "fasola biała gotowana",
    "category": "strączki",
    "kcal100": 139,
    "protein100": 9.7,
    "fat100": 0.4,
    "carbs100": 25.1,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-tofu-naturalne",
    "name": "tofu naturalne",
    "category": "strączki",
    "kcal100": 76,
    "protein100": 8.1,
    "fat100": 4.8,
    "carbs100": 1.9,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-ziemniaki",
    "name": "ziemniaki",
    "category": "warzywa",
    "kcal100": 77,
    "protein100": 2.0,
    "fat100": 0.1,
    "carbs100": 17.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-batat",
    "name": "batat",
    "category": "warzywa",
    "kcal100": 86,
    "protein100": 1.6,
    "fat100": 0.1,
    "carbs100": 20.1,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-marchew",
    "name": "marchew",
    "category": "warzywa",
    "kcal100": 41,
    "protein100": 0.9,
    "fat100": 0.2,
    "carbs100": 9.6,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-pomidor",
    "name": "pomidor",
    "category": "warzywa",
    "kcal100": 18,
    "protein100": 0.9,
    "fat100": 0.2,
    "carbs100": 3.9,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-ogorek",
    "name": "ogórek",
    "category": "warzywa",
    "kcal100": 15,
    "protein100": 0.7,
    "fat100": 0.1,
    "carbs100": 3.6,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-papryka-czerwona",
    "name": "papryka czerwona",
    "category": "warzywa",
    "kcal100": 31,
    "protein100": 1.0,
    "fat100": 0.3,
    "carbs100": 6.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-cebula",
    "name": "cebula",
    "category": "warzywa",
    "kcal100": 40,
    "protein100": 1.1,
    "fat100": 0.1,
    "carbs100": 9.3,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-czosnek",
    "name": "czosnek",
    "category": "warzywa",
    "kcal100": 149,
    "protein100": 6.4,
    "fat100": 0.5,
    "carbs100": 33.1,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-brokul",
    "name": "brokuł",
    "category": "warzywa",
    "kcal100": 34,
    "protein100": 2.8,
    "fat100": 0.4,
    "carbs100": 7.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-szpinak",
    "name": "szpinak",
    "category": "warzywa",
    "kcal100": 23,
    "protein100": 2.9,
    "fat100": 0.4,
    "carbs100": 3.6,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-salata",
    "name": "sałata",
    "category": "warzywa",
    "kcal100": 15,
    "protein100": 1.4,
    "fat100": 0.2,
    "carbs100": 2.9,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-cukinia",
    "name": "cukinia",
    "category": "warzywa",
    "kcal100": 17,
    "protein100": 1.2,
    "fat100": 0.3,
    "carbs100": 3.1,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-pieczarki",
    "name": "pieczarki",
    "category": "warzywa",
    "kcal100": 22,
    "protein100": 3.1,
    "fat100": 0.3,
    "carbs100": 3.3,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-banan",
    "name": "banan",
    "category": "owoce",
    "kcal100": 89,
    "protein100": 1.1,
    "fat100": 0.3,
    "carbs100": 22.8,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-jablko",
    "name": "jabłko",
    "category": "owoce",
    "kcal100": 52,
    "protein100": 0.3,
    "fat100": 0.2,
    "carbs100": 13.8,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-gruszka",
    "name": "gruszka",
    "category": "owoce",
    "kcal100": 57,
    "protein100": 0.4,
    "fat100": 0.1,
    "carbs100": 15.2,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-pomarancza",
    "name": "pomarańcza",
    "category": "owoce",
    "kcal100": 47,
    "protein100": 0.9,
    "fat100": 0.1,
    "carbs100": 11.8,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-truskawki",
    "name": "truskawki",
    "category": "owoce",
    "kcal100": 32,
    "protein100": 0.7,
    "fat100": 0.3,
    "carbs100": 7.7,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-borowki",
    "name": "borówki",
    "category": "owoce",
    "kcal100": 57,
    "protein100": 0.7,
    "fat100": 0.3,
    "carbs100": 14.5,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-awokado",
    "name": "awokado",
    "category": "owoce",
    "kcal100": 160,
    "protein100": 2.0,
    "fat100": 14.7,
    "carbs100": 8.5,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-cytryna",
    "name": "cytryna",
    "category": "owoce",
    "kcal100": 29,
    "protein100": 1.1,
    "fat100": 0.3,
    "carbs100": 9.3,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-oliwa",
    "name": "oliwa",
    "category": "tłuszcze",
    "kcal100": 884,
    "protein100": 0,
    "fat100": 100,
    "carbs100": 0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-olej-rzepakowy",
    "name": "olej rzepakowy",
    "category": "tłuszcze",
    "kcal100": 884,
    "protein100": 0,
    "fat100": 100,
    "carbs100": 0,
    "source": "EU food composition tables"
  },
  {
    "id": "base-orzechy-wloskie",
    "name": "orzechy włoskie",
    "category": "orzechy",
    "kcal100": 654,
    "protein100": 15.2,
    "fat100": 65.2,
    "carbs100": 13.7,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-migdaly",
    "name": "migdały",
    "category": "orzechy",
    "kcal100": 579,
    "protein100": 21.2,
    "fat100": 49.9,
    "carbs100": 21.6,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-maslo-orzechowe",
    "name": "masło orzechowe",
    "category": "orzechy",
    "kcal100": 588,
    "protein100": 25.1,
    "fat100": 50.4,
    "carbs100": 20.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-nasiona-slonecznika",
    "name": "nasiona słonecznika",
    "category": "orzechy",
    "kcal100": 584,
    "protein100": 20.8,
    "fat100": 51.5,
    "carbs100": 20.0,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-siemie-lniane",
    "name": "siemię lniane",
    "category": "orzechy",
    "kcal100": 534,
    "protein100": 18.3,
    "fat100": 42.2,
    "carbs100": 28.9,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-miod",
    "name": "miód",
    "category": "dodatki",
    "kcal100": 304,
    "protein100": 0.3,
    "fat100": 0,
    "carbs100": 82.4,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-cukier",
    "name": "cukier",
    "category": "dodatki",
    "kcal100": 387,
    "protein100": 0,
    "fat100": 0,
    "carbs100": 100,
    "source": "Foundation/generic + EU tables"
  },
  {
    "id": "base-passata-pomidorowa",
    "name": "passata pomidorowa",
    "category": "dodatki",
    "kcal100": 33,
    "protein100": 1.6,
    "fat100": 0.2,
    "carbs100": 6.0,
    "source": "EU food composition tables"
  },
  {
    "id": "base-kakao",
    "name": "kakao",
    "category": "dodatki",
    "kcal100": 228,
    "protein100": 19.6,
    "fat100": 13.7,
    "carbs100": 57.9,
    "source": "Foundation/generic + EU tables"
  }
];

  const defaultState = {
    settings: {
      mealTimes: { ...defaultMealTimes },
      mealCalories: {
        breakfast1: 350,
        breakfast2: 250,
        lunch: 400,
        snack: 200,
        dinner: 300
      },
      theme: "Auto",
      units: "kcal, g",
      shoppingDays: 3,
      shoppingDateFrom: todayISO,
      shoppingDateTo: addDaysISO(todayISO, 7)
    },
    recipes: [],
    mealPlans: [],
    assignments: {},
    userProducts: {},
    nutritionPreference: {},
    shoppingEdits: {},
    shopping: [],
    ui: {
      route: "today",
      selectedDate: todayISO,
      planSort: "nameAsc",
      recipeFilter: "Wszystkie",
      recipeSort: "nameAsc",
      productFilter: "Wszystkie",
      productSort: "nameAsc"
    }
  };
let state = loadState();
  let touchStartX = 0;

  const app = document.querySelector("#app");
  const modalRoot = document.querySelector("#modalRoot");

  document.addEventListener("DOMContentLoaded", async () => {
    await loadAppVersion();
    bindBottomNav();
    registerPWA();
    bindSystemThemeListener();
    applyTheme();
    bindRecipeImportInput();
    bindResourceImportInput();

render();
  });

  let manifestVersion = VERSION;

  async function loadAppVersion() {
    try {
      const response = await fetch("manifest.webmanifest", { cache: "no-store" });
      const data = await response.json();
      manifestVersion = data.version || VERSION;
    } catch (error) {
      manifestVersion = VERSION;
    }
  }

  function appVersion() {
    return manifestVersion || VERSION;
  }

  function effectiveTheme() {
    const theme = state.settings?.theme || "Auto";

    if (theme === "Auto" || theme === "Jak w systemie") {
      return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "Ciemny" : "Jasny";
    }

    return theme;
  }

  function applyTheme() {
    const theme = effectiveTheme();
    const isDark = theme === "Ciemny";

    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document.body?.setAttribute("data-theme", isDark ? "dark" : "light");
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", isDark ? "#121712" : "#2e7d32");
    }
  }

  function bindSystemThemeListener() {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");

    if (!query || query.datasetBound === "true") return;

    query.datasetBound = "true";

    const update = () => {
      if ((state.settings?.theme || "Auto") === "Auto") {
        applyTheme();
      }
    };

    if (query.addEventListener) {
      query.addEventListener("change", update);
    } else if (query.addListener) {
      query.addListener(update);
    }
  }

  function render() {
    applyTheme();
    syncNav();
    const route = state.ui.route;

    if (route === "today") return renderToday();
    if (route === "plans") return renderPlans();
    if (route === "plan-view") return renderPlanView();
    if (route === "edit-plan") return renderEditPlan();
    if (route === "recipes") return renderRecipes();
    if (route === "recipe-view") return renderRecipeView();
    if (route === "edit-recipe") return renderEditRecipe();
    if (route === "shopping") return renderShopping();
    if (route === "more") return renderMore();
    if (route === "products") return renderProducts();
    if (route === "library") return renderLibrary();
    if (route === "settings") return renderSettings();
    if (route === "meal-times") return renderMealTimes();

    state.ui.route = "today";
    renderToday();
  }

  /* ---------- Widok 1: start / jadłospis dnia ---------- */

  function renderToday() {
    const date = parseISODate(state.ui.selectedDate);
    const assignment = state.assignments[state.ui.selectedDate];
    const plan = state.mealPlans.find(p => p.id === assignment);

    app.innerHTML = `
      <section class="screen" id="todayScreen">
        <header class="app-header home-header">
          <div class="home-title-row">
            <h1 class="app-title">Twój jadłospis</h1>
          </div>
        </header>

        <section class="day-switch" aria-label="Nawigacja po dniach">
          <button class="icon-btn" type="button" data-action="prev-day" aria-label="Poprzedni dzień"><span class="material-symbols-rounded">chevron_left</span></button>
          <div class="day-label"><strong>${relativeDayLabel(date)}</strong><span>${formatFullDate(date)}</span></div>
          <button class="icon-btn" type="button" data-action="next-day" aria-label="Następny dzień"><span class="material-symbols-rounded">chevron_right</span></button>
        </section>

        ${plan ? planCard(plan, true) : emptyDayCard()}
      </section>
    `;

    app.querySelector("[data-action='prev-day']").addEventListener("click", () => changeDay(-1));
    app.querySelector("[data-action='next-day']").addEventListener("click", () => changeDay(1));
    app.querySelector(".day-label").addEventListener("click", openDatePicker);
const screen = app.querySelector("#todayScreen");
    screen.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    screen.addEventListener("touchend", e => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 60) changeDay(diff > 0 ? -1 : 1);
    }, { passive: true });

    if (plan) {
      app.querySelector("[data-action='day-plan-menu']").addEventListener("click", () => {
        openActions("Jadłospis", [
          { label: "Edytuj", action: () => editPlanForDate(plan.id) },
          { label: "Zmień", action: () => {
            state.ui.assignPlanMode = true;
            saveState();
            navigate("plans");
          } },
          { label: "Usuń", danger: true, action: () => {
            delete state.assignments[state.ui.selectedDate];
            saveState();
            renderToday();
          }}
        ]);
      });
      bindMealOpens();
    } else {
      app.querySelector("[data-action='assign-plan']").addEventListener("click", () => {
        state.ui.assignPlanMode = true;
        saveState();
        navigate("plans");
      });
      app.querySelector("[data-action='new-plan']")?.addEventListener("click", () => newPlan(true));
    }
  }

  function planCard(plan, withMenu = false) {
    const totals = planTotals(plan);
    const meals = mealOrder.map(key => plan.meals.find(m => m.meal === key)).filter(Boolean);

    return `
      <section class="card plan-card">
        <header class="plan-header">
          <div>
            <h2 class="plan-name">${escapeHTML(plan.name)}</h2>
            ${nutritionStrip(totals)}
          </div>
          ${withMenu ? `
            <button class="overflow-btn day-plan-menu" type="button" data-action="day-plan-menu" aria-label="Opcje jadłospisu"><span class="material-symbols-rounded">more_vert</span></button>
          ` : ``}
        </header>

        <div class="meal-list">
          ${meals.map(mealItemCard).join("")}
        </div>
      </section>
    `;
  }

  function emptyDayCard() {
    return `
      <section class="card add-day-card empty-plan-card">
        <div class="empty-plan-icon"><span class="material-symbols-rounded">event_note</span></div>
        <h2 class="empty-plan-title">Brak jadłospisu</h2>
        <p class="empty-plan-text">Na ten dzień nie przypisano jeszcze jadłospisu.</p>
        <button class="primary-btn compact-primary-btn" type="button" data-action="assign-plan">+ Dodaj jadłospis</button>
      </section>
    `;
  }

  function mealItemCard(meal) {
    const recipe = recipeById(meal.recipeId);
    const totals = ingredientsTotals(meal.customIngredients || recipe?.ingredients || []);
    const title = mealLabels[meal.meal] || "Posiłek";
    const time = state.settings.mealTimes[meal.meal] || "";
    const image = recipe?.image || "assets/placeholder-food.png";
    return `
      <article class="meal-card" data-open-meal="${meal.meal}">
        <img class="meal-thumb" src="${image}" alt="" onerror="this.src='assets/placeholder-food.png'">
        <div>
          <h3 class="meal-title">${title}</h3>
          <div class="meal-time">${time}</div>
          <p class="meal-name">${escapeHTML(recipe?.title || "Bez nazwy")}</p>
        </div>
        ${mealNutritionColumn(totals)}
      </article>
    `;
  }

  /* ---------- Widok 2: lista jadłospisów ---------- */

  function renderPlans() {
    const sorted = sortPlans([...state.mealPlans]);
    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">Jadłospisy</h1>
          <div class="header-actions">
            <button class="icon-btn" type="button" data-action="new-plan" aria-label="Nowy jadłospis"><span class="material-symbols-rounded">add</span></button>
            <button class="icon-btn" type="button" data-action="import-plan" aria-label="Bazę jadłospisów"><span class="material-symbols-rounded">download</span></button>
          </div>
        </header>

        ${state.ui.assignPlanMode ? `<p class="card card-pad small muted assign-note">Wybierz jadłospis, żeby zobaczyć podgląd i przypisać go do wybranego dnia.</p>` : ""}

        <div class="search-input">
          <input class="form-control" id="planSearch" type="search" placeholder="Szukaj jadłospisu...">
        </div>

        <div class="sort-bar compact-sort-bar" aria-label="Sortowanie jadłospisów">
          <button class="sort-pill compact-sort-pill ${state.ui.planSort?.startsWith("name") ? "active" : ""}" data-sort-toggle="name" type="button" aria-label="Sortuj według nazwy">
            <span>AZ</span>
            <span class="material-symbols-rounded">${state.ui.planSort === "nameDesc" ? "arrow_downward" : "arrow_upward"}</span>
          </button>
          <button class="sort-pill compact-sort-pill ${state.ui.planSort?.startsWith("kcal") ? "active" : ""}" data-sort-toggle="kcal" type="button" aria-label="Sortuj według kalorii">
            <span class="material-symbols-rounded">local_fire_department</span>
            <span class="material-symbols-rounded">${state.ui.planSort === "kcalDesc" ? "arrow_downward" : "arrow_upward"}</span>
          </button>
        </div>

        <div id="plansList">
          ${sorted.map(planListCard).join("")}
        </div>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => {
      if (state.ui.assignPlanMode) {
        state.ui.assignPlanMode = false;
        saveState();
        navigate("today");
        return;
      }

      navigate("library");
    });
    app.querySelector("[data-action='new-plan']").addEventListener("click", () => newPlan(false));
    app.querySelector("[data-action='import-plan']")?.addEventListener("click", () => openResourceImportPicker("mealPlan"));
    app.querySelector("[data-action='cancel-assign']")?.addEventListener("click", () => {
      state.ui.assignPlanMode = false;
      saveState();
      applyTheme();
      navigate("today");
    });

    app.querySelectorAll("[data-sort-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.sortToggle;
        if (type === "name") {
          state.ui.planSort = state.ui.planSort === "nameAsc" ? "nameDesc" : "nameAsc";
        } else {
          state.ui.planSort = state.ui.planSort === "kcalAsc" ? "kcalDesc" : "kcalAsc";
        }
        saveState();
        renderPlans();
      });
    });

    app.querySelector("#planSearch").addEventListener("input", e => {
      const q = e.target.value.toLowerCase().trim();
      app.querySelector("#plansList").innerHTML = sortPlans([...state.mealPlans])
        .filter(p => p.name.toLowerCase().includes(q))
        .map(planListCard).join("") || emptyList("Brak jadłospisów.");
      bindPlanList();
    });
    bindPlanList();
  }

  function planListCard(plan) {
    const totals = planTotals(plan);
    return `
      <article class="card list-card" data-open-plan="${plan.id}">
        <img class="list-card-thumb" src="assets/placeholder-plan.png" alt="">
        <div>
          <h2 class="list-card-title">${escapeHTML(plan.name)}</h2>
          <div class="list-card-meta">
            <span>${round(totals.kcal)} kcal</span>
            <span>${plan.meals.length} posiłków</span>
          </div>
        </div>
      </article>
    `;
  }


  function previewPlanAssignment(planId) {
    const plan = state.mealPlans.find(p => p.id === planId);
    if (!plan) return;

    const date = parseISODate(state.ui.selectedDate);

    openModal("Podgląd jadłospisu", `
      <div class="assign-preview">
        ${planCard(plan, false)}
        <div class="form-actions-bottom">
          <button class="primary-btn" type="button" data-assign-preview-confirm>Przypisz</button>
          <button class="secondary-btn" type="button" data-assign-preview-cancel>Anuluj</button>
        </div>
      </div>
    `);

    modalRoot.querySelector("[data-plan-menu]")?.addEventListener("click", () => {
      closeModal();
      editPlan(plan.id);
    });

    modalRoot.querySelectorAll("[data-open-meal]").forEach(card => {
      card.addEventListener("click", () => {
        const meal = plan.meals.find(item => item.meal === card.dataset.openMeal);
        if (!meal?.recipeId) return;

        closeModal();
        state.ui.recipeReturnContext = {
          type: "assign-preview",
          planId: plan.id
        };
        viewRecipe(meal.recipeId, { keepReturnContext: true });
      });
    });

    modalRoot.querySelector("[data-assign-preview-confirm]").addEventListener("click", () => {
      state.assignments[state.ui.selectedDate] = plan.id;
      state.ui.assignPlanMode = false;
      saveState();
      closeModal();
      navigate("today");
    });

    modalRoot.querySelector("[data-assign-preview-cancel]").addEventListener("click", () => {
      closeModal();
    });
  }


  // Kalendarz przypisywania jadłospisu z poziomu widoku „Jadłospisy”.
  function openPlanAssignCalendar(planId) {
    const plan = state.mealPlans.find(item => item.id === planId);
    if (!plan) return;

    let visibleMonth = parseISODate(state.ui.selectedDate || toISODate(new Date()));
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);

    const renderAssignCalendar = () => {
      const selected = parseISODate(state.ui.selectedDate || toISODate(new Date()));
      const today = new Date();
      const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
      const lastDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
      const startOffset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = lastDay.getDate();
      const prevLast = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 0).getDate();
      const cells = [];

      for (let i = startOffset - 1; i >= 0; i--) {
        const day = prevLast - i;
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, day);
        cells.push(calendarCell(date, true, selected, today));
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
        cells.push(calendarCell(date, false, selected, today));
      }

      while (cells.length % 7 !== 0) {
        const day = cells.length - startOffset - daysInMonth + 1;
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, day);
        cells.push(calendarCell(date, true, selected, today));
      }

      openModal("Przypisz jadłospis", `
        <section class="calendar-picker plan-assign-calendar">
          <p class="muted small assign-calendar-note">
            Wybierz datę dla jadłospisu: <strong>${escapeHTML(plan.name)}</strong>
          </p>

          <div class="calendar-month-row">
            <button class="icon-btn" type="button" data-cal-prev aria-label="Poprzedni miesiąc"><span class="material-symbols-rounded">chevron_left</span></button>
            <strong>${monthLabel(visibleMonth)}</strong>
            <button class="icon-btn" type="button" data-cal-next aria-label="Następny miesiąc"><span class="material-symbols-rounded">chevron_right</span></button>
          </div>

          <div class="calendar-weekdays">
            <span>PN</span><span>WT</span><span>ŚR</span><span>CZ</span><span>PT</span><span>SB</span><span>ND</span>
          </div>

          <div class="calendar-grid">
            ${cells.join("")}
          </div>

          <button class="secondary-btn today-btn" type="button" data-cal-today>
            <span class="material-symbols-rounded">today</span> Dziś
          </button>
        </section>
      `);

      modalRoot.querySelector("[data-cal-prev]").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
        renderAssignCalendar();
      });

      modalRoot.querySelector("[data-cal-next]").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
        renderAssignCalendar();
      });

      modalRoot.querySelector("[data-cal-today]").addEventListener("click", () => {
        assignPlanToDateWithConfirm(planId, toISODate(new Date()));
      });

      modalRoot.querySelectorAll("[data-cal-date]").forEach(button => {
        button.addEventListener("click", () => {
          assignPlanToDateWithConfirm(planId, button.dataset.calDate);
        });
      });
    };

    renderAssignCalendar();
  }

  function assignPlanToDateWithConfirm(planId, isoDate) {
    const currentPlanId = state.assignments[isoDate];

    if (currentPlanId && currentPlanId !== planId) {
      const currentPlan = state.mealPlans.find(item => item.id === currentPlanId);

      openActions("Zmienic jadłospis?", [
        {
          label: `Zmień na ten jadłospis`,
          action: () => savePlanAssignmentForDate(planId, isoDate)
        },
        {
          label: "Anuluj",
          action: () => openPlanAssignCalendar(planId)
        }
      ]);

      const modalTitle = modalRoot.querySelector(".modal-title");
      if (modalTitle) {
        modalTitle.textContent = "Zmienić jadłospis?";
      }

      const form = modalRoot.querySelector(".form");
      if (form) {
        form.insertAdjacentHTML("afterbegin", `
          <p class="muted small overwrite-note">
            Data ${formatDate(parseISODate(isoDate))} ma już przypisany jadłospis:
            <strong>${escapeHTML(currentPlan?.name || "inny jadłospis")}</strong>.
          </p>
        `);
      }

      return;
    }

    savePlanAssignmentForDate(planId, isoDate);
  }

  function savePlanAssignmentForDate(planId, isoDate) {
    state.assignments[isoDate] = planId;
    state.ui.selectedDate = isoDate;
    state.ui.assignPlanMode = false;
    saveState();
    closeModal();
    navigate("today");
  }

  function bindPlanList() {
    app.querySelectorAll("[data-open-plan]").forEach(card => {
      card.addEventListener("click", () => {
        if (state.ui.assignPlanMode) {
          previewPlanAssignment(card.dataset.openPlan);
        } else {
          viewPlan(card.dataset.openPlan);
        }
      });
    });
  }


  function viewPlan(id) {
    state.ui.viewPlanId = id;
    navigate("plan-view");
  }

  function renderPlanView() {
    const plan = state.mealPlans.find(p => p.id === state.ui.viewPlanId);
    if (!plan) return navigate("plans");

    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">Jadłospis</h1>
          <button class="icon-btn" type="button" data-action="plan-menu" aria-label="Opcje jadłospisu"><span class="material-symbols-rounded">more_vert</span></button>
        </header>

        ${planCard(plan, false)}
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => navigate("plans"));
    app.querySelector("[data-action='plan-menu']").addEventListener("click", () => {
      openActions("Jadłospis", [
        { label: "Edytuj", action: () => editPlan(plan.id) },
        { label: "Eksportuj", action: () => exportMealPlan(plan.id) },
        { label: "Usuń", danger: true, action: () => confirmDeletePlan(plan.id) }
      ]);
    });

    app.querySelectorAll("[data-open-meal]").forEach(card => {
      card.addEventListener("click", () => {
        const meal = plan.meals.find(item => item.meal === card.dataset.openMeal);
        if (!meal?.recipeId) return;

        state.ui.recipeReturnContext = {
          type: "plan-view",
          planId: plan.id
        };
        viewRecipe(meal.recipeId, { keepReturnContext: true });
      });
    });
  }

  /* ---------- Widok 3: tworzenie/edycja jadłospisu ---------- */

  function renderEditPlan() {
    const plan = state.mealPlans.find(p => p.id === state.ui.editPlanId);
    if (!plan) return navigate("plans");

    const totals = planTotals(plan);
    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">${state.ui.planEditMode === "new" ? "Nowy jadłospis" : "Edytuj jadłospis"}</h1>
        </header>

        <form class="form" id="planForm">
          <label class="form-group">
            <span class="form-label">Nazwa jadłospisu</span>
            <input class="form-control" name="name" value="${escapeAttr(plan.name)}">
          </label>

          <section>
            <h2 class="section-title">Podsumowanie</h2>
            ${nutritionStrip(totals)}
          </section>

          <section>
            <h2 class="section-title">Posiłki</h2>
            <div class="meal-list">
              ${mealOrder.map(key => {
                const item = plan.meals.find(m => m.meal === key);
                return item ? editableMealCard(item) : emptyMealSlot(key);
              }).join("")}
            </div>
          </section>

          <div class="form-actions-bottom">
            <button class="primary-btn" type="button" data-action="save">Zapisz</button>
            <button class="secondary-btn" type="button" data-action="cancel-edit">Anuluj</button>
          </div>
        </form>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => { state.ui.planEditMode = null; saveState(); navigate("plans"); });
    app.querySelector("[data-action='cancel-edit']").addEventListener("click", () => {
      navigate("today");
    });

    app.querySelector("[data-action='save']").addEventListener("click", () => {
      const allIngredients = plan.meals.flatMap(meal => meal.customIngredients || recipeById(meal.recipeId)?.ingredients || []);
      chooseNutritionSourceForList(allIngredients, () => {
      const newName = app.querySelector("[name='name']").value.trim() || "Jadłospis";
      plan.name = newName;

      if (state.ui.editPlanContext && state.ui.editPlanContext.sourcePlanId === plan.id) {
        openActions("Jak zapisać zmiany?", [
          {
            label: "Zapisz jako nowy jadłospis dzienny",
            action: () => {
              const forcedName = prompt("Podaj nową nazwę jadłospisu:", `${newName} kopia`);
              if (!forcedName || forcedName.trim() === newName.trim()) {
                openInfo("Wymagana inna nazwa", "Nowy jadłospis musi mieć inną nazwę niż oryginał.");
                return;
              }

              const copiedPlan = clone(plan);
              copiedPlan.id = uid();
              copiedPlan.name = forcedName.trim();
              state.mealPlans.push(copiedPlan);
              state.assignments[state.ui.editPlanContext.date] = copiedPlan.id;
              state.ui.editPlanContext = null;
              saveState();
              navigate("today");
            }
          },
          {
            label: "Uwzględnij zmiany jednorazowo",
            action: () => {
              const instancePlan = clone(plan);
              instancePlan.id = uid();
              instancePlan.name = `${newName} — ${formatDate(parseISODate(state.ui.editPlanContext.date))}`;
              instancePlan.oneTime = true;
              instancePlan.sourcePlanId = state.ui.editPlanContext.sourcePlanId;
              instancePlan.date = state.ui.editPlanContext.date;
              state.mealPlans.push(instancePlan);
              state.assignments[state.ui.editPlanContext.date] = instancePlan.id;
              state.ui.editPlanContext = null;
              saveState();
              navigate("today");
            }
          }
        ]);
        return;
      }

      state.ui.planEditMode = null;
      saveState();
      navigate("plans");
      });
    });
    app.querySelector("[data-action='add-meal']")?.addEventListener("click", () => openAddMealModal(plan.id));
    app.querySelectorAll("[data-edit-meal]").forEach(btn => {
      btn.addEventListener("click", () => openEditPlanMealMenu(plan.id, btn.dataset.editMeal));
    });
    app.querySelectorAll("[data-change-meal]").forEach(btn => {
      btn.addEventListener("click", () => pickRecipeForPlanMeal(plan.id, btn.dataset.changeMeal));
    });
    app.querySelectorAll("[data-add-to-meal]").forEach(btn => {
      btn.addEventListener("click", () => pickRecipeForPlanMeal(plan.id, btn.dataset.addToMeal));
    });
  }

  function editableMealCard(item) {
    const recipe = recipeById(item.recipeId);
    const totals = ingredientsTotals(item.customIngredients || recipe?.ingredients || []);
    return `
      <article class="meal-card editable-plan-meal" data-edit-meal="${item.meal}">
        <img class="meal-thumb" src="${recipe?.image || "assets/placeholder-food.png"}" alt="" onerror="this.src='assets/placeholder-food.png'">
        <div>
          <h3 class="meal-title">${mealLabels[item.meal]}</h3>
          <div class="meal-time">${state.settings.mealTimes[item.meal] || ""}</div>
          <p class="meal-name">${escapeHTML(recipe?.title || "Bez nazwy")}</p>
        </div>
        <div class="meal-edit-side">
          <span class="meal-kcal readonly">${round(totals.kcal)} kcal</span>
          <button class="icon-btn compact-icon-btn" type="button" data-edit-meal="${item.meal}" aria-label="Edytuj posiłek">
            <span class="material-symbols-rounded">more_vert</span>
          </button>
        </div>
      </article>
    `;
  }

  function emptyMealSlot(key) {
    return `
      <article class="meal-card">
        <img class="meal-thumb" src="assets/placeholder-food.png" alt="">
        <div>
          <h3 class="meal-title">${mealLabels[key]}</h3>
          <div class="meal-time">${state.settings.mealTimes[key] || ""}</div>
          <p class="meal-name muted">Brak dania</p>
        </div>
        <button class="meal-kcal" type="button" data-add-to-meal="${key}"><span class="material-symbols-rounded">add</span></button>
      </article>
    `;
  }

  /* ---------- Widok 4: lista przepisów ---------- */

  function sortRecipes(recipes) {
    const mode = state.ui.recipeSort || "nameAsc";
    return recipes.sort((a, b) => {
      if (mode === "nameAsc") return a.title.localeCompare(b.title, "pl");
      if (mode === "nameDesc") return b.title.localeCompare(a.title, "pl");
      if (mode === "kcalAsc") return ingredientsTotals(a.ingredients || []).kcal - ingredientsTotals(b.ingredients || []).kcal;
      if (mode === "kcalDesc") return ingredientsTotals(b.ingredients || []).kcal - ingredientsTotals(a.ingredients || []).kcal;
      return 0;
    });
  }

  function sortProducts(products) {
    const mode = state.ui.productSort || "nameAsc";
    return products.sort((a, b) => {
      if (mode === "nameAsc") return a.name.localeCompare(b.name, "pl");
      if (mode === "nameDesc") return b.name.localeCompare(a.name, "pl");
      if (mode === "kcalAsc") return Number(a.kcal100 || 0) - Number(b.kcal100 || 0);
      if (mode === "kcalDesc") return Number(b.kcal100 || 0) - Number(a.kcal100 || 0);
      return 0;
    });
  }

  function renderRecipes() {
    const categories = ["Wszystkie", ...unique(state.recipes.map(r => r.category))];
    const filtered = sortRecipes(state.recipes.filter(r => state.ui.recipeFilter === "Wszystkie" || r.category === state.ui.recipeFilter));

    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">Przepisy</h1>
          <div class="header-actions">
            <button class="icon-btn" type="button" data-action="new-recipe" aria-label="Dodaj przepis"><span class="material-symbols-rounded">add</span></button>
            <button class="icon-btn" type="button" data-action="import-recipe" aria-label="Bazę przepisów"><span class="material-symbols-rounded">download</span></button>
          </div>
          <input id="recipeImportInput" class="visually-hidden" type="file" accept=".json">
        </header>

        ${state.ui.recipePickContext ? `<p class="card card-pad small muted recipe-pick-note">Wybierz przepis, który chcesz dodać do posiłku.</p>` : ""}

        <div class="search-input">
          <input class="form-control" id="recipeSearch" type="search" placeholder="Szukaj przepisu...">
        </div>

        <div class="sort-bar compact-sort-bar" aria-label="Sortowanie przepisów">
          <button class="sort-pill compact-sort-pill ${state.ui.recipeSort?.startsWith("name") ? "active" : ""}" data-recipe-sort-toggle="name" type="button" aria-label="Sortuj według nazwy">
            <span>AZ</span>
            <span class="material-symbols-rounded">${state.ui.recipeSort === "nameDesc" ? "arrow_downward" : "arrow_upward"}</span>
          </button>
          <button class="sort-pill compact-sort-pill ${state.ui.recipeSort?.startsWith("kcal") ? "active" : ""}" data-recipe-sort-toggle="kcal" type="button" aria-label="Sortuj według kalorii">
            <span class="material-symbols-rounded">local_fire_department</span>
            <span class="material-symbols-rounded">${state.ui.recipeSort === "kcalDesc" ? "arrow_downward" : "arrow_upward"}</span>
          </button>
        </div>

        <div class="sort-bar">
          ${categories.map(c => `<button class="filter-pill ${state.ui.recipeFilter === c ? "active" : ""}" data-filter="${escapeAttr(c)}" type="button">${escapeHTML(c)}</button>`).join("")}
        </div>

        <div id="recipeList">
          ${filtered.map(recipeListCard).join("") || emptyList("Brak przepisów.")}
        </div>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => {
      if (state.ui.recipePickContext) {
        state.ui.recipePickContext = null;
        saveState();
      }
      navigate("library");
    });
    app.querySelector("[data-action='new-recipe']").addEventListener("click", () => newRecipe());
    app.querySelector("[data-action='import-recipe']").addEventListener("click", () => openResourceImportPicker("recipe"));
    app.querySelector("#recipeImportInput").addEventListener("change", handleRecipeImport);

    app.querySelectorAll("[data-recipe-sort-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.recipeSortToggle;
        if (type === "name") {
          state.ui.recipeSort = state.ui.recipeSort === "nameAsc" ? "nameDesc" : "nameAsc";
        } else {
          state.ui.recipeSort = state.ui.recipeSort === "kcalAsc" ? "kcalDesc" : "kcalAsc";
        }
        saveState();
        renderRecipes();
      });
    });

    app.querySelectorAll("[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.ui.recipeFilter = btn.dataset.filter;
        saveState();
        renderRecipes();
      });
    });

    app.querySelector("#recipeSearch").addEventListener("input", e => {
      const q = e.target.value.toLowerCase().trim();
      app.querySelector("#recipeList").innerHTML = sortRecipes(filtered)
        .filter(r => r.title.toLowerCase().includes(q))
        .map(recipeListCard).join("") || emptyList("Brak przepisów.");
      bindRecipeList();
    });
    bindRecipeList();
  }

  function recipeListCard(recipe) {
    const totals = ingredientsTotals(recipe.ingredients);
    return `
      <article class="card list-card" data-open-recipe="${recipe.id}">
        <img class="list-card-thumb" src="${recipe.image || "assets/placeholder-food.png"}" alt="" onerror="this.src='assets/placeholder-food.png'">
        <div>
          <h2 class="list-card-title">${escapeHTML(recipe.title)}</h2>
          <div class="list-card-meta">
            <span>${escapeHTML(recipe.category)}</span>
            <span>${recipe.recipeType === "single" ? "Pojedynczy posiłek" : "Danie"}</span>
            <span class="kcal-chip">${round(totals.kcal)} kcal</span>
          </div>
        </div>
        <button class="overflow-btn" type="button" data-recipe-menu="${recipe.id}" aria-label="Opcje"><span class="material-symbols-rounded">more_vert</span></button>
      </article>
    `;
  }


  function addRecipeToMealFromFullView(recipeId) {
    const context = state.ui.recipePickContext;
    if (!context) return;

    const plan = state.mealPlans.find(p => p.id === context.planId);
    const recipe = recipeById(recipeId);

    if (!plan || !recipe) {
      state.ui.recipePickContext = null;
      saveState();
      navigate("plans");
      return;
    }

    const entry = {
      meal: context.meal,
      recipeId: recipe.id,
      portionWeight: totalWeight(recipe.ingredients),
      customIngredients: clone(recipe.ingredients)
    };

    const existing = plan.meals.find(m => m.meal === context.meal);
    if (existing) Object.assign(existing, entry);
    else plan.meals.push(entry);

    state.ui.recipePickContext = null;
    state.ui.editPlanId = plan.id;
    saveState();
    navigate("edit-plan");
  }

  function bindRecipeList() {
    app.querySelectorAll("[data-open-recipe]").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;

        if (state.ui.recipePickContext) {
          addRecipeToMealFromFullView(card.dataset.openRecipe);
          return;
        }

        viewRecipe(card.dataset.openRecipe);
      });
    });
    app.querySelectorAll("[data-recipe-menu]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.recipeMenu;
        openActions("Przepis", [
          { label: "Edytuj", action: () => editRecipe(id) },
          { label: "Eksportuj", action: () => exportRecipe(id) },
          { label: "Usuń", danger: true, action: () => confirmDeleteRecipe(id) }
        ]);
      });
    });
  }


  function handleRecipeImport(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        const imported = normalizeImportedRecipe(parsed);
        state.recipes.push(imported);
        saveState();
        openInfo("Przepis zaimportowany", `Dodano przepis: <strong>${escapeHTML(imported.title)}</strong>.`);
        renderRecipes();
      } catch (error) {
        openInfo("Nie udało się zaimportować przepisu", escapeHTML(error.message || "Plik ma nieprawidłowy format."));
      }
    };

    reader.onerror = () => {
      openInfo("Błąd pliku", "Nie udało się odczytać wybranego pliku.");
    };

    reader.readAsText(file, "utf-8");
  }

  function normalizeImportedRecipe(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Plik JSON musi zawierać jeden obiekt przepisu.");
    }

    const title = String(data.title || data.name || "").trim();
    if (!title) {
      throw new Error("Brakuje pola title z nazwą przepisu.");
    }

    const ingredientsSource = Array.isArray(data.ingredients) ? data.ingredients : [];
    if (!ingredientsSource.length) {
      throw new Error("Przepis musi zawierać tablicę ingredients.");
    }

    const ingredients = ingredientsSource.map((item, index) => {
      if (!item || typeof item !== "object") {
        throw new Error(`Składnik nr ${index + 1} ma nieprawidłowy format.`);
      }

      const name = lowerFirst(String(item.name || item.title || "").trim());
      if (!name) {
        throw new Error(`Składnik nr ${index + 1} nie ma nazwy.`);
      }

      return ingredient(
        name,
        Number(item.weight ?? item.weightG ?? item.grams ?? item.amount) || 0,
        Number(item.kcal100 ?? item.calories100 ?? item.kcalPer100g ?? item.caloriesPer100g) || 0,
        Number(item.protein100 ?? item.proteinPer100g) || 0,
        Number(item.fat100 ?? item.fatPer100g) || 0,
        Number(item.carbs100 ?? item.carbsPer100g ?? item.carbohydrates100 ?? item.carbohydratesPer100g) || 0
      );
    });

    return {
      id: uid(),
      title,
      category: String(data.category || "Inne").trim() || "Inne",
      recipeType: data.recipeType === "dish" || data.type === "dish" ? "dish" : "single",
      mealCategory: data.mealCategory || "breakfast1",
      prep: String(data.prep || data.instructions || data.description || "").trim(),
      image: typeof data.image === "string" ? data.image : "",
      ingredients
    };
  }


  function viewRecipe(id, options = {}) {
    state.ui.viewRecipeId = id;
    if (!options.keepReturnContext) {
      state.ui.recipeReturnContext = null;
    }
    navigate("recipe-view");
  }


  function returnFromRecipeView() {
    const context = state.ui.recipeReturnContext;

    if (context?.type === "assign-preview" && context.planId) {
      const planId = context.planId;
      state.ui.recipeReturnContext = null;
      saveState();
      navigate("plans");
      requestAnimationFrame(() => previewPlanAssignment(planId));
      return;
    }

    if (context?.type === "plan-view" && context.planId) {
      state.ui.viewPlanId = context.planId;
      state.ui.recipeReturnContext = null;
      saveState();
      navigate("plan-view");
      return;
    }

    state.ui.recipeReturnContext = null;
    saveState();
    navigate("recipes");
  }

  function renderRecipeView() {
    const recipe = state.recipes.find(r => r.id === state.ui.viewRecipeId);
    if (!recipe) return navigate("recipes");

    const totals = ingredientsTotals(recipe.ingredients || []);

    app.innerHTML = `
      <section class="screen recipe-view-screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back">
            <span class="material-symbols-rounded">chevron_left</span>
          </button>

          <h1 class="sub-title">Przepis</h1>

          <button class="icon-btn" type="button" data-action="recipe-menu" aria-label="Opcje przepisu">
            <span class="material-symbols-rounded">more_vert</span>
          </button>
        </header>

        <article class="card recipe-view-card">
          <header class="recipe-view-top">
            <div>
              <h2 class="recipe-view-title">${escapeHTML(recipe.title)}</h2>
              <p class="recipe-view-subtitle">
                ${escapeHTML(recipe.category || "bez kategorii")} • ${recipe.recipeType === "dish" ? "danie" : "posiłek"}
              </p>
            </div>
          </header>

          <div class="recipe-view-nutrition">
            ${nutritionStrip(totals)}
          </div>

          <section class="recipe-view-section">
            <h3>Składniki</h3>
            <div class="recipe-ingredient-list">
              ${(recipe.ingredients || []).map(ingredient => `
                <div class="recipe-ingredient-row">
                  <span>${escapeHTML(ingredient.name)}</span>
                  <strong>${round(ingredient.weight)} g</strong>
                </div>
              `).join("")}
            </div>
          </section>

          ${recipe.prep ? `
            <section class="recipe-view-section">
              <h3>Przygotowanie</h3>
              <p class="recipe-prep">${escapeHTML(recipe.prep)}</p>
            </section>
          ` : ""}
        </article>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", returnFromRecipeView);

    app.querySelector("[data-action='recipe-menu']").addEventListener("click", () => {
      openActions(recipe.title, [
        { label: "Edytuj", action: () => editRecipe(recipe.id) },
        { label: "Eksportuj", action: () => exportRecipe(recipe.id) },
        { label: "Usuń", danger: true, action: () => confirmDeleteRecipe(recipe.id) }
      ]);
    });
  }

  
  // Otwiera systemowy picker plików dla importu przepisu JSON.
  function openRecipeImportPicker() {
    const input = document.getElementById("recipe-import-input");

    if (!input) {
      openInfo("Błąd", "Nie znaleziono modułu importu plików.");
      return;
    }

    input.value = "";
    input.click();
  }

  // Podłączenie obsługi importu przepisu JSON.
  function bindRecipeImportInput() {
    const input = document.getElementById("recipe-import-input");

    if (!input || input.dataset.bound === "true") {
      return;
    }

    input.dataset.bound = "true";

    input.addEventListener("change", async event => {
      const file = event.target.files?.[0];

      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!data || typeof data !== "object") {
          throw new Error("Invalid format");
        }

        previewRecipeImport(data);
      } catch (error) {
        openInfo(
          "Import nieudany",
          "Wybrany plik nie jest poprawnym plikiem przepisu JSON."
        );
      }
    });
  }

function exportRecipe(id) {
    const recipe = state.recipes.find(r => r.id === id);
    if (!recipe) return;

    const exportData = {
      title: recipe.title,
      category: recipe.category,
      recipeType: recipe.recipeType,
      prep: recipe.prep || "",
      image: recipe.image || "",
      ingredients: (recipe.ingredients || []).map(ingredient => ({
        name: ingredient.name,
        weight: ingredient.weight,
        kcal100: ingredient.kcal100,
        protein100: ingredient.protein100,
        fat100: ingredient.fat100,
        carbs100: ingredient.carbs100
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = `${slugify(recipe.title)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function slugify(text) {
    return String(text || "przepis")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "przepis";
  }

  /* ---------- Widok 5: tworzenie/edycja przepisu ---------- */

  function renderEditRecipe() {
    const recipe = state.recipes.find(r => r.id === state.ui.editRecipeId);
    if (!recipe) return navigate("recipes");

    const totals = ingredientsTotals(recipe.ingredients);
    const categories = unique(["Śniadania", "Zupy", "Obiady", "Sałatki", "Przekąski", ...state.recipes.map(r => r.category)]);
    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">${state.ui.recipeEditMode === "new" ? "Nowy przepis" : "Edytuj przepis"}</h1>
          <button class="icon-btn primary" type="button" data-action="save" aria-label="Zapisz przepis">
            <span class="material-symbols-rounded">check</span>
          </button>
        </header>

        <form class="form" id="recipeForm">
          <div class="form-row two">
            <div class="form-group">
              <img class="list-card-thumb" src="${recipe.image || "assets/placeholder-food.png"}" alt="" onerror="this.src='assets/placeholder-food.png'">
              <label class="form-label">Zdjęcie</label>
              <input class="form-control" type="file" accept=".json" id="recipeImage">
            </div>
            <label class="form-group">
              <span class="form-label">Tytuł</span>
              <input class="form-control" name="title" value="${escapeAttr(recipe.title)}">
            </label>
          </div>

          <div class="form-row two">
            <label class="form-group">
              <span class="form-label">Kategoria</span>
              <select class="form-select" name="category">
                ${categories.map(c => `<option ${recipe.category === c ? "selected" : ""}>${escapeHTML(c)}</option>`).join("")}
                <option value="__new">Dodaj nową kategorię</option>
              </select>
            </label>
            <label class="form-group">
              <span class="form-label">Typ przepisu</span>
              <select class="form-select" name="recipeType">
                <option value="single" ${recipe.recipeType === "single" ? "selected" : ""}>Pojedynczy posiłek</option>
                <option value="dish" ${recipe.recipeType === "dish" ? "selected" : ""}>Danie</option>
              </select>
            </label>
          </div>
<section>
            <h2 class="section-title">Składniki</h2>
            <div class="ingredients-list" id="recipeIngredients">
              ${recipe.ingredients.map((ing, index) => ingredientRow(ing, index)).join("")}
            </div>
            <button class="secondary-btn" type="button" data-action="add-ingredient">+ Dodaj składnik</button>
          </section>

          <section>
            <h2 class="section-title">Wartości odżywcze</h2>
            ${nutritionStrip(totals)}
          </section>

          <label class="form-group">
            <span class="form-label">Przygotowanie</span>
            <textarea class="form-textarea" name="prep" placeholder="Opcjonalnie">${escapeHTML(recipe.prep || "")}</textarea>
          </label>
          <div class="form-actions-bottom recipe-edit-actions">
            <button class="primary-btn" type="button" data-action="save">Zapisz</button>
            <button class="secondary-btn" type="button" data-action="cancel-edit-recipe">Anuluj</button>
          </div>
        </form>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => { state.ui.recipeEditMode = null; saveState(); navigate("recipes"); });
    app.querySelector("[data-action='cancel-edit-recipe']")?.addEventListener("click", () => { state.ui.recipeEditMode = null; saveState(); navigate("recipes"); });
    app.querySelector("[data-action='add-ingredient']").addEventListener("click", () => openIngredientModal(recipe.ingredients, null, renderEditRecipe));
    app.querySelector("#recipeImage").addEventListener("change", e => handleImage(e, src => { recipe.image = src; saveState(); renderEditRecipe(); }));
    const saveRecipe = () => {
      chooseNutritionSourceForList(recipe.ingredients, () => {
        const form = app.querySelector("#recipeForm");
        recipe.title = form.title.value.trim() || "Bez tytułu";
        recipe.recipeType = form.recipeType.value;
        if (form.category.value === "__new") {
          const category = prompt("Podaj nazwę nowej kategorii:", "Nowa kategoria");
          recipe.category = category && category.trim() ? category.trim() : "Inne";
        } else {
          recipe.category = form.category.value;
        }
        recipe.prep = form.prep.value.trim();
        saveState();
        navigate("recipes");
      });
    };

    app.querySelectorAll("[data-action='save']").forEach(button => {
      button.addEventListener("click", saveRecipe);
    });
    bindIngredientRows(recipe.ingredients, renderEditRecipe);
  }


  function renderLibrary() {
    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">Zasoby</h1>
          <div class="header-actions">
            <button class="icon-btn" type="button" data-action="import-resources" aria-label="Importuj zasoby">
              <span class="material-symbols-rounded">download</span>
            </button>
            <button class="icon-btn" type="button" data-action="export-resources" aria-label="Eksportuj zasoby">
              <span class="material-symbols-rounded">upload</span>
            </button>
          </div>
        </header>

        <section class="card more-list library-list">
          ${moreRow("nutrition", "Produkty", "products", `${productBase().length} pozycji`)}
          ${moreRow("menu_book", "Przepisy", "recipes", `${state.recipes.length} pozycji`)}
          ${moreRow("list_alt", "Jadłospisy", "plans", `${state.mealPlans.length} pozycji`)}
        </section>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => navigate("today"));
    app.querySelector("[data-action='import-resources']").addEventListener("click", openResourcesImportMenu);
    app.querySelector("[data-action='export-resources']").addEventListener("click", openResourcesExportMenu);
    app.querySelectorAll("[data-more-route]").forEach(btn => {
      btn.addEventListener("click", () => navigate(btn.dataset.moreRoute));
    });
  }

  /* ---------- Widok 6: produkty ---------- */

  function renderProducts() {
    const products = productBase();
    const filters = ["Wszystkie", "Baza", "Z przepisów", "Białko", "Węglowodany", "Tłuszcze"];
    const filtered = sortProducts(products.filter(p => {
      if (state.ui.productFilter === "Wszystkie") return true;
      if (state.ui.productFilter === "Baza") return p.isBaseProduct;
      if (state.ui.productFilter === "Z przepisów") return p.recipeCount > 0;
      return macroGroup(p) === state.ui.productFilter;
    }));

    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title centered-title">Produkty</h1>
          <div class="header-actions">
            <button class="icon-btn" type="button" data-action="new-product" aria-label="Nowy produkt"><span class="material-symbols-rounded">add</span></button>
            <button class="icon-btn" type="button" data-action="import-product" aria-label="Bazę produktów"><span class="material-symbols-rounded">download</span></button>
          </div>
        </header>

        <p class="product-source-note">
          Baza danych:
          <a href="https://frida.fooddata.dk/?lang=en" target="_blank" rel="noopener noreferrer">
            Frida Food Data
          </a>
          — publiczna europejska baza składu żywności prowadzona przez National Food Institute, Technical University of Denmark.
        </p>

        <div class="search-input">
          <input class="form-control" id="productSearch" type="search" placeholder="Szukaj produktu...">
        </div>

        <div class="sort-bar compact-sort-bar" aria-label="Sortowanie produktów">
          <button class="sort-pill compact-sort-pill ${state.ui.productSort?.startsWith("name") ? "active" : ""}" data-product-sort-toggle="name" type="button" aria-label="Sortuj według nazwy">
            <span>AZ</span>
            <span class="material-symbols-rounded">${state.ui.productSort === "nameDesc" ? "arrow_downward" : "arrow_upward"}</span>
          </button>
          <button class="sort-pill compact-sort-pill ${state.ui.productSort?.startsWith("kcal") ? "active" : ""}" data-product-sort-toggle="kcal" type="button" aria-label="Sortuj według kalorii">
            <span class="material-symbols-rounded">local_fire_department</span>
            <span class="material-symbols-rounded">${state.ui.productSort === "kcalDesc" ? "arrow_downward" : "arrow_upward"}</span>
          </button>
        </div>

        <div class="sort-bar">
          ${filters.map(f => `<button class="filter-pill ${state.ui.productFilter === f ? "active" : ""}" data-filter="${f}" type="button">${f}</button>`).join("")}
        </div>

        <div id="productList">
          ${filtered.map(productRow).join("") || emptyList("Brak produktów.")}
        </div>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => navigate("library"));
    app.querySelector("[data-action='new-product']").addEventListener("click", openNewProductModal);
    app.querySelector("[data-action='import-product']")?.addEventListener("click", () => openResourceImportPicker("product"));

    app.querySelectorAll("[data-product-sort-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.productSortToggle;
        if (type === "name") {
          state.ui.productSort = state.ui.productSort === "nameAsc" ? "nameDesc" : "nameAsc";
        } else {
          state.ui.productSort = state.ui.productSort === "kcalAsc" ? "kcalDesc" : "kcalAsc";
        }
        saveState();
        renderProducts();
      });
    });

    app.querySelectorAll("[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.ui.productFilter = btn.dataset.filter;
        saveState();
        renderProducts();
      });
    });

    app.querySelector("#productSearch").addEventListener("input", e => {
      const q = e.target.value.toLowerCase().trim();
      app.querySelector("#productList").innerHTML = sortProducts(filtered)
        .filter(p => p.name.includes(q))
        .map(productRow).join("") || emptyList("Brak produktów.");
      bindProductRows();
    });
    bindProductRows();
  }

  function productRow(p) {
    const countLabel = p.recipeCount === 0
      ? "baza"
      : (p.recipeCount === 1 ? "1 przepis" : `${p.recipeCount} przepisy`);

    return `
      <article class="list-row product-row" data-product="${escapeAttr(p.name)}" data-category="${escapeAttr(p.category || "")}">
        <div class="product-left">
          <span class="material-symbols-rounded product-icon">${productEmoji(p)}</span>
          <span class="product-info">
            <strong>${escapeHTML(p.name)}</strong>
            <small>${escapeHTML(p.category || "produkt")}</small>
          </span>
        </div>
        <span class="product-count ${p.recipeCount === 0 ? "base-only" : ""}">${countLabel}</span>
      </article>
    `;
  }

  function bindProductRows() {
    app.querySelectorAll("[data-product]").forEach(row => {
      row.addEventListener("click", () => {
        openProductRecipes(row.dataset.product);
      });
    });
  }

  function openProductRecipes(productName) {
    const product = productBase().find(item => item.name === productName);
    const userNutrition = userNutritionForProduct(productName);
    const recipes = state.recipes.filter(recipe =>
      recipe.ingredients.some(ingredient => ingredient.name === productName)
    );

    openModal(productName, `
      <section class="product-detail">
        ${product ? `
          <section class="product-nutrition-compare">
            <h3>Wartości bazowe na 100 g produktu:</h3>

            <div class="product-nutrition-row">
              <span class="product-nutrition-source" title="Dane z bazy"><span class="material-symbols-rounded">database</span></span>
              <div class="product-nutrition-values">
                ${productMacroLine(product)}
              </div>
            </div>

            <div class="product-nutrition-row ${userNutrition ? "" : "is-muted"}">
              <span class="product-nutrition-source" title="Dane użytkownika"><span class="material-symbols-rounded">person</span></span>
              <div class="product-nutrition-values">
                ${userNutrition ? productMacroLine(userNutrition) : productMacroLine(emptyNutrition())}
              </div>
            </div>

            <p class="small muted product-source-detail">
              Źródło: ${escapeHTML(product.source || "przepisy użytkownika")}
            </p>

            <button class="secondary-btn product-edit-btn" type="button" data-edit-product="${escapeAttr(product.name)}">
              Edytuj produkt
            </button>
          </section>
        ` : ""}

        <h3 class="product-detail-title">Przepisy i potrawy</h3>

        <div class="product-recipes-list">
          ${recipes.map(recipe => {
            const ingredient = recipe.ingredients.find(item => item.name === productName);
            return `
              <button class="product-recipe-item" type="button" data-open-product-recipe="${recipe.id}">
                <span>
                  <strong>${escapeHTML(recipe.title)}</strong>
                  <small>${recipe.recipeType === "dish" ? "danie" : "posiłek"}</small>
                </span>
                <span class="product-recipe-meta">${round(ingredient?.weight || 0)} g</span>
              </button>
            `;
          }).join("") || `<p class="empty-state">Ten produkt nie występuje jeszcze w żadnym przepisie.</p>`}
        </div>
      </section>
    `);

    modalRoot.querySelector("[data-edit-product]")?.addEventListener("click", button => {
      openProductEditModal(button.currentTarget.dataset.editProduct);
    });

    modalRoot.querySelectorAll("[data-open-product-recipe]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.openProductRecipe;
        closeModal();
        viewRecipe(id);
      });
    });
  }


  
  function openNewProductModal() {
    openModal("Nowy produkt", `
      <form class="form" id="newProductForm">
        <label class="form-group">
          <span class="form-label">Nazwa produktu</span>
          <input class="form-control" name="name" required placeholder="np. awokado">
        </label>

        <label class="form-group">
          <span class="form-label">Kategoria</span>
          <select class="form-select" name="category">
            <option>warzywa</option>
            <option>owoce</option>
            <option>pieczywo</option>
            <option>zbożowe</option>
            <option>nabiał</option>
            <option>jaja</option>
            <option>mięso</option>
            <option>ryby</option>
            <option>strączki</option>
            <option>tłuszcze</option>
            <option>orzechy</option>
            <option>przyprawy</option>
            <option>dodatki</option>
            <option>napoje</option>
            <option>użytkownika</option>
          </select>
        </label>

        <label class="form-group">
          <span class="form-label">Kalorie / 100 g</span>
          <input class="form-control" name="kcal100" type="number" min="0" step="1" value="0">
        </label>

        <div class="form-row two">
          <label class="form-group">
            <span class="form-label">Białko / 100 g</span>
            <input class="form-control" name="protein100" type="number" min="0" step="0.1" value="0">
          </label>

          <label class="form-group">
            <span class="form-label">Tłuszcze / 100 g</span>
            <input class="form-control" name="fat100" type="number" min="0" step="0.1" value="0">
          </label>
        </div>

        <label class="form-group">
          <span class="form-label">Węglowodany / 100 g</span>
          <input class="form-control" name="carbs100" type="number" min="0" step="0.1" value="0">
        </label>

        <label class="form-group">
          <span class="form-label">IG</span>
          <input class="form-control" name="gi" type="number" min="0" max="150" step="1" value="0">
        </label>

        <div class="form-actions-bottom">
          <button class="primary-btn" type="submit">Zapisz</button>
          <button class="secondary-btn" type="button" data-cancel-new-product>Anuluj</button>
        </div>
      </form>
    `);

    modalRoot.querySelector("[data-cancel-new-product]").addEventListener("click", closeModal);

    modalRoot.querySelector("#newProductForm").addEventListener("submit", event => {
      event.preventDefault();
      const form = event.target;
      const name = lowerFirst(form.name.value.trim());
      if (!name) return;

      state.userProducts = state.userProducts || {};
      state.userProducts[name] = {
        name,
        category: form.category.value,
        kcal100: Number(form.kcal100.value) || 0,
        protein100: Number(form.protein100.value) || 0,
        fat100: Number(form.fat100.value) || 0,
        carbs100: Number(form.carbs100.value) || 0,
        gi: Number(form.gi?.value) || 0,
        gi: Number(form.gi?.value) || 0,
        source: "użytkownika",
        gi: Number(product.gi) || 0,
        updatedAt: new Date().toISOString()
      };

      saveState();
      closeModal();
      renderProducts();
    });
  }

function openProductEditModal(productName) {
    const base = baseProductByName(productName);
    const user = userProductByName(productName);
    const product = user || base || productBase().find(item => item.name === productName);

    if (!product) return;

    openModal(`Edytuj produkt: ${productName}`, `
      <form class="form" id="productEditForm">
        <p class="muted small">
          Zmienione wartości zostaną zapisane jako dane użytkownika. Wartości bazowe pozostaną bez zmian.
        </p>

        <label class="form-group">
          <span class="form-label">Kalorie / 100 g</span>
          <input class="form-control" name="kcal100" type="number" min="0" step="1" value="${Number(product.kcal100) || 0}">
        </label>

        <div class="form-row two">
          <label class="form-group">
            <span class="form-label">Białko / 100 g</span>
            <input class="form-control" name="protein100" type="number" min="0" step="0.1" value="${Number(product.protein100) || 0}">
          </label>

          <label class="form-group">
            <span class="form-label">Tłuszcze / 100 g</span>
            <input class="form-control" name="fat100" type="number" min="0" step="0.1" value="${Number(product.fat100) || 0}">
          </label>
        </div>

        <label class="form-group">
          <span class="form-label">Węglowodany / 100 g</span>
          <input class="form-control" name="carbs100" type="number" min="0" step="0.1" value="${Number(product.carbs100) || 0}">
        </label>

        <div class="form-actions-bottom">
          <button class="primary-btn" type="submit">Zapisz</button>
          <button class="secondary-btn" type="button" data-cancel-product-edit>Anuluj</button>
        </div>
      </form>
    `);

    modalRoot.querySelector("[data-cancel-product-edit]").addEventListener("click", () => {
      closeModal();
      openProductRecipes(productName);
    });

    modalRoot.querySelector("#productEditForm").addEventListener("submit", event => {
      event.preventDefault();

      const form = event.target;
      const edited = {
        name: productName,
        weight: 100,
        kcal100: Number(form.kcal100.value) || 0,
        protein100: Number(form.protein100.value) || 0,
        fat100: Number(form.fat100.value) || 0,
        carbs100: Number(form.carbs100.value) || 0
      };

      if (valuesDifferFromBase(edited) || !base) {
        saveUserProductFromIngredient(edited);
      } else if (state.userProducts?.[productName]) {
        delete state.userProducts[productName];
      }

      // Zaktualizuj istniejące składniki użytkownika w przepisach, żeby kolejne obliczenia korzystały z wybranych wartości.
      state.recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          if (ingredient.name === productName) {
            ingredient.kcal100 = edited.kcal100;
            ingredient.protein100 = edited.protein100;
            ingredient.fat100 = edited.fat100;
            ingredient.carbs100 = edited.carbs100;
            ingredient.nutritionSource = valuesDifferFromBase(edited) || !base ? "user" : "base";
          }
        });
      });

      saveState();
      closeModal();
      openProductRecipes(productName);
    });
  }

  function emptyNutrition() {
    return {
      kcal100: 0,
      protein100: 0,
      fat100: 0,
      carbs100: 0, gi: 0 };
  }

  function productMacroLine(product) {
    const gi = inferredGI(product);

    return `
      <span><span class="material-symbols-rounded">local_fire_department</span><strong>${round(product.kcal100)}</strong> kcal</span>
      <span><span class="material-symbols-rounded">egg_alt</span>${round(product.protein100)} g</span>
      <span><span class="material-symbols-rounded">water_drop</span>${round(product.fat100)} g</span>
      <span><span class="material-symbols-rounded">grass</span>${round(product.carbs100)} g</span>
      <span class="product-gi-value">${giInline(gi)}</span>
    `;
  }

  function userNutritionForProduct(productName) {
    const values = [];

    Object.values(state.userProducts || {}).forEach(product => {
      if (!map.has(product.name)) {
        map.set(product.name, {
          ...product,
          category: "użytkownika",
          weight: 0,
          recipeIds: new Set(),
          recipeTitles: new Set(),
          isBaseProduct: false,
          isUserProduct: true
        });
      }
    });

    state.recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (ingredient.name === productName) {
          values.push(ingredient);
        }
      });
    });

    if (!values.length) return null;

    const latest = values[values.length - 1];

    return {
      kcal100: Number(latest.kcal100) || 0,
      protein100: Number(latest.protein100) || 0,
      fat100: Number(latest.fat100) || 0,
      carbs100: Number(latest.carbs100) || 0
    };
  }

  /* ---------- Widok 7: lista zakupów ---------- */

  function renderShopping() {
    const today = toISODate(new Date());
    const dateFrom = state.settings.shoppingDateFrom || today;
    const dateTo = state.settings.shoppingDateTo || addDaysISO(today, 7);

    state.settings.shoppingDateFrom = dateFrom;
    state.settings.shoppingDateTo = dateTo;

    const items = buildShoppingListForRange(dateFrom, dateTo);
    const undone = items.filter(item => !item.done);

    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">Lista zakupów</h1>
          <div class="header-actions">
            <button class="icon-btn" type="button" data-action="share">
              <span class="material-symbols-rounded">share</span>
            </button>
          </div>
        </header>

        <section class="card card-pad shopping-settings-card">
          <div class="shopping-date-range shopping-date-range-compact">
            <button class="shopping-date-btn" type="button" data-shopping-date="from">
              <span>Od</span>
              <strong>${formatShortDate(parseISODate(dateFrom))}</strong>
            </button>

            <button class="shopping-date-btn" type="button" data-shopping-date="to">
              <span>Do</span>
              <strong>${formatShortDate(parseISODate(dateTo))}</strong>
            </button>
          </div>
        </section>

        <h2 class="section-title">Do kupienia (${undone.length})</h2>

        <div class="card card-pad shopping-generated-list">
          ${items.map(shoppingGeneratedRow).join("") || emptyList("Brak przypisanych jadłospisów w wybranym zakresie.")}
        </div>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => navigate("today"));

    app.querySelectorAll("[data-shopping-date]").forEach(button => {
      button.addEventListener("click", () => {
        openShoppingDatePicker(button.dataset.shoppingDate);
      });
    });

    app.querySelector("[data-action='share']").addEventListener("click", () => {
      openShoppingExportMenu(items, dateFrom, dateTo);
    });

    app.querySelectorAll("[data-shop-generated-toggle]").forEach(input => {
      input.addEventListener("change", () => {
        state.shoppingChecked = state.shoppingChecked || {};
        state.shoppingChecked[input.dataset.shopGeneratedToggle] = input.checked;
        saveState();
        renderShopping();
      });
    });

    app.querySelectorAll("[data-shopping-weight]").forEach(input => {
      const saveWeight = () => {
        state.shoppingEdits = state.shoppingEdits || {};
        state.shoppingEdits[input.dataset.shoppingWeight] = Number(input.value) || 0;
        saveState();
      };

      input.addEventListener("change", saveWeight);
      input.addEventListener("blur", saveWeight);
      input.addEventListener("click", event => event.stopPropagation());
    });
  }

  function buildShoppingListForRange(dateFrom, dateTo) {
    const map = new Map();
    const checked = state.shoppingChecked || {};
    const startDate = parseISODate(dateFrom);
    const endDate = parseISODate(dateTo);

    if (endDate < startDate) {
      return [];
    }

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const planId = state.assignments[toISODate(date)];
      const plan = state.mealPlans.find(item => item.id === planId);
      if (!plan) continue;

      plan.meals.forEach(meal => {
        const recipe = recipeById(meal.recipeId);
        const ingredients = meal.customIngredients || recipe?.ingredients || [];

        ingredients.forEach(ingredient => {
          const name = ingredient.name;
          if (!name) return;

          const current = map.get(name) || {
            name,
            weight: 0,
            sources: new Set()
          };

          current.weight += Number(ingredient.weight) || 0;
          current.sources.add(recipe?.title || mealLabels[meal.meal] || "posiłek");
          map.set(name, current);
        });
      });
    }

    return [...map.values()]
      .map(item => {
        const id = slugify(item.name);
        const editedWeight = state.shoppingEdits?.[id];

        return {
          ...item,
          id,
          originalWeight: item.weight,
          weight: editedWeight !== undefined ? Number(editedWeight) : item.weight,
          isEdited: editedWeight !== undefined,
          sources: [...item.sources],
          done: Boolean(checked[id])
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }

  function openShoppingDatePicker(which) {
    const currentFrom = state.settings.shoppingDateFrom || toISODate(new Date());
    const currentTo = state.settings.shoppingDateTo || addDaysISO(toISODate(new Date()), 7);
    const selected = which === "to" ? currentTo : currentFrom;

    let visibleMonth = parseISODate(selected);
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);

    const renderRangeCalendar = () => {
      const fromDate = parseISODate(currentFrom);
      const toDate = parseISODate(currentTo);
      const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
      const lastDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
      const startOffset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = lastDay.getDate();
      const prevLast = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 0).getDate();
      const cells = [];

      for (let i = startOffset - 1; i >= 0; i--) {
        const day = prevLast - i;
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, day);
        cells.push(shoppingCalendarCell(date, true, fromDate, toDate, which));
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
        cells.push(shoppingCalendarCell(date, false, fromDate, toDate, which));
      }

      while (cells.length % 7 !== 0) {
        const day = cells.length - startOffset - daysInMonth + 1;
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, day);
        cells.push(shoppingCalendarCell(date, true, fromDate, toDate, which));
      }

      openModal(which === "from" ? "Data od" : "Data do", `
        <section class="calendar-picker shopping-calendar-picker">
          <div class="calendar-month-row">
            <button class="icon-btn" type="button" data-cal-prev aria-label="Poprzedni miesiąc"><span class="material-symbols-rounded">chevron_left</span></button>
            <strong>${monthLabel(visibleMonth)}</strong>
            <button class="icon-btn" type="button" data-cal-next aria-label="Następny miesiąc"><span class="material-symbols-rounded">chevron_right</span></button>
          </div>

          <div class="calendar-weekdays">
            <span>PN</span><span>WT</span><span>ŚR</span><span>CZ</span><span>PT</span><span>SB</span><span>ND</span>
          </div>

          <div class="calendar-grid">
            ${cells.join("")}
          </div>

          <button class="secondary-btn today-btn" type="button" data-cal-today>
            <span class="material-symbols-rounded">today</span> Dziś
          </button>
        </section>
      `);

      modalRoot.querySelector("[data-cal-prev]").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
        renderRangeCalendar();
      });

      modalRoot.querySelector("[data-cal-next]").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
        renderRangeCalendar();
      });

      modalRoot.querySelector("[data-cal-today]").addEventListener("click", () => {
        setShoppingRangeDate(which, toISODate(new Date()));
      });

      modalRoot.querySelectorAll("[data-shopping-cal-date]").forEach(button => {
        button.addEventListener("click", () => {
          setShoppingRangeDate(which, button.dataset.shoppingCalDate);
        });
      });
    };

    renderRangeCalendar();
  }

  function setShoppingRangeDate(which, iso) {
    if (which === "from") {
      state.settings.shoppingDateFrom = iso;
      if (parseISODate(state.settings.shoppingDateTo) < parseISODate(iso)) {
        state.settings.shoppingDateTo = iso;
      }
    } else {
      state.settings.shoppingDateTo = iso;
      if (parseISODate(iso) < parseISODate(state.settings.shoppingDateFrom)) {
        state.settings.shoppingDateFrom = iso;
      }
    }

    saveState();
    closeModal();
    renderShopping();
  }

  function shoppingCalendarCell(date, outsideMonth, fromDate, toDate, which) {
    const iso = toISODate(date);
    const isStart = iso === toISODate(fromDate);
    const isEnd = iso === toISODate(toDate);
    const inRange = date >= fromDate && date <= toDate;
    const isSunday = date.getDay() === 0;

    return `
      <button
        class="calendar-day shopping-calendar-day ${outsideMonth ? "outside" : ""} ${inRange ? "in-range" : ""} ${isStart ? "range-start" : ""} ${isEnd ? "range-end" : ""} ${isSunday ? "sunday" : ""}"
        type="button"
        data-shopping-cal-date="${iso}"
        aria-label="${formatDate(date)}"
      >${date.getDate()}</button>
    `;
  }

  function openShoppingExportMenu(items, dateFrom, dateTo) {
    openActions("Lista zakupów", [
      {
        label: "Udostępnij",
        action: () => openShoppingFormatMenu("share", items, dateFrom, dateTo)
      },
      {
        label: "Zapisz na dysk",
        action: () => openShoppingFormatMenu("save", items, dateFrom, dateTo)
      }
    ]);
  }

  function openShoppingFormatMenu(mode, items, dateFrom, dateTo) {
    const title = mode === "share" ? "W jakim formacie udostępnić?" : "W jakim formacie zapisać?";

    openActions(title, [
      {
        label: "TXT",
        action: () => handleShoppingExport(mode, "txt", items, dateFrom, dateTo)
      },
      {
        label: "JSON",
        action: () => handleShoppingExport(mode, "json", items, dateFrom, dateTo)
      },
      {
        label: "CSV",
        action: () => handleShoppingExport(mode, "csv", items, dateFrom, dateTo)
      }
    ]);
  }

  function handleShoppingExport(mode, format, items, dateFrom, dateTo) {
    const file = shoppingExportFile(format, items, dateFrom, dateTo);

    if (mode === "save") {
      downloadTextFile(file.filename, file.content, file.mimeType);
      return;
    }

    shareShoppingFile(file);
  }

  function shoppingExportFile(format, items, dateFrom, dateTo) {
    if (format === "json") {
      return {
        filename: `lista-zakupow-${dateFrom}-${dateTo}.json`,
        content: JSON.stringify(shoppingExportPayload(items, dateFrom, dateTo), null, 2),
        mimeType: "application/json"
      };
    }

    if (format === "csv") {
      return {
        filename: `lista-zakupow-${dateFrom}-${dateTo}.csv`,
        content: shoppingCsv(items),
        mimeType: "text/csv"
      };
    }

    return {
      filename: `lista-zakupow-${dateFrom}-${dateTo}.txt`,
      content: shoppingText(items, dateFrom, dateTo),
      mimeType: "text/plain"
    };
  }

  async function shareShoppingFile(file) {
    try {
      // TXT najlepiej udostępniać jako zwykły tekst — działa w większej liczbie aplikacji.
      if (file.mimeType === "text/plain" && navigator.share) {
        await navigator.share({
          title: "Lista zakupów",
          text: file.content
        });
        return;
      }

      // JSON/CSV: najpierw spróbuj udostępnić jako plik.
      const blob = new Blob([file.content], { type: `${file.mimeType};charset=utf-8` });
      const shareFile = new File([blob], file.filename, { type: file.mimeType });

      if (navigator.canShare?.({ files: [shareFile] }) && navigator.share) {
        await navigator.share({
          title: "Lista zakupów",
          text: "Lista zakupów z aplikacji Twój jadłospis",
          files: [shareFile]
        });
        return;
      }

      // Jeżeli przeglądarka nie wspiera Web Share dla tego formatu, kopiujemy treść.
      await copyTextToClipboard(file.content);
      openInfo(
        "Skopiowano do schowka",
        `Twoja przeglądarka nie obsługuje udostępniania tego formatu. Treść pliku ${file.filename} została skopiowana do schowka.`
      );
    } catch (error) {
      // Użytkownik mógł anulować systemowe udostępnianie — wtedy nie pokazujemy fałszywego sukcesu.
      if (error?.name === "AbortError") return;

      try {
        await copyTextToClipboard(file.content);
        openInfo("Skopiowano do schowka", `Treść pliku ${file.filename} została skopiowana do schowka.`);
      } catch {
        openInfo(
          "Nie udało się udostępnić",
          "Przeglądarka zablokowała udostępnianie i kopiowanie do schowka. Użyj opcji „Zapisz na dysk”."
        );
      }
    }
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    textarea.remove();

    if (!success) {
      throw new Error("Clipboard copy failed");
    }
  }

  function shoppingText(items, dateFrom, dateTo) {
    const lines = [
      "LISTA ZAKUPÓW",
      shoppingRangeLabelFromTo(dateFrom, dateTo),
      ""
    ];

    items.forEach(item => {
      lines.push(`${item.done ? "✓" : "☐"} ${item.name} — ${formatShoppingAmount(item.weight)}`);
    });

    return lines.join("\n");
  }

  function shoppingExportPayload(items, dateFrom, dateTo) {
    return {
      type: "shoppingList",
      app: "Twój jadłospis",
      version: VERSION,
      generatedAt: new Date().toISOString(),
      dateFrom,
      dateTo,
      range: shoppingRangeLabelFromTo(dateFrom, dateTo),
      items: items.map(item => ({
        name: item.name,
        weight: round(item.weight),
        originalWeight: round(item.originalWeight ?? item.weight),
        isEdited: Boolean(item.isEdited),
        unit: "g",
        displayAmount: formatShoppingAmount(item.weight),
        done: Boolean(item.done),
        sources: item.sources || []
      }))
    };
  }

  function shoppingCsv(items) {
    const rows = [
      ["Produkt", "Ilość", "Jednostka", "Edytowano", "Do kupienia", "Źródła"]
    ];

    items.forEach(item => {
      rows.push([
        item.name,
        String(round(item.weight)),
        "g",
        item.isEdited ? "tak" : "nie",
        item.done ? "nie" : "tak",
        (item.sources || []).join("; ")
      ]);
    });

    return rows.map(row => row.map(csvCell).join(",")).join("\n");
  }

  function csvCell(value) {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  }

  function downloadTextFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function shoppingGeneratedRow(item) {
    return `
      <label class="check-row shopping-generated-row">
        <span class="shopping-product-name">
          <input type="checkbox" ${item.done ? "checked" : ""} data-shop-generated-toggle="${item.id}">
          <span>
            <strong>${escapeHTML(item.name)}</strong>
            <small>${item.sources.length} ${item.sources.length === 1 ? "posiłek" : "posiłki"}${item.isEdited ? " • edytowano" : ""}</small>
          </span>
        </span>

        <span class="shopping-amount-edit">
          <input
            class="shopping-weight-input"
            type="number"
            min="0"
            step="1"
            value="${round(item.weight)}"
            data-shopping-weight="${item.id}"
            aria-label="Ilość produktu ${escapeAttr(item.name)} w gramach"
          >
          <span>g</span>
        </span>
      </label>
    `;
  }

  function formatShoppingAmount(weight) {
    const grams = round(weight);
    if (grams >= 1000) {
      const kg = grams / 1000;
      return `${kg.toFixed(kg % 1 === 0 ? 0 : 1).replace(".", ",")} kg`;
    }
    return `${grams} g`;
  }

  function shoppingRangeLabelFromTo(dateFrom, dateTo) {
    const start = parseISODate(dateFrom);
    const end = parseISODate(dateTo);

    if (dateFrom === dateTo) {
      return `na dzień: ${formatDate(start)}`;
    }

    return `od ${formatDate(start)} do ${formatDate(end)}`;
  }

  function shoppingRow(item) {
    return `
      <label class="check-row">
        <span style="display:flex;align-items:center;gap:10px">
          <input type="checkbox" ${item.done ? "checked" : ""} data-shop-toggle="${item.id}">
          <span>${escapeHTML(item.name)}</span>
        </span>
        <span style="display:flex;align-items:center;gap:8px">
          <span>${escapeHTML(item.amount)}</span>
          <button class="overflow-btn" type="button" data-shop-menu="${item.id}"><span class="material-symbols-rounded">more_vert</span></button>
        </span>
      </label>
    `;
  }

  /* ---------- Widok 8: więcej / ustawienia ---------- */

  function renderMore() {
    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <h1 class="sub-title">Więcej</h1>
        </header>

        <section class="card more-list">
          ${moreRow("nutrition", "Lista produktów", "products")}
          ${moreRow("menu_book", "Przepisy", "recipes")}
          ${moreRow("list_alt", "Jadłospisy", "plans")}
        </section>

        <section class="card more-list more-utility-list">
          ${moreRow("backup", "Kopia zapasowa i przywracanie", null)}
          ${moreRow("settings", "Ustawienia", "settings")}
        </section>
      </section>
    `;

    app.querySelectorAll("[data-more-route]").forEach(btn => {
      btn.addEventListener("click", () => navigate(btn.dataset.moreRoute));
    });
  }

  function moreRow(icon, label, route, value = "›") {
    return `
      <div class="more-row">
        <span class="material-symbols-rounded more-icon">${icon}</span>
        ${route ? `<button type="button" data-more-route="${route}">${label}</button>` : `<strong>${label}</strong>`}
        <span class="muted">${value}</span>
      </div>
    `;
  }

  function renderSettings() {
    app.innerHTML = `
      <section class="screen settings-screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">Ustawienia</h1>
        </header>

        <form class="form settings-form" id="settingsForm">
          <p class="settings-autosave-note muted">Zmiany zapisują się automatycznie.</p>
          <section class="card card-pad settings-card">
            <h2 class="section-title">Godziny posiłków</h2>
            <div class="settings-grid">
              ${mealOrder.map(key => `
                <label class="setting-row compact-setting-row">
                  <span>${mealLabels[key]}</span>
                  <input class="form-control compact-control" type="time" name="${key}" value="${state.settings.mealTimes[key] || defaultMealTimes[key]}">
                </label>
              `).join("")}
            </div>
          </section>

          <section class="card card-pad settings-card">
            <h2 class="section-title">Sugerowana kaloryczność posiłków</h2>
            <p class="muted small settings-hint">
              Te wartości są używane przy sugerowaniu posiłków i dopasowywaniu przepisów do konkretnej pory dnia.
            </p>
            <div class="settings-grid">
              ${mealOrder.map(key => `
                <label class="setting-row compact-setting-row">
                  <span>${mealLabels[key]}</span>
                  <input class="form-control compact-control" type="number" min="1" name="${key}Kcal" value="${state.settings.mealCalories[key]}">
                </label>
              `).join("")}
            </div>
          </section>

          <section class="card card-pad settings-card">
            <h2 class="section-title">Wygląd</h2>
            <label class="setting-row compact-setting-row">
              <span>Motyw</span>
              <select class="form-select compact-control" name="theme">
                <option value="Auto" ${state.settings.theme === "Auto" ? "selected" : ""}>Jak w systemie</option>
                <option value="Jasny" ${state.settings.theme === "Jasny" ? "selected" : ""}>Jasny</option>
                <option value="Ciemny" ${state.settings.theme === "Ciemny" ? "selected" : ""}>Ciemny</option>
              </select>
            </label>
          </section>

          <section class="card card-pad settings-card backup-section">
            <h2 class="section-title">Kopia zapasowa i przywracanie</h2>
            <div class="settings-actions">
              <button class="secondary-btn compact-btn" type="button" data-action="backup-export">Eksportuj kopię zapasową</button>
              <button class="secondary-btn compact-btn" type="button" data-action="backup-import">Przywróć z pliku</button>
              <button class="danger-btn compact-btn" type="button" data-action="reset-app">Wyzeruj aplikację</button>
            </div>
          </section>

          <section class="card card-pad settings-card">
            <h2 class="section-title">Informacje</h2>
            <div class="setting-row compact-setting-row">
              <span>O aplikacji</span>
              <span class="muted">v${appVersion()}</span>
            </div>
            <div class="setting-row compact-setting-row">
              <span>Autor</span>
              <a class="muted settings-author-link" href="mailto:awj.creation@gmail.com">awj.creation</a>
            </div>
          </section>
</form>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => navigate("today"));

    const form = app.querySelector("#settingsForm");

    const persistSettings = () => {
      state.settings.theme = form.theme.value === "Jak w systemie" ? "Auto" : (form.theme.value || "Auto");

      mealOrder.forEach(key => {
        state.settings.mealTimes[key] = form[key].value || defaultMealTimes[key];
        state.settings.mealCalories[key] = Number(form[`${key}Kcal`].value) || state.settings.mealCalories[key] || 300;
      });

      saveState();
      applyTheme();
    };

    form.querySelectorAll("input, select").forEach(control => {
      control.addEventListener("change", persistSettings);
      control.addEventListener("input", persistSettings);
    });

    app.querySelector("[data-action='backup-export']")?.addEventListener("click", exportBackup);
    app.querySelector("[data-action='backup-import']")?.addEventListener("click", openBackupRestorePicker);
  
    app.querySelector("[data-action='reset-app']")?.addEventListener("click", resetApplication);
}

  function renderMealTimes() {
    app.innerHTML = `
      <section class="screen">
        <header class="sub-header">
          <button class="icon-btn back-btn" type="button" data-action="back"><span class="material-symbols-rounded">chevron_left</span></button>
          <h1 class="sub-title">Godziny posiłków</h1>
        </header>

        <p class="muted small">Ustaw standardowe godziny posiłków. Godziny będą wyświetlane w Twoim jadłospisie.</p>

        <form class="form card card-pad" id="timesForm">
          ${mealOrder.map(key => `
            <label class="setting-row">
              <span>${mealLabels[key]}</span>
              <input class="form-control" style="width:118px" type="time" name="${key}" value="${state.settings.mealTimes[key] || defaultMealTimes[key]}">
            </label>
          `).join("")}
        </form>

        <p class="card card-pad small muted">ℹ️ Godziny można w każdej chwili zmienić w ustawieniach.</p>
      </section>
    `;

    app.querySelector("[data-action='back']").addEventListener("click", () => navigate("today"));
    app.querySelector("[data-action='save']").addEventListener("click", () => {
      const form = app.querySelector("#timesForm");
      mealOrder.forEach(key => {
        state.settings.mealTimes[key] = form[key].value || defaultMealTimes[key];
        state.settings.mealCalories[key] = Number(form[`${key}Kcal`].value) || state.settings.mealCalories[key];
      });
      saveState();
      navigate("today");
    });
  }

  /* ---------- Modale i akcje ---------- */


  function openHomeMenu() {
    openActions("Opcje", [
      { label: "Ustawienia", action: () => navigate("settings") },
      { label: "Importuj", action: () => navigate("recipes") },
      { label: "Kopia zapasowa i przywracanie", action: () => openInfo("Kopia zapasowa", "Eksport i przywracanie danych zostaną dodane jako osobny moduł.") }
    ]);
  }

  function openDatePicker() {
    let visibleMonth = parseISODate(state.ui.selectedDate);
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);

    const renderCalendar = () => {
      const selected = parseISODate(state.ui.selectedDate);
      const today = new Date();
      const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
      const lastDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
      const startOffset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = lastDay.getDate();
      const prevLast = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 0).getDate();
      const cells = [];

      for (let i = startOffset - 1; i >= 0; i--) {
        const day = prevLast - i;
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, day);
        cells.push(calendarCell(date, true, selected, today));
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
        cells.push(calendarCell(date, false, selected, today));
      }

      while (cells.length % 7 !== 0) {
        const day = cells.length - startOffset - daysInMonth + 1;
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, day);
        cells.push(calendarCell(date, true, selected, today));
      }

      openModal("Wybierz datę", `
        <section class="calendar-picker">
          <div class="calendar-month-row">
            <button class="icon-btn" type="button" data-cal-prev aria-label="Poprzedni miesiąc"><span class="material-symbols-rounded">chevron_left</span></button>
            <strong>${monthLabel(visibleMonth)}</strong>
            <button class="icon-btn" type="button" data-cal-next aria-label="Następny miesiąc"><span class="material-symbols-rounded">chevron_right</span></button>
          </div>

          <div class="calendar-weekdays">
            <span>PN</span><span>WT</span><span>ŚR</span><span>CZ</span><span>PT</span><span>SB</span><span>ND</span>
          </div>

          <div class="calendar-grid">
            ${cells.join("")}
          </div>

          <button class="secondary-btn today-btn" type="button" data-cal-today><span class="material-symbols-rounded">today</span> Dziś</button>
        </section>
      `);

      modalRoot.querySelector("[data-cal-prev]").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
        renderCalendar();
      });

      modalRoot.querySelector("[data-cal-next]").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
        renderCalendar();
      });

      modalRoot.querySelector("[data-cal-today]").addEventListener("click", () => {
        state.ui.selectedDate = toISODate(new Date());
        saveState();
        closeModal();
        renderToday();
      });

      modalRoot.querySelectorAll("[data-cal-date]").forEach(button => {
        button.addEventListener("click", () => {
          state.ui.selectedDate = button.dataset.calDate;
          saveState();
          closeModal();
          renderToday();
        });
      });
    };

    renderCalendar();
  }

  function calendarCell(date, outsideMonth, selected, today) {
    const iso = toISODate(date);
    const isSelected = iso === toISODate(selected);
    const isToday = iso === toISODate(today);
    const isSunday = date.getDay() === 0;
    return `
      <button
        class="calendar-day ${outsideMonth ? "outside" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${isSunday ? "sunday" : ""}"
        type="button"
        data-cal-date="${iso}"
        aria-label="${formatDate(date)}"
      >${date.getDate()}</button>
    `;
  }

  function monthLabel(date) {
    const label = new Intl.DateTimeFormat("pl-PL", {
      month: "long",
      year: "numeric"
    }).format(date);
    return label.charAt(0).toLocaleUpperCase("pl-PL") + label.slice(1);
  }

  function openAssignPlanModal() {
    openModal("Wybierz jadłospis", `
      <div class="form">
        ${state.mealPlans.map(p => `<button class="secondary-btn" type="button" data-assign="${p.id}">${escapeHTML(p.name)}</button>`).join("")}
        <button class="primary-btn" type="button" data-new-plan>Dodaj nowy</button>
      </div>
    `);
    modalRoot.querySelectorAll("[data-assign]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.assignments[state.ui.selectedDate] = btn.dataset.assign;
        saveState();
        closeModal();
        renderToday();
      });
    });
    modalRoot.querySelector("[data-new-plan]").addEventListener("click", () => { closeModal(); newPlan(true); });
  }


  function confirmDelete(title, message, onConfirm) {
    openModal(title, `
      <div class="form">
        <p class="muted small">${message}</p>
        <button class="danger-btn" type="button" data-confirm-delete>Usuń</button>
        <button class="secondary-btn" type="button" data-cancel-delete>Anuluj</button>
      </div>
    `);

    modalRoot.querySelector("[data-confirm-delete]").addEventListener("click", () => {
      closeModal();
      onConfirm();
    });

    modalRoot.querySelector("[data-cancel-delete]").addEventListener("click", closeModal);
  }

  function confirmDeleteRecipe(id) {
    const recipe = state.recipes.find(item => item.id === id);
    confirmDelete(
      "Usunąć przepis?",
      `Czy na pewno chcesz usunąć przepis: <strong>${escapeHTML(recipe?.title || "bez nazwy")}</strong>?`,
      () => deleteRecipe(id)
    );
  }

  function confirmDeletePlan(id) {
    const plan = state.mealPlans.find(item => item.id === id);
    confirmDelete(
      "Usunąć jadłospis?",
      `Czy na pewno chcesz usunąć jadłospis: <strong>${escapeHTML(plan?.name || "bez nazwy")}</strong>?`,
      () => deletePlan(id)
    );
  }

  function openResourcesImportMenu() {
    openActions("Importuj", [
      { label: "Bazę produktów", action: () => openResourceImportPicker("product") },
      { label: "Pakiet przepisów z produktami", action: () => openResourceImportPicker("recipePack") },
      { label: "Pakiet jadłospisów z przepisami i produktami", action: () => openResourceImportPicker("mealPlanPack") },
      { label: "Bazę przepisów bez produktów", action: () => openResourceImportPicker("recipe") },
      { label: "Bazę jadłospisów bez zależności", action: () => openResourceImportPicker("mealPlan") }
    ]);
  }

  async function pickJsonFileText() {
    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          multiple: false,
          excludeAcceptAllOption: false,
          types: [
            {
              description: "Pliki JSON",
              accept: {
                "application/json": [".json"],
                "text/json": [".json"]
              }
            }
          ]
        });

        const file = await handle.getFile();
        return file.text();
      } catch (error) {
        if (error?.name === "AbortError") throw error;
      }
    }

    return pickJsonFileTextWithInput();
  }

  function pickJsonFileTextWithInput() {
    return new Promise((resolve, reject) => {
      const input = document.getElementById("resource-import-input") || document.createElement("input");

      input.type = "file";
      input.accept = ".json,application/json,text/json";
      input.removeAttribute("capture");
      input.value = "";

      if (!input.id) {
        input.id = "resource-import-input";
        input.hidden = true;
        document.body.appendChild(input);
      }

      input.onchange = async event => {
        const file = event.target.files?.[0];

        if (!file) {
          reject(new Error("Nie wybrano pliku."));
          return;
        }

        const name = String(file.name || "").toLowerCase();
        const type = String(file.type || "").toLowerCase();

        if (!name.endsWith(".json") && !type.includes("json")) {
          reject(new Error("Wybrany plik nie wygląda na JSON."));
          return;
        }

        try {
          resolve(await file.text());
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }

  async function importJsonFileForType(type) {
    try {
      const text = await pickJsonFileText();
      const data = JSON.parse(text);

      importResourcePayload(type, data);

      if (type !== "recipePack" && type !== "mealPlanPack" && data?.type !== "recipePack" && data?.type !== "mealPlanPack" && data?.type !== "resourcePack") {
        saveState();
        render();
        openInfo("Import zakończony", "Plik JSON został dodany do odpowiedniej sekcji zasobów.");
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
      openInfo("Import nieudany", "Wybierz plik JSON we właściwym formacie.");
    }
  }

  function openResourceImportPicker(type) {
    importJsonFileForType(type);
  }

  function bindResourceImportInput() {
    // Import zasobów używa wyłącznie showOpenFilePicker, żeby nie otwierać galerii zdjęć w PWA.
  }

  function normalizeProductArray(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (data?.product) return [data.product];
    return [];
  }

  function normalizeRecipeArray(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.recipes)) return data.recipes;
    if (data?.recipe) return [data.recipe];
    return [];
  }

  function normalizeMealPlanArray(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.mealPlans)) return data.mealPlans;
    if (data?.mealPlan) return [data.mealPlan];
    return [];
  }

  function importWithProductStrategy(type, data) {
    const products = normalizeProductArray(data);
    const recipes = normalizeRecipeArray(data);
    const mealPlans = normalizeMealPlanArray(data);

    if (!products.length) {
      if (type === "recipePack") {
        importRecipesPayload({ recipes });
        return;
      }

      if (type === "mealPlanPack") {
        importRecipesPayload({ recipes });
        importMealPlansPayload({ mealPlans });
        return;
      }
    }

    openActions("Produkty w imporcie", [
      {
        label: "Użyj produktów z mojej bazy",
        action: () => finishPackImport(type, products, recipes, mealPlans, "useExisting")
      },
      {
        label: "Uzupełnij tylko brakujące produkty",
        action: () => finishPackImport(type, products, recipes, mealPlans, "missingOnly")
      },
      {
        label: "Nadpisz produktami z importu",
        action: () => finishPackImport(type, products, recipes, mealPlans, "overwrite")
      },
      {
        label: "Dodaj produkty jako kopie",
        action: () => finishPackImport(type, products, recipes, mealPlans, "copy")
      }
    ]);
  }

  function finishPackImport(type, products, recipes, mealPlans, strategy) {
    importProductsWithStrategy(products, strategy);

    if (type === "recipePack") {
      importRecipesPayload({ recipes });
    }

    if (type === "mealPlanPack") {
      importRecipesPayload({ recipes });
      importMealPlansPayload({ mealPlans });
      reportMissingMealPlanDependencies(mealPlans);
    }

    saveState();
    render();
    openInfo("Import zakończony", "Pakiet został zaimportowany z wybraną obsługą produktów.");
  }

  function importProductsWithStrategy(products, strategy) {
    if (strategy === "useExisting") return;

    state.userProducts = state.userProducts || {};
    const existingNames = new Set([
      ...productBase().map(product => lowerFirst(product.name)),
      ...Object.keys(state.userProducts).map(lowerFirst)
    ]);

    products.forEach(product => {
      if (!product?.name) return;

      const baseName = lowerFirst(String(product.name).trim());
      const exists = existingNames.has(baseName) || Boolean(state.userProducts[baseName]);

      if (strategy === "missingOnly" && exists) return;

      let name = baseName;

      if (strategy === "copy" && exists) {
        name = uniqueImportedProductName(baseName);
      }

      state.userProducts[name] = {
        name,
        category: product.category || "użytkownika",
        kcal100: Number(product.kcal100) || 0,
        protein100: Number(product.protein100) || 0,
        fat100: Number(product.fat100) || 0,
        carbs100: Number(product.carbs100) || 0,
        gi: Number(product.gi) || 0,
        source: product.source || "import",
        updatedAt: new Date().toISOString()
      };

      existingNames.add(name);
    });
  }

  function uniqueImportedProductName(name) {
    let index = 1;
    let candidate = `${name} (import)`;

    while (state.userProducts[candidate] || productBase().some(product => lowerFirst(product.name) === candidate)) {
      index += 1;
      candidate = `${name} (import ${index})`;
    }

    return candidate;
  }

  function reportMissingMealPlanDependencies(mealPlans) {
    const recipeIds = new Set(state.recipes.map(recipe => recipe.id));
    const missing = [];

    mealPlans.forEach(plan => {
      (plan.meals || []).forEach(meal => {
        if (meal.recipeId && !recipeIds.has(meal.recipeId)) {
          missing.push(meal.recipeId);
        }
      });
    });

    if (missing.length) {
      openInfo(
        "Brakujące przepisy",
        `Zaimportowano jadłospisy, ale nie znaleziono ${new Set(missing).size} powiązanych przepisów.`
      );
    }
  }

  function exportProductPackPayload() {
    return productBase().map(product => ({
      name: product.name,
      category: product.category || "produkt",
      kcal100: Number(product.kcal100) || 0,
      protein100: Number(product.protein100) || 0,
      fat100: Number(product.fat100) || 0,
      carbs100: Number(product.carbs100) || 0,
      gi: inferredGI(product),
      source: product.source || (product.isUserProduct ? "użytkownika" : "baza danych")
    }));
  }

  function exportRecipePack() {
    const payload = {
      type: "recipePack",
      version: appVersion(),
      exportedAt: new Date().toISOString(),
      products: exportProductPackPayload(),
      recipes: state.recipes || []
    };

    downloadTextFile(
      `TwojJadlospis_recipePack_${toISODate(new Date())}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  }

  function exportMealPlanPack() {
    const payload = {
      type: "mealPlanPack",
      version: appVersion(),
      exportedAt: new Date().toISOString(),
      products: exportProductPackPayload(),
      recipes: state.recipes || [],
      mealPlans: state.mealPlans || []
    };

    downloadTextFile(
      `TwojJadlospis_mealPlanPack_${toISODate(new Date())}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  }

  function importResourcePayload(importType, data) {
    if (data?.type === "resourcePack" || data?.type === "recipePack" || data?.type === "mealPlanPack") {
      const type = data.type === "resourcePack" ? "mealPlanPack" : data.type;
      return importWithProductStrategy(type, data);
    }

    if (importType === "recipePack" || importType === "mealPlanPack") {
      return importWithProductStrategy(importType, data);
    }

    if (importType === "product") return importProductsPayload(data);
    if (importType === "recipe") return importRecipesPayload(data);
    if (importType === "mealPlan") return importMealPlansPayload(data);
    if (importType === "backup") return importBackupPayload(data);
    throw new Error("Unknown import type");
  }

  function importProductsPayload(data) {
    importProductsWithStrategy(normalizeProductArray(data), "overwrite");
  }

  function importRecipesPayload(data) {
    const recipes = Array.isArray(data)
      ? data
      : (Array.isArray(data.recipes) ? data.recipes : [data.recipe || data]);

    recipes.forEach(recipe => {
      if (!recipe) return;
      state.recipes.push({
        ...recipe,
        id: uid(),
        title: recipe.title || recipe.name || "Nowy przepis",
        category: recipe.category || "Inne",
        recipeType: recipe.recipeType || "single",
        mealCategory: recipe.mealCategory || "lunch",
        prep: recipe.prep || recipe.description || "",
        image: recipe.image || "",
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : []
      });
    });
  }

  function importMealPlansPayload(data) {
    const plans = Array.isArray(data)
      ? data
      : (Array.isArray(data.mealPlans) ? data.mealPlans : [data.mealPlan || data]);

    plans.forEach(plan => {
      if (!plan) return;
      state.mealPlans.push({
        id: uid(),
        name: plan.name || "Nowy jadłospis",
        meals: Array.isArray(plan.meals) ? plan.meals : []
      });
    });
  }

  function zeroAppState() {
    return {
      settings: {
        mealTimes: { ...defaultMealTimes },
        mealCalories: {
          breakfast1: 350,
          breakfast2: 250,
          lunch: 400,
          snack: 200,
          dinner: 300
        },
        theme: "Auto",
        units: "kcal, g",
        shoppingDays: 3,
        shoppingDateFrom: todayISO,
        shoppingDateTo: addDaysISO(todayISO, 7)
      },
      recipes: [],
      mealPlans: [],
      assignments: {},
      userProducts: {},
      nutritionPreference: {},
      shoppingEdits: {},
      shopping: [],
      ui: {
        route: "today",
        selectedDate: todayISO,
        planSort: "nameAsc",
        recipeFilter: "Wszystkie",
        recipeSort: "nameAsc",
        productFilter: "Wszystkie",
        productSort: "nameAsc"
      }
    };
  }

  function resetApplication() {
    confirmDelete(
      "Wyzerować aplikację?",
      "To usunie własne produkty, przepisy, jadłospisy, przypisania, listę zakupów i zmienione ustawienia. Zostanie tylko zerowa baza produktów i ustawienia domyślne.",
      () => {
        state = mergeState(defaultState, zeroAppState());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        closeModal();
        navigate("today");
      }
    );
  }

  function exportBackup() {
    const now = new Date();

    const pad = value => String(value).padStart(2, "0");

    const datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join("-");

    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes())
    ].join("-");

    const filename = `TwojJadlospis_backup_${datePart}_${timePart}.json`;

    const backupData = {
      exportedAt: now.toISOString(),
      version: VERSION,
      settings: structuredClone(state.settings || {}),
      recipes: structuredClone(state.recipes || []),
      mealPlans: structuredClone(state.mealPlans || []),
      assignments: structuredClone(state.assignments || {}),
      userProducts: structuredClone(state.userProducts || {}),
      nutritionPreference: structuredClone(state.nutritionPreference || {}),
      shoppingEdits: structuredClone(state.shoppingEdits || {}),
      shopping: structuredClone(state.shopping || []),
      ui: structuredClone(state.ui || {})
    };

    downloadTextFile(
      filename,
      JSON.stringify(backupData, null, 2),
      "application/json"
    );
  }

  function openBackupRestorePicker() {
    openResourceImportPicker("backup");
  }

  function importBackupPayload(data) {
    if (!data?.state) throw new Error("Invalid backup");
    state = mergeState(defaultState, data.state);
  }

  function openResourcesExportMenu() {
    openActions("Eksportuj", [
      {
        label: "Bazę produktów",
        action: exportAllProducts
      },
      {
        label: "Bazę przepisów",
        action: exportAllRecipes
      },
      {
        label: "Bazę jadłospisów",
        action: exportMealPlans
      }
    ]);
  }

  function exportAllProducts() {
    const products = productBase().map(product => ({
      name: product.name,
      category: product.category,
      source: product.source || (product.isBaseProduct ? "baza danych" : "użytkownika"),
      gi: inferredGI(product),
      kcal100: Number(product.kcal100) || 0,
      protein100: Number(product.protein100) || 0,
      fat100: Number(product.fat100) || 0,
      carbs100: Number(product.carbs100) || 0,
        gi: Number(product.gi) || 0,
      recipeCount: Number(product.recipeCount) || 0,
      recipeTitles: product.recipeTitles || [],
      isBaseProduct: Boolean(product.isBaseProduct),
      isUserProduct: Boolean(product.isUserProduct)
    }));

    const payload = {
      type: "products",
      app: "Twój jadłospis",
      version: VERSION,
      exportedAt: new Date().toISOString(),
      products
    };

    downloadTextFile(
      `produkty-${toISODate(new Date())}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  }

  function exportAllRecipes() {
    const payload = {
      type: "recipes",
      app: "Twój jadłospis",
      version: VERSION,
      exportedAt: new Date().toISOString(),
      recipes: state.recipes
    };

    downloadTextFile(
      `przepisy-${toISODate(new Date())}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  }

  function exportMealPlans() {
    const payload = {
      type: "mealPlans",
      app: "Twój jadłospis",
      version: VERSION,
      exportedAt: new Date().toISOString(),
      mealPlans: state.mealPlans
    };

    downloadTextFile(
      `jadlospisy-${toISODate(new Date())}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  }

  function exportMealPlan(id) {
    const plan = state.mealPlans.find(item => item.id === id);
    if (!plan) return;

    const payload = {
      type: "mealPlan",
      app: "Twój jadłospis",
      version: VERSION,
      exportedAt: new Date().toISOString(),
      mealPlan: {
        id: plan.id,
        name: plan.name,
        meals: plan.meals
      }
    };

    downloadTextFile(
      `${slugify(plan.name || "jadlospis")}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  }

  function openActions(title, actions) {
    openModal(title, `<div class="form">${actions.map((a, i) => `<button class="${a.danger ? "danger-btn" : "secondary-btn"}" type="button" data-action-index="${i}">${a.label}</button>`).join("")}</div>`);
    modalRoot.querySelectorAll("[data-action-index]").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = actions[Number(btn.dataset.actionIndex)];
        closeModal();
        action.action();
      });
    });
  }

  function openInfo(title, body) {
    openModal(title, `<div class="muted">${body}</div>`);
  }

  function openModal(title, body) {
    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="dialog" aria-modal="true">
        <section class="modal">
          <header class="modal-header">
            <h2 class="modal-title">${escapeHTML(title)}</h2>
            <button class="icon-btn" type="button" data-close-modal><span class="material-symbols-rounded">close</span></button>
          </header>
          ${body}
        </section>
      </div>
    `;
    modalRoot.querySelector("[data-close-modal]").addEventListener("click", closeModal);
    modalRoot.querySelector(".modal-backdrop").addEventListener("click", e => {
      if (e.target.classList.contains("modal-backdrop")) closeModal();
    });
  }

  function closeModal() {
    modalRoot.innerHTML = "";
  }


  function baseProductByName(name) {
    return baseProducts.find(product => product.name === name);
  }

  function userProductByName(name) {
    return state.userProducts?.[name] || null;
  }

  function hasDualNutrition(name) {
    return Boolean(baseProductByName(name) && userProductByName(name));
  }

  function nutritionFromBaseProduct(name) {
    const base = baseProductByName(name);
    if (!base) return null;
    return {
      kcal100: Number(base.kcal100) || 0,
      protein100: Number(base.protein100) || 0,
      fat100: Number(base.fat100) || 0,
      carbs100: Number(base.carbs100) || 0,
      nutritionSource: "base"
    };
  }

  function nutritionFromUserProduct(name) {
    const user = userProductByName(name);
    if (!user) return null;
    return {
      kcal100: Number(user.kcal100) || 0,
      protein100: Number(user.protein100) || 0,
      fat100: Number(user.fat100) || 0,
      carbs100: Number(user.carbs100) || 0,
      nutritionSource: "user"
    };
  }

  function applyNutritionSource(ingredientItem, source) {
    const values = source === "user"
      ? nutritionFromUserProduct(ingredientItem.name)
      : nutritionFromBaseProduct(ingredientItem.name);

    if (!values) return ingredientItem;
    return {
      ...ingredientItem,
      kcal100: values.kcal100,
      protein100: values.protein100,
      fat100: values.fat100,
      carbs100: values.carbs100,
      nutritionSource: values.nutritionSource
    };
  }

  function valuesDifferFromBase(item) {
    const base = nutritionFromBaseProduct(item.name);
    if (!base) return false;

    return ["kcal100", "protein100", "fat100", "carbs100"].some(key =>
      Number(item[key] || 0) !== Number(base[key] || 0)
    );
  }

  function saveUserProductFromIngredient(item) {
    state.userProducts = state.userProducts || {};
    state.userProducts[item.name] = {
      name: item.name,
      kcal100: Number(item.kcal100) || 0,
      protein100: Number(item.protein100) || 0,
      fat100: Number(item.fat100) || 0,
      carbs100: Number(item.carbs100) || 0,
      source: "użytkownika",
      gi: Number(product.gi) || 0,
        updatedAt: new Date().toISOString()
    };
  }

  function chooseNutritionSourceForList(list, afterChoice) {
    const products = [...new Set(list.map(item => item.name).filter(hasDualNutrition))];

    if (!products.length) {
      afterChoice();
      return;
    }

    openModal("Źródło wartości odżywczych", `
      <div class="form">
        <p class="muted small">
          Dla części produktów istnieją wartości z bazy danych i wartości podane przez użytkownika.
          Wybierz, których użyć do obliczeń.
        </p>

        <button class="primary-btn" type="button" data-nutrition-choice="base">Licz na podstawie bazy danych</button>
        <button class="secondary-btn" type="button" data-nutrition-choice="user">Licz na podstawie danych użytkownika</button>
      </div>
    `);

    modalRoot.querySelectorAll("[data-nutrition-choice]").forEach(button => {
      button.addEventListener("click", () => {
        const source = button.dataset.nutritionChoice;
        list.forEach((item, index) => {
          if (hasDualNutrition(item.name)) {
            list[index] = applyNutritionSource(item, source);
          }
        });

        closeModal();
        afterChoice(source);
      });
    });
  }

  function fillIngredientFromBaseByName(form) {
    const name = lowerFirst(form.name.value.trim());
    const values = nutritionFromBaseProduct(name);
    if (!values) return;

    form.kcal100.value = values.kcal100;
    form.protein100.value = values.protein100;
    form.fat100.value = values.fat100;
    form.carbs100.value = values.carbs100;
  }

  function openIngredientModal(list, index, afterSave) {
    const existing = index === null ? ingredient("", 0, 0, 0, 0, 0) : list[index];
    openModal(index === null ? "Dodaj składnik" : "Edytuj składnik", `
      <form class="form" id="ingredientForm">
        <datalist id="baseProductsList">
          ${baseProducts.map(product => `<option value="${escapeAttr(product.name)}"></option>`).join("")}
        </datalist>
        <label class="form-group">
          <span class="form-label">Nazwa artykułu spożywczego</span>
          <input class="form-control" name="name" list="baseProductsList" value="${escapeAttr(existing.name)}">
        </label>
        <label class="form-group">
          <span class="form-label">Waga</span>
          <input class="form-control" name="weight" type="number" min="0" value="${existing.weight}">
        </label>
        <hr style="width:100%;border:0;border-top:1px solid var(--line)">
        <label class="form-group">
          <span class="form-label">Kaloryczność 100 g produktu</span>
          <input class="form-control" name="kcal100" type="number" min="0" value="${existing.kcal100}">
        </label>
        <div class="form-row two">
          <label class="form-group">
            <span class="form-label">Białko / 100 g</span>
            <input class="form-control" name="protein100" type="number" min="0" step="0.1" value="${existing.protein100}">
          </label>
          <label class="form-group">
            <span class="form-label">Tłuszcze / 100 g</span>
            <input class="form-control" name="fat100" type="number" min="0" step="0.1" value="${existing.fat100}">
          </label>
        </div>
        <label class="form-group">
          <span class="form-label">Węglowodany / 100 g</span>
          <input class="form-control" name="carbs100" type="number" min="0" step="0.1" value="${existing.carbs100}">
        </label>
        <button class="primary-btn" type="submit">Zapisz</button>
      </form>
    `);
    const ingredientForm = modalRoot.querySelector("#ingredientForm");
    ingredientForm.name.addEventListener("change", () => fillIngredientFromBaseByName(ingredientForm));
    ingredientForm.name.addEventListener("blur", () => fillIngredientFromBaseByName(ingredientForm));

    ingredientForm.addEventListener("submit", e => {
      e.preventDefault();
      const f = e.target;
      const updated = ingredient(
        lowerFirst(f.name.value.trim()),
        Number(f.weight.value) || 0,
        Number(f.kcal100.value) || 0,
        Number(f.protein100.value) || 0,
        Number(f.fat100.value) || 0,
        Number(f.carbs100.value) || 0
      );

      updated.nutritionSource = valuesDifferFromBase(updated) ? "user" : (baseProductByName(updated.name) ? "base" : "manual");

      if (updated.nutritionSource === "user") {
        saveUserProductFromIngredient(updated);
      }

      if (index === null) list.push(updated);
      else list[index] = updated;
      saveState();
      closeModal();
      afterSave();
    });
  }

  function openAddMealModal(planId) {
    openModal("Dodaj posiłek", `
      <div class="form">
        ${mealOrder.map(k => `<button class="secondary-btn" type="button" data-meal="${k}">${mealLabels[k]}</button>`).join("")}
      </div>
    `);
    modalRoot.querySelectorAll("[data-meal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const meal = btn.dataset.meal;
        closeModal();
        openRecipePicker(planId, meal);
      });
    });
  }

  function openRecipePicker(planId, mealKey) {
    openModal(`Wybierz danie — ${mealLabels[mealKey]}`, `
      <div class="form">
        ${state.recipes.map(r => `<button class="secondary-btn" type="button" data-recipe="${r.id}">${escapeHTML(r.title)}</button>`).join("")}
        <button class="primary-btn" type="button" data-new-recipe>Dodaj przepis</button>
      </div>
    `);
    modalRoot.querySelectorAll("[data-recipe]").forEach(btn => {
      btn.addEventListener("click", () => {
        const plan = state.mealPlans.find(p => p.id === planId);
        const recipe = recipeById(btn.dataset.recipe);
        const existing = plan.meals.find(m => m.meal === mealKey);
        const entry = {
          meal: mealKey,
          recipeId: recipe.id,
          portionWeight: totalWeight(recipe.ingredients),
          customIngredients: clone(recipe.ingredients)
        };
        if (existing) Object.assign(existing, entry);
        else plan.meals.push(entry);
        saveState();
        closeModal();
        renderEditPlan();
      });
    });
    modalRoot.querySelector("[data-new-recipe]").addEventListener("click", () => {
      closeModal();
      newRecipe();
    });
  }

  function pickRecipeForPlanMeal(planId, mealKey) {
    state.ui.recipePickContext = {
      planId,
      meal: mealKey
    };
    state.ui.recipeEditMode = null;
    saveState();
    navigate("recipes");
  }

  function openEditPlanMealMenu(planId, mealKey) {
    const plan = state.mealPlans.find(p => p.id === planId);
    const meal = plan?.meals.find(item => item.meal === mealKey);

    if (!plan || !meal) return;

    openActions(mealLabels[mealKey] || "Posiłek", [
      {
        label: "Edytuj składniki",
        action: () => openMealIngredientsModal(planId, mealKey)
      },
      {
        label: "Zmień przepis",
        action: () => pickRecipeForPlanMeal(planId, mealKey)
      },
      {
        label: "Usuń z jadłospisu",
        danger: true,
        action: () => confirmRemoveMealFromPlan(planId, mealKey)
      }
    ]);
  }

  function confirmRemoveMealFromPlan(planId, mealKey) {
    confirmDelete(
      "Usunąć posiłek?",
      `Czy na pewno chcesz usunąć posiłek <strong>${escapeHTML(mealLabels[mealKey] || "posiłek")}</strong> z jadłospisu?`,
      () => {
        const plan = state.mealPlans.find(p => p.id === planId);
        if (!plan) return;

        plan.meals = plan.meals.filter(item => item.meal !== mealKey);
        saveState();
        renderEditPlan();
      }
    );
  }

  function openMealIngredientsModal(planId, mealKey) {
    const plan = state.mealPlans.find(p => p.id === planId);
    const meal = plan.meals.find(m => m.meal === mealKey);
    const recipe = recipeById(meal.recipeId);
    const list = meal.customIngredients || clone(recipe?.ingredients || []);
    meal.customIngredients = list;

    openModal(`${mealLabels[mealKey]} — składniki`, `
      <div class="ingredients-list">
        ${list.map((ing, index) => ingredientRow(ing, index)).join("") || `<p class="empty-state">Brak składników.</p>`}
      </div>
      <br>
      <button class="secondary-btn" type="button" data-add-ing>+ Dodaj składnik</button>
      <div class="form-actions-bottom">
        <button class="primary-btn" type="button" data-save-meal-ingredients>Zapisz</button>
      </div>
    `);
    bindModalIngredientRows(list, () => openMealIngredientsModal(planId, mealKey));
    modalRoot.querySelector("[data-add-ing]").addEventListener("click", () => openIngredientModal(list, null, () => openMealIngredientsModal(planId, mealKey)));
    modalRoot.querySelector("[data-save-meal-ingredients]").addEventListener("click", () => {
      saveState();
      closeModal();
      renderEditPlan();
    });
  }

  function openShoppingModal() {
    openModal("Dodaj produkt", `
      <form class="form" id="shoppingForm">
        <label class="form-group">
          <span class="form-label">Produkt</span>
          <input class="form-control" name="name">
        </label>
        <label class="form-group">
          <span class="form-label">Ilość</span>
          <input class="form-control" name="amount" placeholder="np. 500 g">
        </label>
        <button class="primary-btn">Dodaj</button>
      </form>
    `);
    modalRoot.querySelector("#shoppingForm").addEventListener("submit", e => {
      e.preventDefault();
      state.shopping.push({ id: uid(), name: lowerFirst(e.target.name.value.trim()), amount: e.target.amount.value.trim(), done: false });
      saveState();
      closeModal();
      renderShopping();
    });
  }

  /* ---------- Pomocnicze widoki / bindy ---------- */

  function ingredientRow(ing, index) {
    return `
      <div class="ingredient-row">
        <button class="ingredient-name" type="button" data-edit-ingredient="${index}">${escapeHTML(ing.name || "składnik")}</button>
        <span class="ingredient-weight">${round(ing.weight)} g</span>
        <button class="remove-btn" type="button" data-remove-ingredient="${index}" aria-label="Usuń"><span class="material-symbols-rounded">close</span></button>
      </div>
    `;
  }

  function bindIngredientRows(list, afterSave) {
    app.querySelectorAll("[data-edit-ingredient]").forEach(btn => {
      btn.addEventListener("click", () => openIngredientModal(list, Number(btn.dataset.editIngredient), afterSave));
    });
    app.querySelectorAll("[data-remove-ingredient]").forEach(btn => {
      btn.addEventListener("click", () => {
        list.splice(Number(btn.dataset.removeIngredient), 1);
        saveState();
        afterSave();
      });
    });
  }

  function bindModalIngredientRows(list, afterSave) {
    modalRoot.querySelectorAll("[data-edit-ingredient]").forEach(btn => {
      btn.addEventListener("click", () => openIngredientModal(list, Number(btn.dataset.editIngredient), afterSave));
    });
    modalRoot.querySelectorAll("[data-remove-ingredient]").forEach(btn => {
      btn.addEventListener("click", () => {
        list.splice(Number(btn.dataset.removeIngredient), 1);
        saveState();
        closeModal();
        afterSave();
      });
    });
  }

  function bindMealOpens() {
    app.querySelectorAll("[data-open-meal]").forEach(card => {
      card.addEventListener("click", () => {
        const plan = state.mealPlans.find(p => p.id === state.assignments[state.ui.selectedDate]);
        openMealIngredientsModal(plan.id, card.dataset.openMeal);
      });
    });
  }

  function emptyList(text) {
    return `<div class="empty-state">${text}</div>`;
  }


  function mealNutritionColumn(t) {
    return `
      <div class="meal-macros-column">
        <div class="meal-macro kcal">
          <span class="material-symbols-rounded">local_fire_department</span>
          <strong>${round(t.kcal)}</strong>
        </div>

        <div class="meal-macro">
          <span class="material-symbols-rounded">egg_alt</span>
          <span>${round(t.protein)} g</span>
        </div>

        <div class="meal-macro">
          <span class="material-symbols-rounded">water_drop</span>
          <span>${round(t.fat)} g</span>
        </div>

        <div class="meal-macro">
          <span class="material-symbols-rounded">grass</span>
          <span>${round(t.carbs)} g</span>
        </div>
      </div>
    `;
  }

  function nutritionStrip(t) {
    return `
      <div class="nutrition-strip compact-nutrition">
        <div class="nutrition-item calories"><span class="material-symbols-rounded macro-icon">local_fire_department</span><strong>${round(t.kcal)} kcal</strong></div>
        <div class="nutrition-item"><span class="material-symbols-rounded macro-icon">egg_alt</span><strong>${round(t.protein)} g</strong></div>
        <div class="nutrition-item"><span class="material-symbols-rounded macro-icon">water_drop</span><strong>${round(t.fat)} g</strong></div>
        <div class="nutrition-item"><span class="material-symbols-rounded macro-icon">grass</span><strong>${round(t.carbs)} g</strong></div>
      </div>
    `;
  }

  /* ---------- Operacje na danych ---------- */


  function editPlanForDate(id) {
    state.ui.editPlanId = id;
    state.ui.editPlanContext = {
      sourcePlanId: id,
      date: state.ui.selectedDate
    };
    navigate("edit-plan");
  }

  function newPlan(assignToCurrentDate) {
    const next = state.mealPlans.length + 1;
    const plan = { id: uid(), name: `Nowy jadłospis ${next}`, meals: [] };
    state.mealPlans.push(plan);
    if (assignToCurrentDate) state.assignments[state.ui.selectedDate] = plan.id;
    state.ui.planEditMode = "new";
    saveState();
    editPlan(plan.id);
  }

  function editPlan(id) {
    state.ui.editPlanId = id;
    state.ui.editPlanContext = null;
    if (state.ui.planEditMode !== "new") state.ui.planEditMode = "edit";
    navigate("edit-plan");
  }

  function deletePlan(id) {
    state.mealPlans = state.mealPlans.filter(p => p.id !== id);
    Object.keys(state.assignments).forEach(date => {
      if (state.assignments[date] === id) delete state.assignments[date];
    });
    saveState();
    renderPlans();
  }

  function newRecipe() {
    const recipe = {
      id: uid(),
      title: "",
      category: "Śniadania",
      recipeType: "single",
      mealCategory: "breakfast1",
      prep: "",
      image: "",
      ingredients: []
    };
    state.recipes.push(recipe);
    state.ui.recipeEditMode = "new";
    saveState();
    editRecipe(recipe.id);
  }

  
  // Otwiera pusty formularz nowego przepisu.
  function createNewRecipe() {
    state.ui.editRecipeId = null;

    state.ui.recipeDraft = {
      name: "",
      description: "",
      category: "",
      ingredients: [],
      steps: [],
      portions: 1,
      prepTime: "",
      calories: 0
    };

    navigate("recipe-edit");
  }

function editRecipe(id) {
    state.ui.editRecipeId = id;
    navigate("edit-recipe");
  }

  function deleteRecipe(id) {
    state.recipes = state.recipes.filter(r => r.id !== id);
    state.mealPlans.forEach(plan => {
      plan.meals = plan.meals.filter(m => m.recipeId !== id);
    });
    saveState();
    renderRecipes();
  }

  function changeDay(delta) {
    const date = parseISODate(state.ui.selectedDate);
    date.setDate(date.getDate() + delta);
    state.ui.selectedDate = toISODate(date);
    saveState();
    renderToday();
  }

  function sortPlans(plans) {
    const mode = state.ui.planSort || "nameAsc";
    return plans.sort((a, b) => {
      if (mode === "nameAsc") return a.name.localeCompare(b.name, "pl");
      if (mode === "nameDesc") return b.name.localeCompare(a.name, "pl");
      if (mode === "kcalAsc") return planTotals(a).kcal - planTotals(b).kcal;
      if (mode === "kcalDesc") return planTotals(b).kcal - planTotals(a).kcal;
      return 0;
    });
  }

  function planTotals(plan) {
    return plan.meals.reduce((acc, meal) => {
      const recipe = recipeById(meal.recipeId);
      const totals = ingredientsTotals(meal.customIngredients || recipe?.ingredients || []);
      acc.kcal += totals.kcal;
      acc.protein += totals.protein;
      acc.fat += totals.fat;
      acc.carbs += totals.carbs;
      return acc;
    }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });
  }

  function mealTargetKcal(mealKey) {
    return Number(state.settings.mealCalories?.[mealKey]) || 300;
  }

  function ingredientsTotals(list) {
    return list.reduce((acc, ing) => {
      const factor = (Number(ing.weight) || 0) / 100;
      acc.kcal += factor * (Number(ing.kcal100) || 0);
      acc.protein += factor * (Number(ing.protein100) || 0);
      acc.fat += factor * (Number(ing.fat100) || 0);
      acc.carbs += factor * (Number(ing.carbs100) || 0);
      return acc;
    }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });
  }

  function productBase() {
    const map = new Map();

    baseProducts.forEach(product => {
      map.set(product.name, {
        ...product,
        weight: 0,
        recipeIds: new Set(),
        recipeTitles: new Set(),
        isBaseProduct: true
      });
    });

    state.recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name;
        const current = map.get(key) || {
          ...ing,
          category: "z przepisów",
          source: "przepisy użytkownika",
          weight: 0,
          recipeIds: new Set(),
          recipeTitles: new Set(),
          isBaseProduct: false
        };

        current.weight += Number(ing.weight) || 0;
        current.kcal100 = Number(current.kcal100 || ing.kcal100) || 0;
        current.protein100 = Number(current.protein100 || ing.protein100) || 0;
        current.fat100 = Number(current.fat100 || ing.fat100) || 0;
        current.carbs100 = Number(current.carbs100 || ing.carbs100) || 0;
        current.recipeIds.add(recipe.id);
        current.recipeTitles.add(recipe.title);

        map.set(key, current);
      });
    });

    return [...map.values()]
      .map(product => ({
        ...product,
        recipeIds: [...product.recipeIds],
        recipeTitles: [...product.recipeTitles],
        recipeCount: product.recipeIds.size
      }))
      .sort((a, b) => {
        const result = a.name.localeCompare(b.name, "pl");
        return state.ui.productSort === "nameDesc" ? -result : result;
      });
  }

  function macroGroup(p) {
    const values = [
      ["Białko", Number(p.protein100) || 0],
      ["Węglowodany", Number(p.carbs100) || 0],
      ["Tłuszcze", Number(p.fat100) || 0]
    ].sort((a, b) => b[1] - a[1]);
    return values[0][0];
  }

  function productEmoji(product) {
    // Ikona produktu zależy od kategorii żywności.
    // Zestaw pochodzi z podglądu HTML: zestaw_ikon_produktow_pwa-1.html.
    const category = String(product.category || "").toLowerCase();

    const icons = {
      "warzywa": "grass",
      "owoce": "nutrition",
      "pieczywo": "bakery_dining",
      "zbożowe": "wheat",
      "zboza": "wheat",
      "nabiał": "grocery",
      "nabial": "grocery",
      "jaja": "egg_alt",
      "mięso": "savings",
      "mieso": "savings",
      "ryby": "set_meal",
      "strączki": "avocado_bean",
      "straczki": "avocado_bean",
      "tłuszcze": "water_do",
      "tluszcze": "water_do",
      "orzechy": "neurology",
      "przyprawy": "psychiatry",
      "zioła": "psychiatry",
      "ziola": "psychiatry",
      "dodatki": "local_pizza",
      "napoje": "water_medium",
      "użytkownika": "person",
      "uzytkownika": "person",
      "z przepisów": "menu_book",
      "z przepisow": "menu_book",
    };

    return icons[category] || "shopping_cart";
  }


  function recipeById(id) {
    return state.recipes.find(r => r.id === id);
  }

  function ingredient(name, weight, kcal100, protein100, fat100, carbs100) {
    return { id: uid(), name, weight, kcal100, protein100, fat100, carbs100 };
  }

  function totalWeight(list) {
    return list.reduce((sum, i) => sum + (Number(i.weight) || 0), 0);
  }

  function handleImage(event, cb) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  }

  /* ---------- Nawigacja ---------- */

  function navigate(route) {
    if (route === "today") {
      state.ui.selectedDate = toISODate(new Date());
      state.ui.assignPlanMode = false;
    }
    state.ui.route = route;
    saveState();
    render();
  }

  function bindBottomNav() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}

  function syncNav() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      const route = btn.dataset.route;
      const active =
        route === state.ui.route ||
        (route === "library" && ["products", "recipes", "edit-recipe", "plans", "edit-plan"].includes(state.ui.route));
      btn.classList.toggle("active", active);
    });
  }

  /* ---------- Storage / PWA ---------- */

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return defaultState;
      const parsed = JSON.parse(saved);
      return mergeState(defaultState, parsed);
    } catch {
      return defaultState;
    }
  }

  function saveState() {
    try {
      const previous = localStorage.getItem(STORAGE_KEY);
      if (previous) localStorage.setItem(STORAGE_BACKUP_KEY, previous);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      openInfo("Nie zapisano danych", "Pamięć lokalna przeglądarki jest pełna albo niedostępna. Wykonaj kopię zapasową.");
    }
  }

  function mergeState(base, saved) {
    return {
      ...clone(base),
      ...saved,
      settings: {
        ...base.settings,
        ...(saved.settings || {}),
        mealTimes: { ...base.settings.mealTimes, ...(saved.settings?.mealTimes || {}) },
        mealCalories: { ...base.settings.mealCalories, ...(saved.settings?.mealCalories || {}) }
      },
      ui: { ...base.ui, ...(saved.ui || {}) }
    };
  }

  function registerPWA() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("./sw.js")
      .then(registration => {
        if (registration.waiting) showUpdateNotice(registration);

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateNotice(registration);
            }
          });
        });
      })
      .catch(() => {});

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (state.ui?.reloadingForUpdate) return;
      state.ui.reloadingForUpdate = true;
      saveState();
      window.location.reload();
    });

    window.addEventListener("online", () => showToast("Połączenie przywrócone"));
    window.addEventListener("offline", () => showToast("Tryb offline"));
  }

  function showUpdateNotice(registration) {
    openActions("Dostępna aktualizacja", [
      {
        label: "Zaktualizuj teraz",
        action: () => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
          closeModal();
        }
      },
      {
        label: "Później",
        action: closeModal
      }
    ]);
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "app-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 220);
    }, 2200);
  }

  function inferredGI(product) {
    const explicit = Number(product?.gi);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;

    const name = String(product?.name || "").toLowerCase().trim();
    if (!name) return 0;

    if (Object.prototype.hasOwnProperty.call(genericGI, name)) {
      return genericGI[name];
    }

    const match = Object.keys(genericGI).find(key => name.includes(key) || key.includes(name));
    return match ? genericGI[match] : 0;
  }

function giClass(gi) {
    const value = Number(gi);

    if (!Number.isFinite(value) || value <= 0) {
      return "unknown";
    }

    if (value <= 55) {
      return "low";
    }

    if (value <= 69) {
      return "medium";
    }

    return "high";
  }

  function giValueClass(gi) {
    const value = Number(gi);

    if (!Number.isFinite(value) || value <= 0) {
      return "unknown";
    }

    if (value <= 55) {
      return "low";
    }

    if (value <= 69) {
      return "medium";
    }

    return "high";
  }

  function giInline(gi) {
    const value = Number(gi);
    const text = Number.isFinite(value) && value > 0 ? String(Math.round(value)) : "—";

    return `
      <span class="gi-inline-label">IG</span>
      <strong class="gi-value gi-${giValueClass(gi)}">${text}</strong>
    `;
  }

  function giLabel(gi) {
    const value = Number(gi);

    if (!Number.isFinite(value) || value <= 0) {
      return "brak";
    }

    if (value <= 55) {
      return "niski";
    }

    if (value <= 69) {
      return "średni";
    }

    return "wysoki";
  }

function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function unique(list) {
    return [...new Set(list.filter(Boolean))];
  }

  function round(value) {
    return Math.round(Number(value) || 0);
  }

  function lowerFirst(text) {
    if (!text) return "";
    return text.charAt(0).toLocaleLowerCase("pl-PL") + text.slice(1);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHTML(value);
  }


  function addDaysISO(iso, days) {
    const date = parseISODate(iso);
    date.setDate(date.getDate() + days);
    return toISODate(date);
  }

  function relativeDayLabel(date) {
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date();
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diff = Math.round((target - base) / 86400000);

    if (diff === 0) return "Dzisiaj";
    if (diff === 1) return "Jutro";
    if (diff === 2) return "Pojutrze";
    if (diff === -1) return "Wczoraj";
    if (diff === -2) return "Przedwczoraj";
    return formatWeekday(date);
  }

  function formatWeekday(date) {
    const label = new Intl.DateTimeFormat("pl-PL", { weekday: "long" }).format(date);
    return label.charAt(0).toLocaleUpperCase("pl-PL") + label.slice(1);
  }

  function formatShortDate(date) {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function formatFullDate(date) {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long"
    }).format(date);
  }

  function formatDate(date) {
    const label = new Intl.DateTimeFormat("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
    return label.charAt(0).toLocaleUpperCase("pl-PL") + label.slice(1);
  }

  function toISODate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function parseISODate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
})();
