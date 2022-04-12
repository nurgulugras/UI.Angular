export class SnapshotCreationParameter {
    volume: string;

    /**
     * Versionlama için kullanılacak mı?
     */
    useForVersion: boolean;
    snapshotName: string;
    description: string;
}