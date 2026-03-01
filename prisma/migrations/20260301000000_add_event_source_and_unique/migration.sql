-- AlterTable
ALTER TABLE "Event" ADD COLUMN "sourceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_date_promotionId_venueId_key" ON "Event"("date", "promotionId", "venueId");

