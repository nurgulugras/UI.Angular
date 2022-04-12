export class MounthlySnapshotSchedule {

    isActive: boolean;

    /**
     * Ayın Hangi Günü
     */
    mounthDay: number;

    /**
     * Ayın ilk günü
     */
    isFirsttDayOfTheMounth: boolean;

    /**
     * Ayın son günü
     */
    isLastDayOfTheMounth: boolean;

    /**
     * İşlem yapılacak saat
     */
    issueTime: string;

    /**
     * Ne kadar saklanacak?
     * Örn: 24 adet verisi saklanacak
     */
    keepFor: number;
}
