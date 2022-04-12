import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { Organization } from '../../../../models/entity/Organization';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { ComponentBase } from '../../../../shared/components/component-base';
import { DynamicModalService } from '../../../../shared/services/dynamic-modal.service';
import { OrganizationsService } from '../../../../shared/services/organizations.service';
import { OrganizationAddOrUpdateComponent } from '../organization-add-or-update/organization-add-or-update.component';

@Component({
  selector: 'alms-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]

  organizations: Organization[] = [];
  selectedOrganization: Organization = new Organization();
  _isRunning: boolean;
  @Output() onSelectedValueChanged: EventEmitter<Organization> =
    new EventEmitter();
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private organizationsService: OrganizationsService,
    private dynamicModalService: DynamicModalService
  ) {
    super(injector);
  }
  ngOnInit() {
    this.getOrganizationList();
  }
  // #endregion

  //  #region [ Entity ]

  getOrganizationsFromAPI() {
    this._isRunning = true;
    this.organizationsService.getOrganizations().subscribe((response) => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.organizations = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
  }

  // #endregion

  //  #region [ UI Tools ]
  refresh() {
    this.getOrganizationList();
  }
  addNewOrganization() {
    this.openNewOrganizationComponent();
  }
  selectedOrganizationChanged(organization: Organization) {

    this.organizationsService.onSelectedOrganizatonChanged.emit(organization);

    this.selectedOrganization = organization;
    this.onSelectedValueChanged.emit(organization);
  }
  openOrganizationEditComponent(organizasyon:Organization){
    const popup = this.dynamicModalService.open<OrganizationAddOrUpdateComponent>(
      OrganizationAddOrUpdateComponent,
      "Organizasyon Güncelleme",
      true,
      true,
      true
    );
    popup.instance.setOrganizationToEdit(organizasyon);
    popup.onClosed().subscribe((response) => {
      this.refresh();

    });
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getOrganizationList() {
    this.getOrganizationsFromAPI();
  }
  openNewOrganizationComponent() {
    const popup = this.dynamicModalService.open<OrganizationAddOrUpdateComponent>(
      OrganizationAddOrUpdateComponent,
      "Yeni Organizasyon",
      true,
      true,
      true
    );
    popup.onClosed().subscribe((response) => {
      this.refresh();
    });
  }
  // #endregion
}

