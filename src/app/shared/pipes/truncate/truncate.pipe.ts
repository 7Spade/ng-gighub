import { Pipe, PipeTransform } from '@angular/core';

/** Truncate Pipe - 截斷文字 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    // TODO: 實作文字截斷
    return value;
  }
}
