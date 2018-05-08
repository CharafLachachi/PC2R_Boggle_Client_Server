import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectedWord'
})
export class SelectedWordPipe implements PipeTransform {

  transform(value: Array<{ lettre: string, trajectoire: string }>, args?: any): any {
    var res = '';
    for (let v of value) {
      res += v.lettre;
    }
    return res;
  }

}
