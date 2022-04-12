import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'esa-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
  }

  //  #region [ Fields ]
  @ViewChild("tabSet", { static: false }) tabSet: any;
  isActiveADService: boolean = false;
  // #endregion

  //  #region [ Initialize ]
  constructor() {
  }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  // #endregion

  //  #region [ UI Tools ]
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getActiveTabName(): string {
    if (this.tabSet && this.tabSet.tabs) {
      var activeTab = this.tabSet.tabs.find(tab => tab.active);
      return activeTab ? activeTab.elementRef.nativeElement.ariaLabel : null;
    }
    return null;
  }
  // #endregion
}
