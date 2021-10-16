import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-user-filter-chips',
  templateUrl: 'user-filter-chips.component.html',
  styleUrls: ['user-filter-chips.component.css'],
})
export class UserFilterChipsComponent {
  @Input() filters: Array<any> = [];
  @Output() removeElemFilters = new EventEmitter<any>();
  @Output() clearFilters = new EventEmitter<any>();
  selectable = true;
  removable = true;

  constructor() {}

  remove(filter: string): void {
    console.log(filter);
    console.log(typeof (filter));
    console.log(this.filters);

    const index = this.filters.indexOf(filter);
    console.log('index', index);
    if (index >= 0) {
      this.filters.splice(index, 1);
      this.removeItemFilter(filter)
    }
  }

  removeItemFilter(value: any) {
    this.removeElemFilters.emit(value);
  }

  onClearAllFilters() {
    this.clearFilters.emit();
  }
}
