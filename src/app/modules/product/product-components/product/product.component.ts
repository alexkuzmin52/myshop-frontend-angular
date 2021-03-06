import * as fileSaver from 'file-saver';
import {ActivatedRoute, Router} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSidenav} from "@angular/material/sidenav";
import {delay} from "rxjs/operators";

import {ICategory, ISubCategory, ISubSubCategory} from "../../../category";
import {IProductFilter} from "../../product-models";
import {IProduct} from "../../product-models";
import {ProductActionEnum} from "../../product-constants";
import {ProductMenuActionEnum} from "../../product-constants";
import {ProductService} from "../../product-services";
import {ProductTypeEnum} from "../../product-constants";
import {RegexEnum} from "../../../category";
import {countriesList} from '../../countries-list';
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  products: IProduct[];
  productFilter: IProductFilter = {};
  selectedProduct: IProduct = {} as IProduct;
  productAction: string = ProductActionEnum.PRODUCT_NOT_ACTION;
  productMenuAction: string = ProductMenuActionEnum.PRODUCT_MENU_NOT_ACTION;
  listProductCategory: Array<string> = [''];
  listProductBrand: Array<string> = [''];
  csvFile: File | any = null;

  productForm: FormGroup;
  packageDimensionsForm: FormGroup;
  itemDimensionsForm: FormGroup;
  createProductCSV: FormGroup;
  productFilterForm: FormGroup;

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

  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  subSubCategories: ISubSubCategory[] = [];

  countries: Array<any> = countriesList;

  categoriesTitleList: Array<string> = [];

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMTY1NDUsImV4cCI6MTYzNjk1NjU0NX0.0B0nGk9yZZc2zO0Butx8J6ugMFkc_ddhi1Hwe-UobjE';


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private productService: ProductService,
              private menuToggleObserver: BreakpointObserver) {
    this.categories = activatedRoute.snapshot.data.data[0];
    this.subCategories = activatedRoute.snapshot.data.data[1];
    this.subSubCategories = activatedRoute.snapshot.data.data[2];
    this.products = activatedRoute.snapshot.data.data[3];

    this.selectedAccountingType = ProductTypeEnum.COUNTED;

    /***************************************************** product formGroups */
    /***************************************************** packageDimensions Form */
    this.packageDimensionsForm = fb.group({
      length: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      width: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      height: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** itemDimensions Form */
    this.itemDimensionsForm = fb.group({
      length: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      width: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      height: [0, [Validators.min(0), Validators.max(12000), Validators.pattern('[0-9]')]],
      weight: [0, [Validators.min(0), Validators.max(12000)]]
    })
    /***************************************************** create product Form */
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
      packageAmount: [1, [Validators.min(1), Validators.max(10000)]],
      packageDimensions: this.packageDimensionsForm,
      itemDimensions: this.itemDimensionsForm,
      stockCount: [1, [Validators.required, Validators.min(0), Validators.max(9999)]],
      storeCount: [1, [Validators.required, Validators.min(0), Validators.max(9999)]],
      provider: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      photo: [{value: [''], disabled: true}]
    })
    /***************************************************** productFilter  Form */
    this.productFilterForm = fb.group({
      // title: ['all', [Validators.minLength(3), Validators.maxLength(50)]],
      // accountingType: ['', [Validators.required]],
      brand: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      // level: ['', [Validators.required]],
      category: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      // // code: [0, [Validators.min(0)]],
      // countryOfManufacture: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      // discount: [0, [Validators.min(0), Validators.max(0.99)]],
      // originalPrice: [0.1, [Validators.required, Validators.min(0.1), Validators.max(99999)]],
      // price: [0.1, [Validators.required, Validators.min(0.1), Validators.max(99999)]],
      // equipment: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      // shortCharacteristics: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      // fullCharacteristics: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      // shortDescription: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      // fullDescription: ['', [Validators.minLength(0), Validators.maxLength(9999)]],
      // newFlag: [false],
      // promoFlag: [false],
      // overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
      // packageAmount: [1, [Validators.min(1), Validators.pattern('[0-9]')]],
      // packageDimensions: this.packageDimensionsForm,
      // itemDimensions: this.itemDimensionsForm,
      // stockCount: [1, [Validators.required, Validators.min(0), Validators.max(9999), Validators.pattern('[0-9]')]],
      // storeCount: [1, [Validators.required, Validators.min(0), Validators.max(9999), Validators.pattern('[0-9]')]],
      // provider: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      // photo: [{value: [''], disabled: true}]
    })
    /***************************************************** create product CSV Form */
    this.createProductCSV = fb.group({
      file_name: [{value: '', disabled: true}]
    })
  }


  ngOnInit(): void {
    this.productFilterForm.valueChanges.subscribe(res => {
      this.productFilter = Object.fromEntries(Object.entries(res).filter(([n, v]) => !!v));
      console.log(this.productFilter); //TODO
    })
  }

  ngAfterViewInit(): any {
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

  onCreateProductsFromCSV() {
    this.productAction = ProductActionEnum.CREATE_PRODUCT_FROM_CSV;
    this.createProductCSV.controls['file_name'].setValue('')
    this.csvFile = 0;
  }

  onChangeCsvFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length) {
      this.csvFile = fileList[0];
      this.createProductCSV.controls['file_name'].setValue(this.csvFile.name);
    }
  }

  onSubmitCreateProductsFromCSV() {
    if (!this.csvFile) {
      alert('No file selected');
      return;
    }
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
        fileSaver.saveAs(res, 'product.csv');

      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      })
  }//TODO

  onProductCreate() {
    this.productMenuAction = ProductMenuActionEnum.CREATE_PRODUCT_MENU;
  }

  onProductEdit() {
    this.productMenuAction = ProductMenuActionEnum.EDIT_PRODUCT_MENU;
    this.onChangeProductFilterForm();
  }

  onChangeProductFilterForm() {
    console.log(this.productFilter);
    this.productService.getProductsByFilter(this.productFilter)
      .subscribe(res => {
        this.products = res;
        this.listProductCategory = Array.from(new Set(this.products.map((value) => value.category).sort()));
        this.listProductBrand = Array.from(new Set(this.products.map((value) => value.brand).sort()));

      }, error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      });
  }

  onCancelFilters() {
    this.productFilter = {};
    this.onChangeProductFilterForm();
  }

  onAddPhotos() {
    this.productAction = ProductActionEnum.ADD_PRODUCT_PHOTOS;
  }

  onItemEdit(item: IProduct) {
    this.productMenuAction = ProductMenuActionEnum.EDIT_ITEM_PRODUCT_MENU;
    this.productService.getProduct(item.id).subscribe(res => {
        this.selectedProduct = res;
        console.log(res);
        // if (this.findProductInCategory(this.selectedProduct.category, this.subSubCategories)) {
        //   this.productForm.controls['level'].setValue('subSubCategory');
        //   this.categoriesTitleList.length = 0;
        //   for (let category of this.subSubCategories) {
        //     this.categoriesTitleList.push(category.title);
        //   }
        //   this.productForm.controls['category'].patchValue(this.selectedProduct.category);
        //
        //
        // }

        this.setValuesToProductForm();

      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      });
    // this.selectedProduct = item;
    this.productForm.controls['countryOfManufacture'].disable();
    this.productForm.controls['category'].disable();

  }

  setValuesToProductForm() {
    this.productForm.controls['title'].setValue(this.selectedProduct.title);
    this.productForm.controls['accountingType'].setValue(this.selectedProduct.accountingType);
    this.productForm.controls['brand'].setValue(this.selectedProduct.brand);
    // this.productForm.controls['level'].setValue('subSubCategory');
    this.productForm.controls['category'].patchValue(this.selectedProduct.category);
    this.productForm.controls['countryOfManufacture'].patchValue(this.selectedProduct.countryOfManufacture);
    this.productForm.controls['discount'].setValue(this.selectedProduct.discount);
    this.productForm.controls['originalPrice'].setValue(this.selectedProduct.originalPrice);
    this.productForm.controls['equipment'].setValue(this.selectedProduct.equipment);
    this.productForm.controls['fullCharacteristics'].setValue(this.selectedProduct.fullCharacteristics);
    this.productForm.controls['fullDescription'].setValue(this.selectedProduct.fullDescription);
    this.productForm.controls['newFlag'].setValue(this.selectedProduct.newFlag);
    this.productForm.controls['overview_url'].setValue(this.selectedProduct.overview_url);
    this.productForm.controls['packageAmount'].setValue(this.selectedProduct.packageAmount);
    this.packageDimensionsForm.controls['length'].setValue(this.selectedProduct.packageDimensions?.length);
    this.packageDimensionsForm.controls['width'].setValue(this.selectedProduct.packageDimensions?.width);
    this.packageDimensionsForm.controls['height'].setValue(this.selectedProduct.packageDimensions?.height);
    this.packageDimensionsForm.controls['weight'].setValue(this.selectedProduct.packageDimensions?.weight);
    this.itemDimensionsForm.controls['length'].setValue(this.selectedProduct.itemDimensions?.length);
    this.itemDimensionsForm.controls['width'].setValue(this.selectedProduct.itemDimensions?.width);
    this.itemDimensionsForm.controls['height'].setValue(this.selectedProduct.itemDimensions?.height);
    this.itemDimensionsForm.controls['weight'].setValue(this.selectedProduct.itemDimensions?.weight);
    this.productForm.controls['photo'].setValue(this.selectedProduct.photo);
    this.productForm.controls['price'].setValue(this.selectedProduct.price);
    this.productForm.controls['promoFlag'].setValue(this.selectedProduct.promoFlag);
    this.productForm.controls['provider'].setValue(this.selectedProduct.provider);
    this.productForm.controls['shortCharacteristics'].setValue(this.selectedProduct.shortCharacteristics);
    this.productForm.controls['shortDescription'].setValue(this.selectedProduct.shortDescription);
    this.productForm.controls['stockCount'].setValue(this.selectedProduct.stockCount);
    this.productForm.controls['storeCount'].setValue(this.selectedProduct.storeCount);
    this.productForm.controls['title'].setValue(this.selectedProduct.title);


  }

  compareCountry(o1: any, o2: any): boolean {
    console.log('compareCountry');
    console.log((o1 && o2));
    return o1 && o2 ? o1 === o2 : o1 === o2;
    ;
  }

  compareCategory(o1: any, o2: any): boolean {
    console.log('compareCategory');
    console.log(o1, o2);
    return o1.title == o2.title;
  }

  findProductInCategory(productCategory: string, category: ICategory[] | ISubCategory[] | ISubSubCategory[]): boolean {
    // console.log('findProductInCategory================================================================');
    console.log(productCategory);
    // console.log(category);
    // Object.entries(category).forEach(([k, v]) => {
    //   console.log(v);
    //  return  v.title == productCategory;
    // })
    const test = Object.entries(category).map((v, i) => v[1].title).filter(v => v == productCategory);
    console.log('console.log(Object.entries(category));');
    console.log(Object.entries(category));
    console.log(test);
    return test.length ? true : false;
    // const isExist =  Object.fromEntries(Object.entries(category).filter((v,i) => v[1].title== productCategory));
    // const isExist =  Object.fromEntries(Object.entries(category).filter(([k,v],i) => v.title== productCategory));
    //
    // console.log(isExist);
  }

  onChangeCountry(event: MatSelectChange) {
    console.log(event.value);
    this.productForm.controls['countryOfManufacture'].patchValue(event.value);
  }

  onChangeCategory(event: MatSelectChange) {
    console.log(event.value);
    this.productForm.controls['category'].patchValue(event.value);

  }
}
