-- CreateEnum
CREATE TYPE "Handedness" AS ENUM ('right', 'left');

-- CreateEnum
CREATE TYPE "ChordDifficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "handedness" "Handedness" NOT NULL DEFAULT 'right',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "difficulty" "ChordDifficulty" NOT NULL,
    "frets" INTEGER[],
    "fingers" INTEGER[],
    "isBarre" BOOLEAN NOT NULL DEFAULT false,
    "barreFret" INTEGER,
    "barreStart" INTEGER,
    "barreEnd" INTEGER,

    CONSTRAINT "Chord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChordMastery" (
    "userId" TEXT NOT NULL,
    "chordId" TEXT NOT NULL,
    "correctAttempts" INTEGER NOT NULL DEFAULT 0,
    "incorrectAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChordMastery_pkey" PRIMARY KEY ("userId","chordId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ChordMastery" ADD CONSTRAINT "ChordMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChordMastery" ADD CONSTRAINT "ChordMastery_chordId_fkey" FOREIGN KEY ("chordId") REFERENCES "Chord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
