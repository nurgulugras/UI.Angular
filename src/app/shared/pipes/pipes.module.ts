import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';
import { SchedulerTimeFormaterPipe } from './scheduler-time-formater.pipe';
import { ReplaceLineBreaksPipe } from './replaceLineBreaks.pipe';
import { SizeConvertionPipe } from './size-convertion.pipe';

const pipes = [
  SafePipe,
  SchedulerTimeFormaterPipe,
  ReplaceLineBreaksPipe,
  SizeConvertionPipe
]

@NgModule({
  imports: [CommonModule],
  declarations: [...pipes],
  exports: [...pipes]
})
export class PipesModule { }
