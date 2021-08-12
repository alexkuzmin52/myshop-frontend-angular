import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IProduct} from "../../product-models/product-interface";
import {ProductActionEnum} from "../../product-constants/product-action-enum";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../product-services/product.service";
import {ProductTypeEnum} from "../../product-constants";
import {ICategory, ISubCategory, ISubSubCategory} from "../../../category/category-models";
import {countriesList} from '../../countries-list';
import {RegexEnum} from "../../../category/constants";
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: IProduct[];
  product: IProduct = {} as IProduct;
  productAction: string = ProductActionEnum.PRODUCT_NOT_ACTION
  createProductCSV: FormGroup;

  csvFile: File | any = null;
  productForm: FormGroup;
  packageDimensionsForm: FormGroup;
  itemDimensionsForm: FormGroup;

  accountingType = [
    {value: ProductTypeEnum.COUNTED},
    {value: ProductTypeEnum.WEIGHTED}
  ];
  categoryLevel = [
    {level: 'category'},
    {level: 'subCategory'},
    {level: 'subSubCategory'},
  ]
  selectedAccountingType: ProductTypeEnum;
  selectedCategoryLevel: string = '';
  // selectedCategoryTitle: string = '';

  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  subSubCategories: ISubSubCategory[] = [];

  countries: Array<any> = countriesList;

  categoriesTitleList: Array<string> = [];

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMTY1NDUsImV4cCI6MTYzNjk1NjU0NX0.0B0nGk9yZZc2zO0Butx8J6ugMFkc_ddhi1Hwe-UobjE';


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private productService: ProductService) {
    this.categories = activatedRoute.snapshot.data.data[0];
    this.subCategories = activatedRoute.snapshot.data.data[1];
    this.subSubCategories = activatedRoute.snapshot.data.data[2];

    this.products = activatedRoute.snapshot.data.data[3];
    console.log(this.products);
    console.log(this.categories);
    console.log(this.subCategories);
    console.log(this.subSubCategories);

    this.selectedAccountingType = ProductTypeEnum.COUNTED;

    this.createProductCSV = fb.group({
      file_name: [{value: '', disabled: true}]
      // csv_file: ['', [Validators.required]]
    })

    /***************************************************** product formGroups*/
    /***************************************************** packageDimensionsForm*/
    this.packageDimensionsForm = fb.group({
      length: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      width: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      height: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** itemDimensionsForm*/
    this.itemDimensionsForm = fb.group({
      length: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      width: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      height: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** productForm*/
    this.productForm = fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      accountingType: ['', [Validators.required]],
      brand: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      level: ['', [Validators.required]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      // code: [0, [Validators.min(0)]],
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
      packageAmount: [1, [Validators.min(1), Validators.pattern('[0-9]')]],
      packageDimensions: this.packageDimensionsForm,
      itemDimensions: this.itemDimensionsForm,
      stockCount: [1, [Validators.required, Validators.min(0), Validators.max(9999), Validators.pattern('[0-9]')]],
      storeCount: [1, [Validators.required, Validators.min(0), Validators.max(9999), Validators.pattern('[0-9]')]],
      provider: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      photo: [{value: [''], disabled: true}]
    })
  }

  onHome() {
    this.router.navigate(['']);
  }

  ngOnInit(): void {
  }

  onCreateProductsFromCSV() {
    this.productAction = ProductActionEnum.CREATE_PRODUCT_FROM_CSV;
  }
  onChangeCsvFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length) {
      this.csvFile = fileList[0];
      this.createProductCSV.controls['file_name'].setValue(this.csvFile.name);
    }
  }
  onSubmitCreateProductsFromCSV() {
    this.productService.createProductsFromCSV(this.csvFile, this.token).subscribe(res => {
        console.log(res);
      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);

      })
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

  onChangeCategoryLevel(event: any) {
    console.log(event.value);
    switch (event.value) {
      case 'category':
        this.categoriesTitleList.length = 0;
        for (let category of this.categories) {
          this.categoriesTitleList.push(category.title)
        }
        break;
      case 'subCategory':
        this.categoriesTitleList.length = 0;
        for (let category of this.subCategories) {
          this.categoriesTitleList.push(category.title);
        }
        break;
      case 'subSubCategory':
        this.categoriesTitleList.length = 0;
        for (let category of this.subSubCategories) {
          this.categoriesTitleList.push(category.title);
        }
        break;
      default:
        break;
    }
  }

  onChangeNewFlag(event: any) {
    this.productForm.controls['newFlag'].patchValue(event.checked);
  }

  onChangePromoFlag(event: any) {
    this.productForm.controls['newFlag'].patchValue(event.checked);
    const check = this.productForm.get('newFlag');
  }

  onCreateProductsFromForm() {
    this.productAction = ProductActionEnum.CREATE_PRODUCT_FROM_FORM;
  }

  onGetCsv() {
    this.productService.getProductCsvFile(this.token).subscribe(res => {
        const getFileFromBlob = (uploadedBlob: Blob, fileName: string): File => {
          return new File([uploadedBlob], fileName, {lastModified: new Date().getTime(), type: uploadedBlob.type})
        }
        const uploadFile = getFileFromBlob(res, 'test.csv');
        console.log(uploadFile);
        fileSaver.saveAs(res, 'test2.csv');

      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      })
  }
}
