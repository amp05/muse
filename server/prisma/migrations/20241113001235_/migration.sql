-- CreateTable
CREATE TABLE "Vibe" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vibe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostVibes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vibe_word_key" ON "Vibe"("word");

-- CreateIndex
CREATE UNIQUE INDEX "_PostVibes_AB_unique" ON "_PostVibes"("A", "B");

-- CreateIndex
CREATE INDEX "_PostVibes_B_index" ON "_PostVibes"("B");

-- AddForeignKey
ALTER TABLE "_PostVibes" ADD CONSTRAINT "_PostVibes_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostVibes" ADD CONSTRAINT "_PostVibes_B_fkey" FOREIGN KEY ("B") REFERENCES "Vibe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
