export interface Plato {
  precio: number;
  ingredientes: string;
  descripcion: string;
  disponible: boolean;
  tipo_oferta: string;
  oferta_activa: boolean;
}

export interface CategoriaMenu {
  categoria: string;
  platos: Record<string, Plato>;
}

export interface MenuRestaurante {
  picadas: CategoriaMenu;
  hot_dogs: CategoriaMenu;
  pizzas: CategoriaMenu;
  bebidas: CategoriaMenu;
  extras: CategoriaMenu;
}

export const menu_restaurante: MenuRestaurante = {
  picadas: {
    categoria: "Picadas",
    platos: {
      picada_mini: {
        precio: 15000,
        ingredientes: "Carne de res, pollo, chorizo, papa criolla, arepa",
        descripcion:
          "Porción personal ideal para calmar el antojo, acompañada de suero costeño.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
      picada_media: {
        precio: 28000,
        ingredientes:
          "Carne de res, cerdo, pollo, morcilla, chorizo, papa criolla, patacón, arepa",
        descripcion:
          "Perfecta para compartir entre 2 personas, incluye variedad de carnes y acompañantes.",
        disponible: true,
        tipo_oferta: "descuento 10%",
        oferta_activa: true,
      },
      picada_familiar: {
        precio: 45000,
        ingredientes:
          "Carne de res, cerdo, pollo, chicharrón, morcilla, chorizo, papa criolla, yuca frita, patacón, arepa",
        descripcion:
          "La mejor opción para la familia (4 a 5 personas). Abundante y con todos los sabores de la casa.",
        disponible: true,
        tipo_oferta: "bebida gratis",
        oferta_activa: true,
      },
    },
  },
  hot_dogs: {
    categoria: "Hot Dogs",
    platos: {
      perro_sencillo: {
        precio: 8000,
        ingredientes:
          "Pan artesanal, salchicha tradicional, queso costeño rallado, ripio de papa, salsas de la casa",
        descripcion: "El clásico perro caliente, rápido y delicioso.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
      perro_especial: {
        precio: 14000,
        ingredientes:
          "Pan artesanal, salchicha suiza, tocineta ahumada, queso mozzarella fundido, ripio de papa, salsa de ajo, piña",
        descripcion:
          "Una mezcla de sabores dulces y salados con ingredientes premium.",
        disponible: true,
        tipo_oferta: "2x1",
        oferta_activa: true,
      },
      perro_salvaje: {
        precio: 19000,
        ingredientes:
          "Pan artesanal, doble salchicha americana, carne desmechada, pollo desmechado, tocineta, extra queso, ripio, salsas",
        descripcion:
          "Para los más hambrientos. Una montaña de sabor en un solo perro caliente.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
    },
  },
  pizzas: {
    categoria: "Pizzas",
    platos: {
      pizza_personal: {
        precio: 12000,
        ingredientes:
          "Masa delgada, pasta de tomate, queso mozzarella, jamón, piña calada",
        descripcion: "Pizza hawaiana de 4 porciones, ideal para una persona.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
      pizza_mediana: {
        precio: 24000,
        ingredientes:
          "Masa delgada, pasta de tomate, queso mozzarella, pepperoni, salami, cabano",
        descripcion: "Pizza carnes de 8 porciones, perfecta para parejas.",
        disponible: true,
        tipo_oferta: "borde de queso gratis",
        oferta_activa: true,
      },
      pizza_familiar: {
        precio: 35000,
        ingredientes:
          "Masa delgada, pasta de tomate, doble queso mozzarella, pollo, champiñones, pimentón, cebolla",
        descripcion:
          "Pizza de pollo y champiñones de 12 porciones. Para compartir con todos.",
        disponible: true,
        tipo_oferta: "descuento 15%",
        oferta_activa: true,
      },
    },
  },
  bebidas: {
    categoria: "Bebidas",
    platos: {
      gaseosa_personal: {
        precio: 3500,
        ingredientes:
          "Agua carbonatada, azúcar, saborizantes (Coca-Cola, Postobón)",
        descripcion: "Gaseosa fría en presentación de 400ml.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
      jugo_natural: {
        precio: 6000,
        ingredientes:
          "Fruta fresca (Lulo, Mora, Mango, Maracuyá), agua o leche, azúcar",
        descripcion: "Jugos 100% naturales licuados al instante.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
      cerveza_nacional: {
        precio: 5000,
        ingredientes: "Agua, malta de cebada, lúpulo",
        descripcion: "Cerveza nacional bien fría (Águila, Club Colombia).",
        disponible: true,
        tipo_oferta: "pague 5 lleve 6",
        oferta_activa: true,
      },
    },
  },
  extras: {
    categoria: "Extras y Adiciones",
    platos: {
      extra_queso: {
        precio: 3000,
        ingredientes: "Queso mozzarella o queso costeño rallado",
        descripcion:
          "Porción adicional de queso aplicable a pizzas, hot dogs o picadas.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
      extra_proteina: {
        precio: 5000,
        ingredientes: "Pollo desmechado, carne desmechada, chorizo o tocineta",
        descripcion:
          "Agrega más de tu carne favorita a cualquier plato del menú.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
      extra_acompanante: {
        precio: 4000,
        ingredientes: "Papa criolla, patacón, ripio de papa o masa extra",
        descripcion:
          "Porción extra de tus acompañantes favoritos para que no te quedes con hambre.",
        disponible: true,
        tipo_oferta: "ninguna",
        oferta_activa: false,
      },
    },
  },
};
