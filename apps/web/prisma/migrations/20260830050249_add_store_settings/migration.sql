-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL,
    "storeName" TEXT NOT NULL DEFAULT 'EmsiFoods',
    "tagline" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "favicon" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "whatsappNumber" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "defaultLanguage" TEXT NOT NULL DEFAULT 'bn',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);
