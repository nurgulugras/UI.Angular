import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormater'
})
export class SchedulerTimeFormaterPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    return null;
  }

}
