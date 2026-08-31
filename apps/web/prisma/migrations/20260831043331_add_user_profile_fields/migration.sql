-- CreateEnum
CREATE TYPE "LanguagePreference" AS ENUM ('EN', 'BN');

-- CreateEnum
CREATE TYPE "ThemePreference" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "languagePreference" "LanguagePreference" NOT NULL DEFAULT 'BN',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "themePreference" "ThemePreference" NOT NULL DEFAULT 'SYSTEM';
