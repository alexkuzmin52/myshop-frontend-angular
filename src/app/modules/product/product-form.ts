import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegexEnum} from "../category";

export class ProductForm {
  productForm: FormGroup;
  packageDimensionsForm: FormGroup;
  itemDimensionsForm: FormGroup;
  fb: FormBuilder = new FormBuilder();

  constructor() {
    /***************************************************** product formGroups */
    /***************************************************** packageDimensions Form */
    this.packageDimensionsForm = this.fb.group({
      length: [0, [Validators.min(0), Validators.max(12000)]],
      width: [0, [Validators.min(0), Validators.max(12000)]],
      height: [0, [Validators.min(0), Validators.max(12000)]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** itemDimensions Form */
    this.itemDimensionsForm = this.fb.group({
      length: [0, [Validators.min(0), Validators.max(12000)]],
      width: [0, [Validators.min(0), Validators.max(12000)]],
      height: [0, [Validators.min(0), Validators.max(12000)]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** create product Form */
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      accountingType: ['', [Validators.required]],
      brand: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      level: ['', [Validators.required]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      // code: [0, [Validators.min(0)]],
      countryOfManufacture: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      discount: [0, [Validators.min(0), Validators.max(99)]],
      originalPrice: [0.1, [Validators.required, Validators.min(0.1), Validators.max(99999)]],
      price: [0.1, [Validators.required, Validators.min(0.1), Validators.max(99999)]],
      equipment: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      shortCharacteristics: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      fullCharacteristics: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      shortDescription: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      fullDescription: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      newFlag: [false],
      promoFlag: [false],
      overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
      packageAmount: [1, [Validators.min(1), Validators.max(10000)]],
      packageDimensions: this.packageDimensionsForm,
      itemDimensions: this.itemDimensionsForm,
      stockCount: [1, [Validators.required, Validators.min(0), Validators.max(9999)]],
      storeCount: [1, [Validators.required, Validators.min(0), Validators.max(9999)]],
      provider: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      photo: [{value: [], disabled: true}]
    })
  }
}
