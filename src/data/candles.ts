import { CandleProduct, CandleReview, Collaborator } from "../types";

export const CANDLE_COLLECTION: CandleProduct[] = [
  {
    id: "vela-lavanda-citricos",
    name: "Nº 01 • Serenidad Botánica",
    subtitle: "Lavanda Silvestre, Naranja Deshidratada & Canela",
    tagline: "La combinación emblemática con mecha crujiente y vasija de cerámica arena mate.",
    price: 38,
    weightGrams: 320,
    burnHours: 65,
    image: "/src/assets/images/luxury_soy_candle_hero_1787194938835.jpg",
    vesselColor: "bg-[#e8dfd5] text-[#4a3f35] border-[#d8ccbe]",
    vesselName: "Cerámica Arena Mate",
    category: "Relajación",
    olfactoryPyramid: {
      salida: "Rodajas de naranja sanguina deshidratada, bergamota fresca y cardamomo salvaje",
      corazon: "Tallos de lavanda de Provenza, canela en rama de Ceilán y azahar",
      fondo: "Cera de soja cremosa virgen, cedro ahumado y vainilla suave",
    },
    ingredients: [
      "100% Cera de soja virgen de cultivo sostenible",
      "Aceites esenciales puros de grado terapéutico",
      "Mecha de madera de cerezo certificada FSC",
      "Botánicos deshidratados a mano al sol",
    ],
    botanicals: ["Lavanda Francesa", "Naranja Seca", "Canela Ceilán", "Flores de Azahar"],
    description:
      "Nuestra creación insignia. Vertida manualmente en pequeñas tandas sobre vasijas de cerámica torneadas a mano con acabado mate sedoso. Al encender la mecha de madera natural, escucharás el suave crepitar de un fuego de leña mientras se liberan los acordes relajantes de la lavanda y el dulzor especiado de la naranja y la canela.",
    artisanNote:
      "Tardamos 72 horas de curado en frío para garantizar una difusión olfativa limpia, lenta y envolvente en espacios de hasta 45 m².",
    rating: 4.95,
    reviewsCount: 142,
    inStock: true,
    featured: true,
  },
  {
    id: "vela-citricos-canela",
    name: "Nº 02 • Cosecha Especiada",
    subtitle: "Cítricos de Sangre, Canela en Rama & Ámbar Dorado",
    tagline: "Calidez reconfortante para tardes de lectura y charlas al atardecer.",
    price: 36,
    weightGrams: 300,
    burnHours: 60,
    image: "/src/assets/images/citrus_cinnamon_candle_1787194966931.jpg",
    vesselColor: "bg-[#d98b68]/20 text-[#8c4626] border-[#d98b68]/40",
    vesselName: "Terracota Cálida Mate",
    category: "Cálido & Especiado",
    olfactoryPyramid: {
      salida: "Naranja roja amarga, mandarina madura y piel de limón confitada",
      corazon: "Canela corteza pura, clavo de olor y anís estrellado molido",
      fondo: "Resina de benjuí, ámbar mineral y madera de roble tostado",
    },
    ingredients: [
      "Cera de soja biodegradable 100% vegetal",
      "Esencia de corteza de canela y prensado en frío de cítricos",
      "Mecha de madera con crepitar acústico natural",
    ],
    botanicals: ["Rodaja de Naranja Sanguina", "Canela en Rama", "Clavo Entero"],
    description:
      "Evoca los hogares nórdicos en pleno invierno. La vasija en terracota cruda retiene el calor suavemente, proyectando un resplandor cobrizo y un aroma festivo, hogareño y profundamente acogedor.",
    artisanNote:
      "Recomendada para encender al atardecer en la sala principal o durante una sobremesa invernal.",
    rating: 4.9,
    reviewsCount: 98,
    inStock: true,
    featured: true,
  },
  {
    id: "vela-lavanda-botanica",
    name: "Nº 03 • Santuario de Lavanda",
    subtitle: "Flores de Lavanda Silvestre & Vainilla Bourbon",
    tagline: "El ritual nocturno definitivo para inducir un sueño reparador y calma mental.",
    price: 36,
    weightGrams: 300,
    burnHours: 60,
    image: "/src/assets/images/botanical_lavender_candle_1787194952901.jpg",
    vesselColor: "bg-[#dfd8e3]/40 text-[#54465b] border-[#c9bdcf]",
    vesselName: "Cerámica Malva Arcilla",
    category: "Relajación",
    olfactoryPyramid: {
      salida: "Lavandina silvestre, eucalipto dulce y brisa de montaña",
      corazon: "Lavanda angustifolia pura, manzanilla romana y pétalos de iris",
      fondo: "Vainilla Bourbon infusionada, haba tonka y cera vegetal pura",
    },
    ingredients: [
      "Cera de soja sin parafina ni derivados del petróleo",
      "Extracto botánico de lavanda destilada por vapor",
      "Mecha plana de madera de bosque sostenible",
    ],
    botanicals: ["Espigas de Lavanda Orgánica", "Flores de Manzanilla"],
    description:
      "Un bálsamo para el sistema nervioso. La lavanda francesa se suaviza con la dulzura aterciopelada de la vainilla, creando una atmósfera de spa silencioso en tu dormitorio.",
    artisanNote:
      "Enciéndela 45 minutos antes de dormir y apágala suavemente tapando la vasija.",
    rating: 4.98,
    reviewsCount: 185,
    inStock: true,
  },
  {
    id: "vela-sandalo-ambar",
    name: "Nº 04 • Bosque Sagrado",
    subtitle: "Sándalo de Mysore, Resina de Ámbar & Cedro",
    tagline: "Profundidad terrosa y meditación contemplativa con notas amaderadas nobles.",
    price: 42,
    weightGrams: 350,
    burnHours: 70,
    image: "/src/assets/images/sandalwood_amber_candle_1787194982953.jpg",
    vesselColor: "bg-[#c8bcab]/30 text-[#433b30] border-[#b0a08e]",
    vesselName: "Cerámica Piedra Grisácea",
    category: "Madera & Místico",
    olfactoryPyramid: {
      salida: "Incienso blanco, hojas de ciprés y pimienta rosa",
      corazon: "Madera de sándalo pulida, cedro del Atlas y pachulí suave",
      fondo: "Ámbar fósil, vetiver terroso y almizcle botánico limpio",
    },
    ingredients: [
      "Cera de soja premium no blanqueada",
      "Maderas preciosas y resinas botánicas sostenibles",
      "Mecha ancha de madera dura para mayor resonancia acústica",
    ],
    botanicals: ["Virutas de Madera de Cedro", "Resina de Mirra"],
    description:
      "Una fragancia profunda, meditativa y atemporal. Inspirada en los antiguos templos de montaña y bosques templados bajo la bruma matutina.",
    artisanNote:
      "Ideal para sesiones de yoga, lectura profunda o momentos de silencio creativo.",
    rating: 4.92,
    reviewsCount: 114,
    inStock: true,
  },
];

