-- AlterTable
ALTER TABLE `ClientCardList` ADD COLUMN `departmentID` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `ClientCardList_departmentID_idx` ON `ClientCardList`(`departmentID`);
