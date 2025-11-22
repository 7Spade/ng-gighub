import { Pipe, PipeTransform } from '@angular/core';

/** Date Format Pipe - 格式化日期 */
@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    // TODO: 實作日期格式化
    return value;
  }
}