export const CANDLE_REVIEWS: CandleReview[] = [
  {
    id: "rev-1",
    author: "Elena Montero",
    rating: 5,
    date: "Hace 3 días",
    comment: "La fotografía del producto es hermosa, pero tenerla en casa con la mecha de madera crepitando y la naranja deshidratada con lavanda es una experiencia mágica. Huele a calma absoluta.",
    location: "Madrid",
    candleName: "Nº 01 • Serenidad Botánica",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Carlos De la Serna",
    rating: 5,
    date: "Hace 1 semana",
    comment: "La calidad de la cera de soja es impecable: quema pareja sin hacer túnel y la vasija de cerámica se siente como una pieza de galería de arte. Ya pedí dos más para regalo.",
    location: "Barcelona",
    candleName: "Nº 02 • Cosecha Especiada",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Valeria Ríos",
    rating: 5,
    date: "Hace 2 semanas",
    comment: "El aroma es natural, sin dolor de cabeza como las velas de parafina baratas. Se nota el trabajo artesanal y los aceites botánicos puros.",
    location: "Sevilla",
    candleName: "Nº 03 • Santuario de Lavanda",
    verified: true,
  },
];

export const SUSTAINABILITY_PILLARS = [
  {
    title: "100% Cera de Soja Pura",
    description: "Cera vegetal biodegradable, no tóxica, libre de pesticidas y parafina derivada del petróleo. Quema hasta un 50% más lento.",
    icon: "Leaf",
  },
  {
    title: "Mechas de Madera FSC",
    description: "Madera procedente de bosques gestionados éticamente. Emite un relajante y auténtico sonido de crepitar sin hollín oscuro.",
    icon: "Flame",
  },
  {
    title: "Vasijas Cerámicas Reutilizables",
    description: "Torneadas a mano con acabados minerales mate. Diseñadas para una segunda vida como macetero, portalápices o taza decorativa.",
    icon: "Sparkles",
  },
  {
    title: "Botánicos Silvestres & Puro Aceite",
    description: "Lavanda real, naranja deshidratada al sol y ramas de canela de origen ético, infusionadas en frío con aceites botánicos puros.",
    icon: "Flower2",
  },
];

