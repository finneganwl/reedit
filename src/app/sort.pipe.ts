import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value){
    if (!value) return;
    return value.sort((item1, item2) => item2.payload.val().upvotes - item1.payload.val().upvotes);
  }

}
