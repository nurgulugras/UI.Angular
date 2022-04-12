import { DailySnapshotSchedule } from "./DailySnapshotSchedule";
import { HourlySnapshotSchedule } from "./HourlySnapshotSchedule";
import { MounthlySnapshotSchedule } from "./MounthlySnapshotSchedule";
import { WeeklySnapshotSchedule } from "./WeeklySnapshotSchedule";
import { YearlySnapshotSchedule } from "./YearlySnapshotSchedule";
import { SnapshotScheduleConfigLimits } from './SnapshotScheduleConfigLimits';
export class SnapshotScheduleConfig {
    volume: string;
    hourly: HourlySnapshotSchedule;
    daily: DailySnapshotSchedule;
    weekly: WeeklySnapshotSchedule;
    mounthly: MounthlySnapshotSchedule;
    yearly: YearlySnapshotSchedule;
    limits: SnapshotScheduleConfigLimits;
}
