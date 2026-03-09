export type Restaurant = {
  id: string;
  name: string;
  description: string;
  address?: string;
  dishName: string;
  dishDescription?: string;
  dishImage?: string;
  coords?: { lat: number; lng: number };
  i18n?: {
    [lang: string]: {
      name?: string;
      description?: string;
      dishName?: string;
      dishDescription?: string;
    };
  };
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "bossa",
    name: "BOSSA",
    description: "Frutos do mar com toque contemporâneo e criativo.",
    address: "Avenida Costa Azul, Rio das Ostras",
    dishName: "Canoeiro",
    dishDescription:
      "Filé de salmão grelhado com batata ao murro, pangranato de coco e espuma leve de moqueca.",
    dishImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop&crop=faces&sat=-100&exp=15",
    coords: { lat: -22.525005044825953, lng: -41.92196604541569 },
    i18n: {
      en: {
        description: "Seafood with a contemporary and creative touch.",
        dishName: "Canoeiro",
        dishDescription:
          "Grilled salmon with smashed potatoes, coconut pangrattato and a light moqueca foam.",
      },
      es: {
        description: "Mariscos con un toque contemporáneo y creativo.",
        dishName: "Canoeiro",
        dishDescription:
          "Salmón a la parrilla con patata desconchada, pangranato de coco y espuma ligera de moqueca.",
      },
      fr: {
        description: "Fruits de mer avec une touche contemporaine et créative.",
        dishName: "Canoeiro",
        dishDescription:
          "Saumon grillé avec pommes de terre écrasées, pangranato de noix de coco et une légère mousse de moqueca.",
      },
    },
  },
  {
    id: "bartro",
    name: "BARTRÔ",
    description: "Bar moderno com boas porções e drinques autorais.",
    address: "Rua Jandira Moraes Pimentel, 449 - Centro, Rio das Ostras",
    dishName: "Maracangalha",
    dishDescription:
      "Camarões grelhados sobre musseline de batata-doce com molho de maracujá.",
    dishImage:
      "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1200&auto=format&fit=crop&crop=faces&sat=-100&exp=15",
    coords: { lat: -22.526917305763018, lng: -41.94272508959807 },
    i18n: {
      en: {
        description:
          "Modern bar with generous portions and signature cocktails.",
        dishName: "Maracangalha",
        dishDescription:
          "Grilled shrimp over sweet potato mousseline with passion fruit sauce.",
      },
      es: {
        description: "Bar moderno con buenas raciones y cócteles de autor.",
        dishName: "Maracangalha",
        dishDescription:
          "Camarones a la parrilla sobre muselina de batata dulce con salsa de maracuyá.",
      },
      fr: {
        description:
          "Bar moderne avec de bonnes portions et des cocktails signatures.",
        dishName: "Maracangalha",
        dishDescription:
          "Crevettes grillées sur mousseline de patate douce avec sauce au fruit de la passion.",
      },
    },
  },
  {
    id: "degusta",
    name: "DEGUSTA – Comida Mexicana",
    description: "Sabores mexicanos com uma pegada praiana.",
    address: "Praça São Pedro, 99 - Centro, Rio das Ostras",
    dishName: "Samba da Minha Terra",
    dishDescription:
      "Camarões ao estilo moqueca com crosta de farinha panko e catupiry.",
    dishImage:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.51847071710228, lng: -41.92148717425248 },
    i18n: {
      en: {
        description: "Mexican flavors with a coastal twist.",
        dishName: "Samba da Minha Terra",
        dishDescription:
          "Shrimps in moqueca style with panko crust and catupiry cheese.",
      },
      es: {
        description: "Sabores mexicanos con un toque costero.",
        dishName: "Samba da Minha Terra",
        dishDescription:
          "Camarones al estilo moqueca con costra de panko y catupiry.",
      },
      fr: {
        description: "Saveurs mexicaines avec une touche côtière.",
        dishName: "Samba da Minha Terra",
        dishDescription:
          "Crevettes à la mode moqueca avec croûte de panko et catupiry.",
      },
    },
  },
  {
    id: "delicias-de-casa",
    name: "DELÍCIAS DE CASA",
    description: "Culinária caseira com ingredientes frescos e saborosos.",
    address: "Rua Jandira Moraes Pimentel - Centro, Rio das Ostras",
    dishName: "Sabor da Maré",
    dishDescription:
      "Filé de peixe grelhado com arroz de mariscos e farofa de castanha.",
    dishImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.5273042, lng: -41.9403437 },
    i18n: {
      en: {
        description: "Homestyle cooking with fresh, flavorful ingredients.",
        dishName: "Sabor da Maré",
        dishDescription:
          "Grilled fish fillet with seafood rice and cashew farofa.",
      },
      es: {
        description: "Cocina casera con ingredientes frescos y sabrosos.",
        dishName: "Sabor da Maré",
        dishDescription:
          "Filete de pescado a la parrilla con arroz de mariscos y farofa de anacardo.",
      },
      fr: {
        description: "Cuisine maison avec des ingrédients frais et savoureux.",
        dishName: "Sabor da Maré",
        dishDescription:
          "Filet de poisson grillé avec riz aux fruits de mer et farofa de noix de cajou.",
      },
    },
  },
  {
    id: "paiol",
    name: "PAIOL Hamburgueria / Restaurante",
    description: "Hambúrgueres artesanais e pratos do mar no mesmo cardápio.",
    address: "Av. Principal, 200",
    dishName: "Jangada",
    dishDescription:
      "Sanduíche com polvo grelhado, aioli de limão siciliano e rúcula no pão artesanal.",
    dishImage:
      "https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.51582263722419, lng: -41.93056381657957 },
    i18n: {
      en: {
        description: "Artisanal burgers and seafood dishes on the same menu.",
        dishName: "Jangada",
        dishDescription:
          "Grilled octopus sandwich with lemon aioli and arugula on artisan bread.",
      },
      es: {
        description:
          "Hamburguesas artesanales y platos de mar en el mismo menú.",
        dishName: "Jangada",
        dishDescription:
          "Sándwich de pulpo a la parrilla con alioli de limón y rúcula en pan artesanal.",
      },
      fr: {
        description: "Burgers artisanaux et plats de la mer dans le même menu.",
        dishName: "Jangada",
        dishDescription:
          "Sandwich de poulpe grillé avec aïoli au citron et roquette sur pain artisanal.",
      },
    },
  },
  {
    id: "fornella",
    name: "FORNELLA PIZZARIA",
    description: "Pizza napolitana com ingredientes regionais.",
    address: "R. Itália, 10",
    dishName: "Pizza Encanto do Litoral",
    dishDescription:
      "Pizza com salmão e molho de maracujá, cream cheese e mussarela.",
    dishImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.494232227910985, lng: -41.92426667610864 },
    i18n: {
      en: {
        description: "Neapolitan pizza with regional ingredients.",
        dishName: "Coastal Enchantment Pizza",
        dishDescription:
          "Pizza with salmon and passion fruit sauce, cream cheese and mozzarella.",
      },
      es: {
        description: "Pizza napolitana con ingredientes regionales.",
        dishName: "Pizza Encanto del Litoral",
        dishDescription:
          "Pizza con salmón y salsa de maracuyá, queso crema y mozzarella.",
      },
      fr: {
        description: "Pizza napolitaine avec des ingrédients régionaux.",
        dishName: "Pizza Enchantement Côtier",
        dishDescription:
          "Pizza au saumon et sauce au fruit de la passion, cream cheese et mozzarella.",
      },
    },
  },
  {
    id: "melanina",
    name: "MELANINA (Café / Sobremesa)",
    description: "Cafeteria e doces com identidade nordestina.",
    address: "R. das Artes, 22",
    dishName: "Lenda do Abaeté",
    dishDescription:
      "Sobremesa de creme caramelo com leite de coco e caramelo de café.",
    dishImage:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.515611092827733, lng: -41.92601883192523 },
    i18n: {
      en: {
        description: "Coffee shop and desserts with northeastern identity.",
        dishName: "Lenda do Abaeté",
        dishDescription:
          "Caramel cream dessert with coconut milk and coffee caramel.",
      },
      es: {
        description: "Cafetería y postres con identidad nordestina.",
        dishName: "Lenda do Abaeté",
        dishDescription:
          "Postre de crema de caramelo con leche de coco y caramelo de café.",
      },
      fr: {
        description: "Café et desserts avec une identité nord-estienne.",
        dishName: "Lenda do Abaeté",
        dishDescription:
          "Dessert crème caramel avec lait de coco et caramel au café.",
      },
    },
  },
  {
    id: "rico",
    name: "RICO",
    description: "Cozinha contemporânea com pegada litorânea.",
    address: "Av. Beira-Mar, 300",
    dishName: "Risoto das Ondas de Caymmi",
    dishDescription: "Risoto criativo com frutos do mar e toque litorâneo.",
    dishImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.526143574027184, lng: -41.92281483192503 },
    i18n: {
      en: {
        description: "Contemporary cuisine with a coastal touch.",
        dishName: "Caymmi's Wave Risotto",
        dishDescription: "Creative risotto with seafood and coastal flavors.",
      },
      es: {
        description: "Cocina contemporánea con toque costero.",
        dishName: "Risotto de las Olas de Caymmi",
        dishDescription: "Risotto creativo con mariscos y sabor litoral.",
      },
      fr: {
        description: "Cuisine contemporaine avec une touche côtière.",
        dishName: "Risotto des Vagues de Caymmi",
        dishDescription:
          "Risotto créatif aux fruits de mer et saveurs côtières.",
      },
    },
  },
  {
    id: "vila-portuguesa",
    name: "VILA PORTUGUESA",
    description: "Sabores portugueses com influência do litoral.",
    address: "R. do Fado, 7",
    dishName: "Acalanto",
    dishDescription:
      "Gambas à Brás com camarões, batata palha artesanal e ervas frescas.",
    dishImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.510775083583702, lng: -41.92774151582527 },
    i18n: {
      en: {
        description: "Portuguese flavors with coastal influence.",
        dishName: "Acalanto",
        dishDescription:
          "Gambas à Brás with prawns, artisanal shoestring potatoes and fresh herbs.",
      },
      es: {
        description: "Sabores portugueses con influencia costera.",
        dishName: "Acalanto",
        dishDescription:
          "Gambas à Brás con camarones, patata paja artesanal y hierbas frescas.",
      },
      fr: {
        description: "Saveurs portugaises avec influence côtière.",
        dishName: "Acalanto",
        dishDescription:
          "Gambas à Brás avec crevettes, pommes paille artisanales et herbes fraîches.",
      },
    },
  },
  {
    id: "picanha-da-praia",
    name: "PICANHA DA PRAIA",
    description: "Churrascaria com opções de frutos do mar.",
    address: "Av. das Ondas, 88",
    dishName: "Encanto da Baía",
    dishDescription: "Camarões ao molho curry com abacaxi e legumes braseados.",
    dishImage:
      "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1200&auto=format&fit=crop&crop=faces&sat=-100&exp=15",
    coords: { lat: -22.52587965592853, lng: -41.922497416579205 },
    i18n: {
      en: {
        description: "Steakhouse with seafood options.",
        dishName: "Bay Enchantment",
        dishDescription:
          "Shrimps in curry sauce with pineapple and roasted vegetables.",
      },
      es: {
        description: "Churrasquería con opciones de mariscos.",
        dishName: "Encanto de la Bahía",
        dishDescription:
          "Camarones con salsa curry con piña y verduras asadas.",
      },
      fr: {
        description: "Churrascaria avec des options de fruits de mer.",
        dishName: "Enchantement de la Baie",
        dishDescription:
          "Crevettes en sauce curry avec ananas et légumes rôtis.",
      },
    },
  },
  {
    id: "paladar-nordestino",
    name: "PALADAR NORDESTINO",
    description: "Comida nordestina com toques contemporâneos.",
    address: "R. do Coco, 9",
    dishName: "Barca do Bosque",
    dishDescription:
      "Filé de linguado com camarões e molho de romã, acompanhado de legumes.",
    dishImage:
      "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.515313580581342, lng: -41.926299816579515 },
    i18n: {
      en: {
        description: "Northeastern cuisine with contemporary touches.",
        dishName: "Forest Boat",
        dishDescription:
          "Sole fillet with shrimp and pomegranate sauce, served with vegetables.",
      },
      es: {
        description: "Comida nordestina con toques contemporáneos.",
        dishName: "Barca del Bosque",
        dishDescription:
          "Filete de lenguado con camarones y salsa de granada, acompañado de verduras.",
      },
      fr: {
        description:
          "Cuisine nord-est brésilienne avec des touches contemporaines.",
        dishName: "Barque de la Forêt",
        dishDescription:
          "Filet de sole avec crevettes et sauce grenade, accompagné de légumes.",
      },
    },
  },

  {
    id: "poke-da-casa",
    name: "POKE DA CASA",
    description: "Poke bowls frescos com peixes e ingredientes locais.",
    address: "R. das Algas, 3",
    dishName: "Caymmi Sunset",
    dishDescription: "Poke de camarões marinados com abacate e cebola roxa.",
    dishImage:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1200&auto=format&fit=crop",
    coords: { lat: -22.525518073130037, lng: -41.95650005890625 },
    i18n: {
      en: {
        description: "Fresh poke bowls with fish and local ingredients.",
        dishName: "Caymmi Sunset",
        dishDescription: "Marinated shrimp poke with avocado and red onion.",
      },
      es: {
        description: "Poke bowls frescos con pescado e ingredientes locales.",
        dishName: "Caymmi Sunset",
        dishDescription:
          "Poke de camarones marinados con aguacate y cebolla roja.",
      },
      fr: {
        description: "Poke bowls frais avec poisson et ingrédients locaux.",
        dishName: "Caymmi Sunset",
        dishDescription:
          "Poke de crevettes marinées avec avocat et oignon rouge.",
      },
    },
  },
  {
    id: "sirisao",
    name: "TrikTrik",
    description: "Mariscos e pratos do litoral com personalidade.",
    address: "Praça do Mar, 1",
    dishName: "Encanto do Mar",
    dishDescription: "Prato com polvo e frutos do mar inspirado no litoral.",
    dishImage:
      "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1200&auto=format&fit=crop&crop=faces&sat=-100&exp=15",
    coords: { lat: -22.519744600531606, lng: -41.91951480560751 },
    i18n: {
      en: {
        description: "Seafood and coastal dishes with personality.",
        dishName: "Sea Charm",
        dishDescription: "Dish with octopus and seafood inspired by the coast.",
      },
      es: {
        description: "Mariscos y platos costeros con personalidad.",
        dishName: "Encanto del Mar",
        dishDescription: "Plato con pulpo y mariscos inspirado en la costa.",
      },
      fr: {
        description: "Fruits de mer et plats côtiers plein de personnalité.",
        dishName: "Charme de la Mer",
        dishDescription:
          "Plat avec poulpe et fruits de mer inspiré par le littoral.",
      },
    },
  },
  {
    id: "alpha-teste",
    name: "alpha teste",
    description: "Restaurante de teste para desenvolvimento.",
    address:
      "rua cachoeira de macacu, 520 casa, jardim marileia, rio das ostras-rj",
    dishName: "teste",
    dishDescription: "Prato de teste com ingredientes de teste.",
    dishImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop&crop=faces&sat=-100&exp=15",
    coords: { lat: -22.50387165163839, lng: -41.93110228949311 },
    i18n: {
      en: {
        description: "Test restaurant for development.",
        dishName: "test",
        dishDescription: "Test dish with test ingredients.",
      },
      es: {
        description: "Restaurante de prueba para desarrollo.",
        dishName: "prueba",
        dishDescription: "Plato de prueba con ingredientes de prueba.",
      },
      fr: {
        description: "Restaurant de test pour le développement.",
        dishName: "test",
        dishDescription: "Plat de test avec ingrédients de test.",
      },
    },
  },
];

export function getRestaurantById(id: string) {
  return RESTAURANTS.find((r) => r.id === id) || null;
}
