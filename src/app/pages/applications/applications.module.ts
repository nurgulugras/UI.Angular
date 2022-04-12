import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApplicationsComponent } from "./applications.component";
import {
  ApplicaationKeyInfoComponent,
  ApplicationAddComponent,
  ApplicationDetailOrUpdateComponent,
  ApplicationDetailOverviewComponent,
  ApplicationListComponent,
} from "./components";
import { ApplicationsRoutingModule } from "./applications-routing.module";
import { NgxLoadingModule } from "ngx-loading";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TabsModule } from "ngx-bootstrap/tabs";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { DynamicModalModule } from "../../shared/components/dynamic-modal/dynamic-modal.module";
import { NotifyModalModule } from "../../shared/components/notify-modal/notify-modal.module";
import { DirectivesModule } from "../../shared/directives/directives.module";
import { AppProductsModule } from "./modules/app-products/app-products.module";
import { AppLimitsModule } from "./modules/app-limits/app-limits.module";

const MODULES = [
  CommonModule,
  ApplicationsRoutingModule,
  NgxLoadingModule.forRoot({}),
  PopoverModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  DynamicModalModule,
  FormsModule,
  ReactiveFormsModule,
  DirectivesModule,
  TabsModule,
  TableModule,
  CalendarModule,
  DropdownModule,
  AppProductsModule,
  AppLimitsModule
];

const COMPONENTS = [
  ApplicationsComponent,
  ApplicationListComponent,
  ApplicationAddComponent,
  ApplicationDetailOrUpdateComponent,
  ApplicationDetailOverviewComponent,
  ApplicaationKeyInfoComponent
];

@NgModule({
  imports: MODULES,
  declarations: COMPONENTS,
})
export class ApplicationsModule {}
