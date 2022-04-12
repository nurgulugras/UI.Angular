import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceLineBreaks'
})
export class ReplaceLineBreaksPipe implements PipeTransform {
  transform(value: string): string {
    return !value ? null : value.replace(/\n/g, '<br/>');
  }
}