export class YearlySnapshotSchedule {
    isActive: boolean;

    /**
     * İşlem yapılacak saat
     */
    issueTime: string;

    /**
     * İşlem yapılacak tarih
     * Örn: 01.Ocak
     */
    issueDate: Date;

    /**
     * Yılın ilk günü
     */
    isFirsttDayOfTheYear: boolean;

    /**
     * Yılın son günü
     */
    isLastDayOfTheYear: boolean;
    
    /**
     * Ne kadar saklanacak?
     * Örn: 24 adet verisi saklanacak
     */
    keepFor: number;
}
