export class DailySnapshotSchedule {
    isActive: boolean;
    
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
