import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteseconds'
})
export class MinutesecondsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === undefined) {
      return '00:00';
    }
    const minutes: number = Math.floor(value / 60);
    const reste = value - minutes * 60;
    return ((minutes < 10) ? '0' : '') + minutes + ':' + ((reste < 10) ? '0' : '') + reste;
  }

}
