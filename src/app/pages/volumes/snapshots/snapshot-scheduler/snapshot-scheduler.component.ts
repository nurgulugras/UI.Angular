import { Component, OnInit, Injector, Input, OnChanges } from '@angular/core';
import { ComponentBase } from '../../../../shared/components/component-base';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { SnapshotScheduerService } from '../../../../shared/services/snapshot-scheduer.service';
import { SnapshotScheduleConfig } from '../../../../models/entity/SnapshotScheduler/SnapshotScheduleConfig';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import * as moment from 'moment';
@Component({
  selector: 'esa-snapshot-scheduler',
  templateUrl: './snapshot-scheduler.component.html',
  styleUrls: ['./snapshot-scheduler.component.scss']
})
export class SnapshotSchedulerComponent extends ComponentBase implements OnInit, OnChanges {

  moment = moment;


  //  #region [ Fields ]
  @Input() selectedVolume: string;
  daysOfWeek: string[] = [];
  days: number[] = [];

  selectedCity: string;
  dateValue: Date
  value: Date = new Date();
  config: SnapshotScheduleConfig;

  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private snapshotScheduerService: SnapshotScheduerService) {
    super(injector);
    this.loadDaysOfWeek();
    this.loadDays();
  }
  ngOnInit(): void {
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.getSnapshotsOScheduleConfig();
  }

  // #endregion

  //  #region [ Entity ]
  private getSnapshotsOScheduleConfigFromAPI(volume: string): void {
    this._isRunning = true;
    this.snapshotScheduerService.getSnapshotScheduleConfig(volume).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.config = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      } else {
        this._notifyService.info("No snapshot is available");
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private updateSnapshotsOScheduleConfigFromAPI(volume: string, config: SnapshotScheduleConfig): void {
    config.volume = volume;
    if (config.yearly.issueDate.getFullYear() == 0) {
      config.yearly.issueDate = new Date(new Date().getFullYear(), config.yearly.issueDate.getMonth(), config.yearly.issueDate.getDay());
    }
    this._isRunning = true;
    this.snapshotScheduerService.updateSnapshotScheduleConfig(volume, config).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  // #endregion

  //  #region [ UI Tools ]
  public refresh() {
    this.getSnapshotsOScheduleConfig();
  }
  onChangedHourlyIsActive(checked) {
    if (checked) {
      if (!this.config.hourly.issueTime)
        this.config.hourly.issueTime = "08:00";
      if (!this.config.hourly.period)
        this.config.hourly.period = 1;
      if (!this.config.hourly.keepFor)
        this.config.hourly.keepFor = 1;
    }
  }
  onChangedDailyIsActive(checked) {
    if (checked) {
      if (!this.config.daily.issueTime)
        this.config.daily.issueTime = "08:00";
      if (!this.config.daily.keepFor)
        this.config.daily.keepFor = 1;
    }
  }
  onChangedWeeklyIsActive(checked) {
    if (checked) {
      if (!this.config.weekly.weekday)
        this.config.weekly.weekday = "Monday";
      if (!this.config.weekly.issueTime)
        this.config.weekly.issueTime = "08:00";
      if (!this.config.weekly.keepFor)
        this.config.weekly.keepFor = 1;
    }
  }
  onChangedMonthlyIsActive(checked) {
    if (checked) {
      if (!this.config.mounthly.issueTime)
        this.config.mounthly.issueTime = "08:00";
      if (!this.config.mounthly.keepFor)
        this.config.mounthly.keepFor = 1;
      if (!this.config.mounthly.mounthDay)
        this.config.mounthly.mounthDay = 1;
    }
  }
  onChangedYearlyIsActive(checked) {
    if (checked) {
      if (!this.config.yearly.issueTime)
        this.config.yearly.issueTime = "08:00";
      if (this.config.yearly.issueDate)
        this.config.yearly.issueDate = new Date(new Date().getFullYear(), 11, 31);
      if (!this.config.yearly.keepFor)
        this.config.yearly.keepFor = 1;
    }
  }

  updateConfig(): void {
    if (!this.selectedVolume) {
      this._notifyService.error("No volume have been selected. Select a volume before continuing.");
      return;
    }

    if (!this.isValidForm()) {
      return;
    }

    var modal = this._modalService.confirmYesNo("Update to Snapshot Configurations", `Are you sure you want to update the configuration?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.updateSnapshotsOScheduleConfigFromAPI(this.selectedVolume, this.config);
      }
    });
  }
  getLimitFor(type: string) {
    if (this.config && this.config.limits) {
      return this.config.limits[type];
    }
    return 0;
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    if (!this.isValidHourlyForm()) return;
    if (!this.isValidDailyForm()) return;
    if (!this.isValidWeeklyForm()) return;
    if (!this.isValidMounthlyForm()) return;
    if (!this.isValidYearlyForm()) return;
    return true;
  }
  isValidHourlyForm(showMessage: boolean = true): boolean {
    var entity = this.config && this.config.hourly;
    if (!entity) return false;
    if (entity.isActive) {

      var limit = this.getLimitFor("keepForHourlyLimit");

      if (!entity.issueTime) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Hourly' -> 'Starting Time' is required]");
        return false;
      }
      if (!entity.period || entity.period == 0) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Hourly' -> 'Every at this time' is required]");
        return false;
      }
      if (entity.period > 12) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Hourly' -> 'Every at this time' cannot be greater than 12 ]");
        return false;
      }
      if (!entity.keepFor) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Hourly' -> 'Keep For' is required]");
        return false;
      }
      if (entity.keepFor < 1 || entity.keepFor > limit) {
        if (showMessage)
          this._notifyService.error(`Nonvalid form! [ 'Hourly' -> Keep hours for limit is out of expected range (range: 1 - ${limit})]`);
        return false;
      }
    }
    return true;
  }
  isValidDailyForm(showMessage: boolean = true): boolean {
    var entity = this.config && this.config.daily;
    if (!entity) return false;
    if (entity.isActive) {

      var limit = this.getLimitFor("keepForDailyLimit");

      if (!entity.issueTime) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Daily' -> 'Every at this time' is required]");
        return false;
      }
      if (!entity.keepFor) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Daily' -> 'Keep For' is required]");
        return false;
      }
      if (entity.keepFor < 1 || entity.keepFor > limit) {
        if (showMessage)
          this._notifyService.error(`Nonvalid form! [ 'Daily' -> Keep daily for limit is out of expected range (range: 1 - ${limit})]`);
        return false;
      }
    }
    return true;
  }
  isValidWeeklyForm(showMessage: boolean = true): boolean {
    var entity = this.config && this.config.weekly;
    if (!entity) return false;

    if (entity.isActive) {

      var limit = this.getLimitFor("keepForWeeklyLimit");

      if (!entity.issueTime) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Weekly' -> 'Every at this time' is required]");
        return false;
      }
      if (!entity.keepFor) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Weekly' -> 'Keep For' is required]");
        return false;
      }
      if (entity.keepFor < 1 || entity.keepFor > limit) {
        if (showMessage)
          this._notifyService.error(`Nonvalid form! [ 'Weekly' -> Keep week for limit is out of expected range (range: 1 - ${limit})]`);
        return false;
      }
    }
    return true;
  }
  isValidMounthlyForm(showMessage: boolean = true): boolean {
    var entity = this.config && this.config.mounthly;
    if (!entity) return false;

    if (entity.isActive) {

      var limit = this.getLimitFor("keepForMounthlyLimit");

      if (!entity.issueTime) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Mounthly' -> 'Every at this time' is required]");
        return false;
      }
      if (!entity.keepFor) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Mounthly' -> 'Keep For' is required]");
        return false;
      }
      if (entity.keepFor < 1 || entity.keepFor > limit) {
        if (showMessage)
          this._notifyService.error(`Nonvalid form! [ 'Mounthly' -> Keep mounth for limit is out of expected range (range: 1 - ${limit})]`);
        return false;
      }

    }
    return true;
  }
  isValidYearlyForm(showMessage: boolean = true): boolean {
    var entity = this.config && this.config.yearly;
    if (!entity) return false;
    if (entity.isActive) {

      var limit = this.getLimitFor("keepForYearlyLimit");

      if (!entity.issueDate) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Yearly' -> 'Every at this date' is required]");
        return false;
      }
      if (!entity.issueTime) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Yearly' -> 'Every at this time' is required]");
        return false;
      }
      if (!entity.keepFor) {
        if (showMessage)
          this._notifyService.error("Nonvalid form! [ 'Yearly' -> 'Keep For' is required]");
        return false;
      }
      if (entity.keepFor < 1 || entity.keepFor > limit) {
        if (showMessage)
          this._notifyService.error(`Nonvalid form! [ 'Yearly' -> Keep year for limit is out of expected range (range: 1 - ${limit})]`);
        return false;
      }

    }
    return true;
  }
  // #endregion

  //  #region [ Internal ]
  loadDaysOfWeek() {
    this.daysOfWeek.push("Monday");
    this.daysOfWeek.push("Tuesday");
    this.daysOfWeek.push("Wednesday");
    this.daysOfWeek.push("Thursday");
    this.daysOfWeek.push("Friday");
    this.daysOfWeek.push("Saturday");
    this.daysOfWeek.push("Sunday");
  }

  loadDays() {
    for (let index = 1; index <= 28; index++) {
      this.days.push(index);
    }
  }

  getSnapshotsOScheduleConfig() {
    if (!this.selectedVolume) {
      this._notifyService.error("No volume have been selected. Select a volume before continuing.");
      return;
    }
    this.getSnapshotsOScheduleConfigFromAPI(this.selectedVolume);
  }
  // #endregion

}