export const COLLABORATORS: Collaborator[] = [
  {
    id: "valentina-morales",
    name: "Valentina Morales",
    age: 19,
    location: "Medellín, Colombia",
    discipline: "Artes Plásticas & Pigmentos Botánicos",
    bio: "Estudiante de artes plásticas apasionada por los degradados del cielo andino y la botánica local.",
    artistInspiration:
      "Inspirado en los colores cálidos de un atardecer en las montañas y la sensación de paz y quietud que deja caer el sol.",
    technique:
      "Acuarela líquida con pigmentos naturales de cúrcuma y arcilla sobre papel de algodón prensado.",
    designMeaning:
      "Representa el cierre de ciclos con gratitud y la calidez del hogar cuando la luz natural da paso a la llama íntima de una vela.",
    aromaDesignRelation:
      "Los tonos ámbar, terracota y dorado del diseño dialogan en perfecta armonía con las notas especiadas de canela, naranja dulce y vainilla cremosa.",
    quote:
      "El arte y el fuego comparten la misma magia: ambos transforman la materia en pura emoción.",
    image: "/src/assets/images/artist_valentina_morales_1787870220735.jpg",
    associatedCandleId: "vela-citricos-canela",
    associatedCandleName: "Nº 02 • Cosecha Especiada",
    paletteColors: ["#D98B68", "#C87D55", "#E3B873", "#7A5034"],
  },
  {
    id: "mateo-valencia",
    name: "Mateo Valencia",
    age: 24,
    location: "Oaxaca, México",
    discipline: "Cerámica Mineral & Grabado Botánico",
    bio: "Ceramista e ilustrador dedicado a rescatar arcillas ancestrales y texturas minerales de la sierra.",
    artistInspiration:
      "Inspirado en la niebla matutina sobre los bosques de encino y la serenidad de los templos silenciosos de montaña.",
    technique:
      "Modelado en barro negro y engobes minerales con trazos de grafito botánico y savia vegetal.",
    designMeaning:
      "Simboliza el arraigo profundo a la tierra y el refugio personal que construimos al encender un fuego sereno.",
    aromaDesignRelation:
      "Las texturas sobrias y terrosas de la vasija realzan los acordes de sándalo pulido, resina de ámbar fósil y cedro noble.",
    quote:
      "Modelar con las manos y confiar en el fuego es la forma más honesta de dialogar con el tiempo.",
    image: "/src/assets/images/artist_mateo_valencia_1787870232366.jpg",
    associatedCandleId: "vela-sandalo-ambar",
    associatedCandleName: "Nº 04 • Bosque Sagrado",
    paletteColors: ["#8C7A6B", "#4A4541", "#B0A08E", "#D5C7B8"],
  },
  {
    id: "camila-rojas",
    name: "Camila Rojas",
    age: 22,
    location: "Cusco, Perú",
    discipline: "Grabado Botánico & Tintes Naturales",
    bio: "Diseñadora botánica y grabadora textil enfocada en la preservación de hierbas medicinales andinas.",
    artistInspiration:
      "Inspirada en los valles de lavanda silvestre y la luz violeta del crepúsculo cayendo sobre los campos abiertos.",
    technique:
      "Linograbado prensado a mano con tintes orgánicos de lavanda y nogal sobre papel de fibras recicladas.",
    designMeaning:
      "Expresa el descanso consciente, la desconexión del ruido cotidiano y la sanación que brinda el silencio nocturno.",
    aromaDesignRelation:
      "Los matices malva y violeta suave son el espejo visual de la pureza de la lavandina francesa y la calidez de la vainilla bourbon.",
    quote:
      "Cada trazo botánico es un agradecimiento a las plantas que nos devuelven la calma en silencio.",
    image: "/src/assets/images/artist_camila_rojas_1787870243513.jpg",
    associatedCandleId: "vela-lavanda-botanica",
    associatedCandleName: "Nº 03 • Santuario de Lavanda",
    paletteColors: ["#9B88A8", "#C9BDCF", "#608058", "#DFD8E3"],
  },
  {
    id: "santiago-herrera",
    name: "Santiago Herrera",
    age: 26,
    location: "Valdivia, Chile",
    discipline: "Ebanistería Sostenible & Xilografía",
    bio: "Ebanista y grabador en maderas nativas caídas, dedicado al diseño biofílico y la calidez acústica del hogar.",
    artistInspiration:
      "Inspirado en la lluvia templada sobre los bosques del sur y el olor a leña crujiente en las mañanas de invierno.",
    technique:
      "Xilografía sobre madera de cerezo recuperada con entintado al carbón vegetal y cera de abeja pulida.",
    designMeaning:
      "Celebra la reunión comunitaria alrededor de la llama viva y el respeto hacia la longevidad de los árboles nativos.",
    aromaDesignRelation:
      "La calidez orgánica de las vetas de madera complementa el sonido crepitante de la mecha y los toques de naranja seca con canela.",
    quote:
      "La madera caída no termina su ciclo: revive como luz, sonido y compañía en cada hogar.",
    image: "/src/assets/images/artist_santiago_herrera_1787870255100.jpg",
    associatedCandleId: "vela-lavanda-citricos",
    associatedCandleName: "Nº 01 • Serenidad Botánica",
    paletteColors: ["#8C5A36", "#D88C51", "#E8DFD5", "#4A3F35"],
  },
];
