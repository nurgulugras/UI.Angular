import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppProductsComponent } from "./app-products.component";
import {
  AppProductAddOrUpdateComponent,
  AppProductListComponent,
} from "./components";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxLoadingModule } from "ngx-loading";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { DynamicModalModule } from "../../../../shared/components/dynamic-modal/dynamic-modal.module";
import { NotifyModalModule } from "../../../../shared/components/notify-modal/notify-modal.module";
import { DirectivesModule } from "../../../../shared/directives/directives.module";

const COMPONENTS = [
  AppProductsComponent,
  AppProductListComponent,
  AppProductAddOrUpdateComponent,
];
const MODULES = [
  CommonModule,
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
];

@NgModule({
  imports: MODULES,
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class AppProductsModule {}
