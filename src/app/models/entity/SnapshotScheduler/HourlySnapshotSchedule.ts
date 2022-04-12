export class HourlySnapshotSchedule {
    isActive: boolean;

    /**
    * İşlem yapılacak saat
    */
    issueTime: string;

    /**
     * Periyot
     * Örn: 4 saatte 1 kez
     */
    period: number;
    
    /**
     * Ne kadar saklanacak?
     * Örn: 24 adet verisi saklanacak
     */
    keepFor: number;
}
