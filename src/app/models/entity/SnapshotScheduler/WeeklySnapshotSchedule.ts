export class WeeklySnapshotSchedule {
    isActive: boolean;

    /** 
    /**Haftanın günü
     */
    weekday: string;

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
