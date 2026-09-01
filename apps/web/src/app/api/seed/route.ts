import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const categories = [
  {
    name: "Rice & Grains",
    slug: "rice-grains",
    description:
      "Premium rice, aromatic rice, flour, lentils and everyday kitchen essentials.",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Spices & Masala",
    slug: "spices-masala",
    description:
      "Authentic spices and aromatic masala blends for delicious Bangladeshi cooking.",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Snacks & Treats",
    slug: "snacks-treats",
    description:
      "Crunchy, spicy and delicious snacks perfect for every moment.",
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Pickles & Chutneys",
    slug: "pickles-chutneys",
    description:
      "Traditional Bangladeshi achar, chutneys and flavorful condiments.",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Beverages",
    slug: "beverages",
    description:
      "Refreshing juices, drinks, tea and other beverages for every occasion.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bakery & Sweets",
    slug: "bakery-sweets",
    description:
      "Fresh bakery items, biscuits, cakes and delicious sweet treats.",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Ready to Cook",
    slug: "ready-to-cook",
    description:
      "Convenient meal solutions and cooking essentials for busy lifestyles.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Frozen Foods",
    slug: "frozen-foods",
    description:
      "Quality frozen snacks, vegetables and ready-to-prepare foods.",
    image:
      "https://images.unsplash.com/photo-1615861208631-aed9a56e7f1c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    description:
      "Fresh dairy products, milk, butter, cheese and farm-fresh eggs.",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Organic & Healthy",
    slug: "organic-healthy",
    description:
      "Natural, nutritious and healthy food choices for a better lifestyle.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  },
];

const products = [
  {
    name: "Premium Miniket Rice",
    slug: "premium-miniket-rice",
    description:
      "Premium quality aromatic Miniket rice, perfect for everyday meals.",
    price: 950,
    stock: 50,
    categorySlug: "rice-grains",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Nazia Basmati Rice",
    slug: "nazia-basmati-rice",
    description:
      "Long-grain aromatic basmati rice for biryani and special occasions.",
    price: 1250,
    stock: 35,
    categorySlug: "rice-grains",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Premium Red Lentils",
    slug: "premium-red-lentils",
    description:
      "Fresh and nutritious masoor dal sourced for everyday healthy meals.",
    price: 180,
    stock: 80,
    categorySlug: "rice-grains",
    image:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    description:
      "Pure aromatic turmeric powder for authentic Bangladeshi cooking.",
    price: 120,
    stock: 100,
    categorySlug: "spices-masala",
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Premium Garam Masala",
    slug: "premium-garam-masala",
    description:
      "A rich blend of carefully selected aromatic spices.",
    price: 160,
    stock: 70,
    categorySlug: "spices-masala",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Spicy Chanachur",
    slug: "spicy-chanachur",
    description:
      "Crunchy and spicy traditional Bangladeshi snack mix.",
    price: 60,
    stock: 120,
    categorySlug: "snacks-treats",
    image:
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Butter Cookies",
    slug: "butter-cookies",
    description:
      "Delicious crispy butter cookies, perfect with tea.",
    price: 180,
    stock: 60,
    categorySlug: "snacks-treats",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Traditional Mango Pickle",
    slug: "traditional-mango-pickle",
    description:
      "Sweet, spicy and tangy homemade-style mango achar.",
    price: 220,
    stock: 45,
    categorySlug: "pickles-chutneys",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fresh Orange Juice",
    slug: "fresh-orange-juice",
    description:
      "Refreshing orange juice packed with natural fruity flavor.",
    price: 90,
    stock: 90,
    categorySlug: "beverages",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Premium Black Tea",
    slug: "premium-black-tea",
    description:
      "Strong and aromatic tea leaves for the perfect cup of tea.",
    price: 250,
    stock: 55,
    categorySlug: "beverages",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chocolate Cake",
    slug: "chocolate-cake",
    description:
      "Rich and moist chocolate cake for celebrations and sweet moments.",
    price: 650,
    stock: 20,
    categorySlug: "bakery-sweets",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Frozen Chicken Nuggets",
    slug: "frozen-chicken-nuggets",
    description:
      "Crispy and delicious chicken nuggets ready to cook.",
    price: 420,
    stock: 40,
    categorySlug: "frozen-foods",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fresh Farm Eggs",
    slug: "fresh-farm-eggs",
    description:
      "Fresh and nutritious farm eggs packed with protein.",
    price: 180,
    stock: 100,
    categorySlug: "dairy-eggs",
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Organic Honey",
    slug: "organic-honey",
    description:
      "Pure natural honey collected from trusted local sources.",
    price: 550,
    stock: 30,
    categorySlug: "organic-healthy",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
  },
];

export async function POST() {
  try {
    // Seed categories first
    const createdCategories = await Promise.all(
      categories.map((category) =>
        prisma.category.upsert({
          where: {
            slug: category.slug,
          },
          update: {
            name: category.name,
            description: category.description,
            image: category.image,
            isActive: true,
          },
          create: {
            ...category,
            isActive: true,
          },
        })
      )
    );

    // Create a slug -> category ID map
    const categoryMap = new Map(
      createdCategories.map((category) => [
        category.slug,
        category.id,
      ])
    );

    // Seed products
    const createdProducts = await Promise.all(
      products.map((product) => {
        const categoryId = categoryMap.get(
          product.categorySlug
        );

        if (!categoryId) {
          throw new Error(
            `Category not found: ${product.categorySlug}`
          );
        }

        return prisma.product.upsert({
          where: {
            slug: product.slug,
          },
          update: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
            categoryId,
            isActive: true,
          },
          create: {
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
            categoryId,
            isActive: true,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        categories: createdCategories.length,
        products: createdProducts.length,
      },
    });
  } catch (error) {
    console.error("Database seed error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to seed database",
      },
      {
        status: 500,
      }
    );
  }
}