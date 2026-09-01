import { prisma } from "../../src/lib/prisma";

type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  image: string;
  products: Array<{
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    image: string;
  }>;
};

const categories: CategorySeed[] = [
  {
    name: "Fresh Fruits",
    slug: "fresh-fruits",
    description:
      "Fresh, healthy and carefully selected seasonal fruits delivered to your door.",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Premium Red Apples",
        slug: "premium-red-apples",
        description:
          "Crisp, sweet and juicy premium red apples. Perfect for healthy snacks.",
        price: 280,
        stock: 50,
        image:
          "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Fresh Bananas",
        slug: "fresh-bananas",
        description:
          "Naturally sweet and energy-rich fresh bananas.",
        price: 90,
        stock: 80,
        image:
          "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Sweet Oranges",
        slug: "sweet-oranges",
        description:
          "Fresh juicy oranges packed with natural vitamin C.",
        price: 180,
        stock: 60,
        image:
          "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    name: "Fresh Vegetables",
    slug: "fresh-vegetables",
    description:
      "Farm-fresh vegetables selected for quality, taste and nutrition.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Fresh Tomatoes",
        slug: "fresh-tomatoes",
        description:
          "Fresh red tomatoes, perfect for salads, curries and everyday cooking.",
        price: 80,
        stock: 100,
        image:
          "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Organic Carrots",
        slug: "organic-carrots",
        description:
          "Fresh crunchy carrots packed with natural nutrients.",
        price: 120,
        stock: 70,
        image:
          "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Fresh Broccoli",
        slug: "fresh-broccoli",
        description:
          "Nutritious farm-fresh broccoli for healthy meals.",
        price: 150,
        stock: 40,
        image:
          "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    name: "Meat & Poultry",
    slug: "meat-poultry",
    description:
      "Fresh and hygienically handled meat and poultry products.",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Fresh Chicken",
        slug: "fresh-chicken",
        description:
          "Freshly prepared chicken, ideal for everyday family meals.",
        price: 220,
        stock: 45,
        image:
          "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Premium Beef",
        slug: "premium-beef",
        description:
          "High-quality fresh beef carefully prepared and packed.",
        price: 850,
        stock: 30,
        image:
          "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Chicken Breast",
        slug: "chicken-breast",
        description:
          "Lean and fresh chicken breast for healthy recipes.",
        price: 380,
        stock: 35,
        image:
          "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    name: "Fish & Seafood",
    slug: "fish-seafood",
    description:
      "Fresh fish and seafood sourced for quality and taste.",
    image:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Fresh Hilsa Fish",
        slug: "fresh-hilsa-fish",
        description:
          "Premium Hilsa fish, one of Bangladesh's most loved traditional fish.",
        price: 1200,
        stock: 20,
        image:
          "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Fresh Rui Fish",
        slug: "fresh-rui-fish",
        description:
          "Fresh Rui fish, perfect for traditional Bengali dishes.",
        price: 420,
        stock: 35,
        image:
          "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    description:
      "Everyday dairy essentials including milk, eggs and fresh products.",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Fresh Farm Eggs",
        slug: "fresh-farm-eggs",
        description:
          "Fresh farm eggs, rich in protein and ideal for daily meals.",
        price: 150,
        stock: 100,
        image:
          "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Fresh Milk",
        slug: "fresh-milk",
        description:
          "Fresh and nutritious milk for your everyday needs.",
        price: 100,
        stock: 60,
        image:
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Natural Yogurt",
        slug: "natural-yogurt",
        description:
          "Creamy natural yogurt with a smooth and refreshing taste.",
        price: 120,
        stock: 45,
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    name: "Bakery & Snacks",
    slug: "bakery-snacks",
    description:
      "Fresh bakery items and delicious snacks for everyday enjoyment.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Fresh Sandwich Bread",
        slug: "fresh-sandwich-bread",
        description:
          "Soft and fresh sandwich bread baked for everyday meals.",
        price: 70,
        stock: 50,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Butter Croissant",
        slug: "butter-croissant",
        description:
          "Flaky and buttery croissants freshly baked for a delightful snack.",
        price: 90,
        stock: 30,
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Chocolate Cookies",
        slug: "chocolate-cookies",
        description:
          "Crunchy cookies loaded with rich chocolate flavor.",
        price: 180,
        stock: 40,
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting EmsiFoods product seed...\n");

  let categoryCount = 0;
  let productCount = 0;

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: {
        slug: categoryData.slug,
      },
      update: {
        name: categoryData.name,
        description: categoryData.description,
        image: categoryData.image,
        isActive: true,
      },
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        image: categoryData.image,
        isActive: true,
      },
    });

    categoryCount++;

    console.log(`📁 Category: ${category.name}`);

    for (const productData of categoryData.products) {
      await prisma.product.upsert({
        where: {
          slug: productData.slug,
        },
        update: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          image: productData.image,
          isActive: true,
          categoryId: category.id,
        },
        create: {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          image: productData.image,
          isActive: true,
          categoryId: category.id,
        },
      });

      productCount++;

      console.log(`   └─ 🛒 ${productData.name}`);
    }
  }

  console.log("\n=================================");
  console.log("🎉 EmsiFoods seed completed!");
  console.log(`📁 Categories processed: ${categoryCount}`);
  console.log(`🛒 Products processed: ${productCount}`);
  console.log("=================================\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Product seed failed:");
    console.error(error);

    await prisma.$disconnect();
    process.exit(1);
  });