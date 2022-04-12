import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DynamicFixedDirective } from "./dynamic-fixed.directive";
import { ReadonlyDirective } from './readonly.directive';

const DIRECTIVES = [
    DynamicFixedDirective,
    ReadonlyDirective
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ...DIRECTIVES,
    ],
    exports: [
        ...DIRECTIVES
    ]
})
export class DirectivesModule { }
