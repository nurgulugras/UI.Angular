import { Component, Renderer2, ApplicationRef, Injector, ElementRef, OnInit, Inject } from '@angular/core';
import { AppConfigService } from '../../models/internal/AppConfigService';
import { menuItems } from '../../_nav';
import { AuthToolService } from '../../shared/AuthToolService';
import { Router } from '@angular/router';
import { DynamicModalService } from '../../shared/services/dynamic-modal.service';
import { ChangePasswordComponent } from '../../pages/user-profile';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public copyright: string;
  public companyTitle: string;
  public sidebarMinimized = false;
  public menuItems = menuItems;
  isFullScreen: boolean = false;
  constructor(@Inject(DOCUMENT) private document: any, appConfigService: AppConfigService, private authToolService: AuthToolService, private dynamicModalService: DynamicModalService, private host: ElementRef) {
    this.copyright = appConfigService.copyright;
    this.companyTitle = appConfigService.companyTitle;
  }
  elem;
  ngOnInit() {
    this.elem = document.documentElement;
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logout() {
    this.authToolService.logout();
  }
  changePossword() {
    const popup = this.dynamicModalService.open<ChangePasswordComponent>(
      ChangePasswordComponent,
      "Change Password",
      true,
      true,
      false
    );
  }
  toggleScreen() {
    if (this.isFullScreen)
      this.closeFullscreen();
    else
      this.openFullscreen();
    this.isFullScreen = !this.isFullScreen;
  }
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
}