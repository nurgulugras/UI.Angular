import { Component, Injector, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import * as moment from 'moment';
import { Job } from '../../../models/entity/Job';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { ComponentBase } from '../../../shared/components/component-base';
import { DynamicModalService } from '../../../shared/services/dynamic-modal.service';
import { JobsService } from '../../../shared/services/jobs.service';
import { LanguageKeys } from '../../../models/internal/language-keys';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';
import { JobStatus } from '../../../models/enums/JobStatus.enum';

@Component({
  selector: 'esa-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  jobs: Job[] = [];
  cols: any[];
  jobStatusUI = JobStatus;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private dynamicModalService: DynamicModalService, private jobsService: JobsService) {
    super(injector);
    this.loadColums();
  }
  ngOnInit() {
    this.getJobs();
  }
  // #endregion

  //  #region [ Entity ]
  private getJobsFromAPI(): void {
    this._isRunning = true;
    this.jobsService.getJobs().subscribe(response => {
      this.jobs = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.jobs = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private pauseJobFromAPI(uid: Guid): void {
    this._isRunning = true;
    this.jobsService.pauseJob(uid).subscribe(response => {
      this.jobs = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
        this.refresh();
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private resumeJobFromAPI(uid: Guid): void {
    this._isRunning = true;
    this.jobsService.resumeJob(uid).subscribe(response => {
      this.jobs = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
        this.refresh();
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
  refresh() {
    this.getJobs();
  }
  pauseJob(uid: Guid) {
    var modal = this._modalService.confirmYesNo("Pause to Job", `Are you sure you want to pause the job?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.pauseJobFromAPI(uid);
      }
    });
  }
  resumeJob(uid: Guid) {
    var modal = this._modalService.confirmYesNo("Resume to Job", `Are you sure you want to resume the job?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.resumeJobFromAPI(uid);
      }
    });
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  private getJobs() {
    this.getJobsFromAPI();
  }
  private loadColums() {
    this.cols = [
      { field: 'status', header: 'Status', sort: true },
      { field: 'id', header: 'UId', sort: false },
      { field: 'createUserName', header: 'Create User', sort: true },
      { field: 'jobType', header: 'Job Type', sort: true },
      { field: 'jobName', header: 'Job Name', sort: true },
      { field: 'previousFireTime', header: 'Previous Time', sort: true, type: 'datetime' },
      { field: 'nextFireTime', header: 'Next Time', sort: true, type: 'datetime' }
    ];
  }

  // #endregion
}