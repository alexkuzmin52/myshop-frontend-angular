import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSidenav} from "@angular/material/sidenav";
import {Router} from "@angular/router";
import {delay, map} from "rxjs/operators";

import {ICategory, ISubCategory, ISubSubCategory} from "../../../category/category-models";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatSelectChange} from "@angular/material/select";
import {ProductActionEnum, ProductTypeEnum} from "../../product-constants";
import {ProductService} from "../../product-services";
import {RegexEnum} from "../../../category/constants";
import {countriesList} from "../../countries-list";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  productForm: FormGroup;
  packageDimensionsForm: FormGroup;
  itemDimensionsForm: FormGroup;
  createProductCSV: FormGroup;

  countries = countriesList;
  categoryLevel = [
    {level: 'category'},
    {level: 'subCategory'},
    {level: 'subSubCategory'},
  ];

  accountingType = [
    {value: ProductTypeEnum.COUNTED},
    {value: ProductTypeEnum.WEIGHTED}
  ];
  selectedAccountingType: ProductTypeEnum = ProductTypeEnum.COUNTED;
  selectedCategoryLevel: string = '';
  categoriesTitleList: Array<string> = [''];
  productAction: string = ProductActionEnum.PRODUCT_NOT_ACTION;
  csvFile: File | any = null;

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMTY1NDUsImV4cCI6MTYzNjk1NjU0NX0.0B0nGk9yZZc2zO0Butx8J6ugMFkc_ddhi1Hwe-UobjE';

  constructor(private router: Router,
              private menuToggleObserver: BreakpointObserver,
              private fb: FormBuilder,
              private productService: ProductService) {
    /***************************************************** product formGroups */
    /***************************************************** packageDimensions Form */
    this.packageDimensionsForm = fb.group({
      length: [0, [Validators.min(0), Validators.max(12000)]],
      width: [0, [Validators.min(0), Validators.max(12000)]],
      height: [0, [Validators.min(0), Validators.max(12000)]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** itemDimensions Form */
    this.itemDimensionsForm = fb.group({
      length: [0, [Validators.min(0), Validators.max(12000)]],
      width: [0, [Validators.min(0), Validators.max(12000)]],
      height: [0, [Validators.min(0), Validators.max(12000)]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** create product Form */

    this.productForm = fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      accountingType: ['', [Validators.required]],
      brand: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      level: ['', [Validators.required]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      countryOfManufacture: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      discount: [0, [Validators.min(0), Validators.max(0.99)]],
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
      stockCount: [0, [Validators.required, Validators.min(0), Validators.max(9999)]],
      storeCount: [0, [Validators.required, Validators.min(0), Validators.max(9999)]],
      provider: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      photo: [{value: [], disabled: true}]
    });
    /***************************************************** create product CSV Form */
    this.createProductCSV = fb.group({
      file_name: [{value: '', disabled: true}]
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.menuToggleObserver
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  onHome() {
    this.router.navigate(['']);
  }

  onAllProduct() {
    this.router.navigate(['/product']);
  }

  onCreateProductsFromForm() {
    this.productAction = ProductActionEnum.CREATE_PRODUCT_FROM_FORM;
  }

  onCreateProductsFromCSV() {
    this.csvFile = null;
    this.createProductCSV.controls['file_name'].setValue('');
    this.productAction = ProductActionEnum.CREATE_PRODUCT_FROM_CSV;
  }

  onChangeCsvFile(event: any) {
    const files: FileList = event.target.files;
    if (files[0].type === 'text/csv') {
      this.csvFile = files[0];
      this.createProductCSV.controls['file_name'].setValue(this.csvFile.name);
    } else {
      alert('Invalid file type')
    }
  }

  onSubmitCreateProductsFromCSV(): void {
    if (!this.csvFile) {
      alert('No file selected');
      return;
    }
    this.productService.createProductsFromCSV(this.csvFile, this.token).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error.error.message);
      alert(`error: ${error.error.message}`);
    });
  }

  onChangeNewFlag(event: MatCheckboxChange) {
    this.productForm.controls['newFlag'].patchValue(event.checked);
  }

  onChangePromoFlag(event: MatCheckboxChange) {
    this.productForm.controls['promoFlag'].patchValue(event.checked);
  }

  onSubmitCreateProduct(productForm: FormGroup) {
    delete productForm.value.level;
    this.productService.createProduct(productForm.value, this.token).subscribe(res => {
        console.log(res);
      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      }
    )
  }

  onChangeCategoryLevel(event: MatSelectChange) {
    switch (event.value) {
      case 'category':
        this.productService.getCategories()
          .pipe(map((cat: ICategory[]) => cat.map((c: ICategory) => c.title)))
          .subscribe(res => {
            this.categoriesTitleList = res;
          })
        break;
      case 'subCategory':
        this.productService.getSubCategories()
          .pipe(map((cat: ISubCategory[]) => cat.map((c: ISubCategory) => c.title)))
          .subscribe(res => {
            this.categoriesTitleList = res;
          })
        break;
      case 'subSubCategory':
        this.productService.getSubSubCategories()
          .pipe(map((cat: ISubSubCategory[]) => cat.map((c: ISubSubCategory) => c.title)))
          .subscribe(res => {
            this.categoriesTitleList = res;
          })
        break;
      default:
        break;
    }
  }
}
