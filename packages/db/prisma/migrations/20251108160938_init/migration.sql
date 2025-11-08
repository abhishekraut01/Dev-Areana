-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('draft', 'active', 'completed');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('pending', 'accepted', 'rejected', 'reviewing');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "notionDocId" TEXT NOT NULL,
    "difficulty" "Difficulty",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ContestStatus" NOT NULL DEFAULT 'draft',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestToChallengeMapping" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "maxPoints" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContestToChallengeMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "contestToChallengeMappingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_username_idx" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Challenges_notionDocId_key" ON "Challenges"("notionDocId");

-- CreateIndex
CREATE INDEX "Challenges_notionDocId_idx" ON "Challenges"("notionDocId");

-- CreateIndex
CREATE INDEX "Contests_startTime_idx" ON "Contests"("startTime");

-- CreateIndex
CREATE INDEX "Contests_status_idx" ON "Contests"("status");

-- CreateIndex
CREATE INDEX "ContestToChallengeMapping_contestId_idx" ON "ContestToChallengeMapping"("contestId");

-- CreateIndex
CREATE INDEX "ContestToChallengeMapping_challengeId_idx" ON "ContestToChallengeMapping"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ContestToChallengeMapping_contestId_challengeId_key" ON "ContestToChallengeMapping"("contestId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ContestToChallengeMapping_contestId_index_key" ON "ContestToChallengeMapping"("contestId", "index");

-- CreateIndex
CREATE INDEX "Submissions_userId_idx" ON "Submissions"("userId");

-- CreateIndex
CREATE INDEX "Submissions_contestToChallengeMappingId_idx" ON "Submissions"("contestToChallengeMappingId");

-- CreateIndex
CREATE INDEX "Submissions_submittedAt_idx" ON "Submissions"("submittedAt");

-- CreateIndex
CREATE INDEX "Leaderboard_contestId_rank_idx" ON "Leaderboard"("contestId", "rank");

-- CreateIndex
CREATE INDEX "Leaderboard_userId_idx" ON "Leaderboard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_contestId_userId_key" ON "Leaderboard"("contestId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_contestId_rank_key" ON "Leaderboard"("contestId", "rank");

-- AddForeignKey
ALTER TABLE "ContestToChallengeMapping" ADD CONSTRAINT "ContestToChallengeMapping_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestToChallengeMapping" ADD CONSTRAINT "ContestToChallengeMapping_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submissions" ADD CONSTRAINT "Submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submissions" ADD CONSTRAINT "Submissions_contestToChallengeMappingId_fkey" FOREIGN KEY ("contestToChallengeMappingId") REFERENCES "ContestToChallengeMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
