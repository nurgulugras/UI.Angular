import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './models/internal/AppConfigService';
import { NotifyService } from './shared/services/notify.service';
import { NotifierContainerComponent } from 'angular-notifier';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: `<router-outlet></router-outlet> 
  <notifier-container #notifierContainer></notifier-container>` ,
  providers: [IconSetService],
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild(NotifierContainerComponent, { static: false }) notifierContainer: NotifierContainerComponent;
  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private titleService: Title,
    private appConfigService: AppConfigService,
    private notifyService: NotifyService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
    this.setTitle(this.appConfigService.appLongTitle);
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  ngAfterViewInit(): void {
    this.notifyService.setNotifyElement(this.notifierContainer);
  }
}
