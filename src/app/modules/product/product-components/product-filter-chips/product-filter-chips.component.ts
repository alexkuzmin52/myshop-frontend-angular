import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {IProductFilter} from "../../product-models";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'app-product-filter-chips',
  templateUrl: 'product-filter-chips.component.html',
  styleUrls: ['product-filter-chips.component.css'],
})
export class ProductFilterChipsComponent {
  @Input() filters: Array<any> = [];
  // @Input() filters: IProductFilter | any = null;
  @Output() removeElemFilters = new EventEmitter<any>();
  @Output() clearFilters = new EventEmitter<any>();
  selectable = true;
  removable = true;
  //////////////////////////////////////////////////////////////////////////////////////
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // fruitCtrl = new FormControl();
  // filteredFruits: Observable<string[]>;
  // fruits: string[] = ['Lemon'];
  // allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  constructor() {
    // this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();
  //   console.log('event: MatChipInputEvent');
  //   console.log(event.value);
  //   // Add our fruit
  //   if (value) {
  //     this.fruits.push(value);
  //   }
  //
  //   // Clear the input value
  //   event.chipInput!.clear();
  //
  //   this.fruitCtrl.setValue(null);
  // }

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

  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.fruits.push(event.option.viewValue);
  //   this.fruitInput.nativeElement.value = '';
  //   this.fruitCtrl.setValue(null);
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //
  //   return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  // }

  removeItemFilter(value: any) {
    this.removeElemFilters.emit(value);
  }

  onClearAllFilters() {
    this.clearFilters.emit();
  }
}
