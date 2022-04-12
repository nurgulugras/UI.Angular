import { Component, OnInit, Injector, AfterViewInit } from '@angular/core';
import { NodesService } from '../../../../shared/services/nodes.service';
import { Node } from '../../../../models/entity/Node';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { NotifyService } from '../../../../shared/services/notify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ComponentBase } from '../../../../shared/components/component-base';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';

@Component({
  selector: 'esa-node-entity-crud',
  templateUrl: './node-entity-crud.component.html',
  styleUrls: ['./node-entity-crud.component.scss']
})
export class NodeEntityCrudComponent extends ComponentBase implements OnInit, AfterViewInit {

  //  #region [ Fields ]
  baseNode: Node = new Node();
  formGroup: FormGroup;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private nodesService: NodesService, private notifyService: NotifyService) {
    super(injector);
    this.initNewEntity();
    this.initFormGroup();
  }
  ngAfterViewInit(): void {
    this.getBaseNodeFromAPI();
  }
  ngOnInit() {
    // this.getBaseNodeFromAPI();
  }

  // #endregion

  //  #region [ Entity ]
  getBaseNodeFromAPI() {
    this.nodesService.getBaseNode().subscribe(response => {
      if (response.resultType == ResultType.Success) {
        this.baseNode = response.dataModel;
        this.formGroup.patchValue(this.baseNode);
      } else if (response.resultType == ResultType.Fail) {
        this.notifyService.error(response.message);
      }
    },
    error => {
      this._isRunning = false;
    });
  }
  private saveNodeFromAPI(node: Node): void {
    this._isRunning = true;
    this.nodesService.saveEntityNode(node).subscribe(response => {
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
  private updateNodeFromAPI(node: Node): void {
    this._isRunning = true;
    this.nodesService.updateEntityNode(node.id, node).subscribe(response => {
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
  private deleteNodeFromAPI(node: Node): void {
    this._isRunning = true;
    this.nodesService.deleteEntityNode(node.id).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.initNewEntity();
        this._notifyService.success(LanguageKeys.ROW_DELETED);
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
  onSubmit() {

    this.setModelFromForm();

    if (!this.isValidForm()) {
      this._notifyService.warning("Form is not valid. Please check form.");
      return;
    }

    var modal = this._modalService.confirmYesNo(`${this.isEditMode() ? 'Update' : 'Save'} Base Node`, `Are you sure you want to ${this.isEditMode() ? 'update' : 'save'}?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        if (this.isEditMode())
          this.updateNodeFromAPI(this.baseNode);
        else
          this.saveNodeFromAPI(this.baseNode);
      }
    });
  }
  onRefreshButtonClick() {
    this.getBaseNodeFromAPI();
  }
  onDeleteButtonClick() {

    var modal = this._modalService.confirmYesNo(`Delete Base Node`, `Are you sure you want to delete?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.deleteNodeFromAPI(this.baseNode);
      }
    });

  }
  // #endregion

  //  #region [ Validations ]
  isEditMode(): boolean {
    return this.baseNode && this.baseNode.id && this.baseNode.id > 0;
  }
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  // #endregion

  //  #region [ Internal ]
  initNewEntity(): void {
    this.baseNode = new Node();
    this.baseNode.isActive = true;
  }
  setModelFromForm() {
    if (!this.baseNode)
      this.initNewEntity();
    this.baseNode = Object.assign(this.baseNode, this.formGroup.value);
  }
  initFormGroup() {
    this.formGroup = new FormGroup({
      hostName: new FormControl(this.baseNode.hostName, [Validators.required, this.noWhitespaceValidator]),
      ip: new FormControl(this.baseNode.IP, [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl(this.baseNode.email, [Validators.required, this.noWhitespaceValidator]),
      password: new FormControl(this.baseNode.password, [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(this.baseNode.isActive)
    });
  }
  // #endregion
}