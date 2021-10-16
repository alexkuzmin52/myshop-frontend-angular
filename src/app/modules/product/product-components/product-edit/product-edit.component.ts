import {ActivatedRoute, Router} from "@angular/router";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSelectChange} from "@angular/material/select";
import {MatSidenav} from "@angular/material/sidenav";
import {Subject} from "rxjs";
import {delay, map, takeUntil} from "rxjs/operators";

import {ICategory, ISubCategory, ISubSubCategory} from "../../../category";
import {IProduct} from "../../product-models";
import {ProductForm} from "../../product-form";
import {ProductService} from "../../product-services";
import {ProductTypeEnum} from "../../product-constants";
import {countriesList} from "../../countries-list";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  accountingType = [
    {value: ProductTypeEnum.COUNTED},
    {value: ProductTypeEnum.WEIGHTED}
  ];
  categoryLevel = [
    {level: 'category'},
    {level: 'subCategory'},
    {level: 'subSubCategory'},
  ]

  selectedAccountingType = ProductTypeEnum.COUNTED;
  selectedCategoryLevel: string = '';
  selectedProduct: IProduct | any = null;
  destroy$: Subject<boolean> = new Subject<boolean>();

  newEditForm = new ProductForm();
  productEditForm: FormGroup = this.newEditForm.productForm;
  packageDimensionsEditForm: FormGroup = this.newEditForm.packageDimensionsForm;
  itemDimensionsEditForm: FormGroup = this.newEditForm.itemDimensionsForm;
  deleteItemPhotoProductForm: FormGroup;

  photos: FileList | any = null;
  countries: Array<any> = countriesList;
  selectedProductPhotos: Array<any> = [];
  src: SafeResourceUrl = '';
  photoName: string = '';

  categoriesTitleList: Array<string> = [''];
  sourcePhotoFiles: Array<SafeResourceUrl> = [];
  addPhotoFlag: boolean = false;

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMTY1NDUsImV4cCI6MTYzNjk1NjU0NX0.0B0nGk9yZZc2zO0Butx8J6ugMFkc_ddhi1Hwe-UobjE';

  constructor(private menuToggleObserver: BreakpointObserver,
              private router: Router,
              private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) {
    this.deleteItemPhotoProductForm = fb.group({
      photoTitle: ['']
    })
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.productService.getProduct(+param.id)
        // .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.selectedProduct = res;
          this.setValuesToProductEditForm();
          this.getSelectedProductPhotos();
        })
    })
  }

  ngAfterViewInit() {
    this.menuToggleObserver
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe(res => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open()
        }
      })
  }

  ngOnDestroy() {
    console.log(this.destroy$);
    this.destroy$.next(true);
    console.log(this.destroy$);
    this.destroy$.complete();
  }

  onHome() {
    this.router.navigate(['']);
  }

  onCreate() {
    this.router.navigate(['product/create']);
  }

  onAllProduct() {
    this.router.navigate(['product']);
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

  onChangeCategory(event: MatSelectChange) {
    this.productEditForm.controls['category'].patchValue(event.value);
  }

  onChangeCountry(event: MatSelectChange) {
    this.productEditForm.controls['countryOfManufacture'].patchValue(event.value);
  }

  onChangeNewFlag(event: any) {
    this.productEditForm.controls['newFlag'].patchValue(event.checked);
  }

  onChangePromoFlag(event: any) {
    this.productEditForm.controls['newFlag'].patchValue(event.checked);
  }

  setValuesToProductEditForm() {
    this.productEditForm.controls['title'].setValue(this.selectedProduct.title);
    this.productEditForm.controls['accountingType'].setValue(this.selectedProduct.accountingType);
    this.productEditForm.controls['brand'].setValue(this.selectedProduct.brand);
    this.productEditForm.controls['category'].patchValue(this.selectedProduct.category);
    this.productEditForm.controls['countryOfManufacture'].patchValue(this.selectedProduct.countryOfManufacture);
    this.productEditForm.controls['discount'].setValue(this.selectedProduct.discount);
    this.productEditForm.controls['originalPrice'].setValue(this.selectedProduct.originalPrice);
    this.productEditForm.controls['equipment'].setValue(this.selectedProduct.equipment);
    this.productEditForm.controls['fullCharacteristics'].setValue(this.selectedProduct.fullCharacteristics);
    this.productEditForm.controls['fullDescription'].setValue(this.selectedProduct.fullDescription);
    this.productEditForm.controls['newFlag'].setValue(this.selectedProduct.newFlag);
    this.productEditForm.controls['overview_url'].setValue(this.selectedProduct.overview_url);
    this.productEditForm.controls['packageAmount'].setValue(this.selectedProduct.packageAmount);
    this.packageDimensionsEditForm.controls['length'].setValue(this.selectedProduct.packageDimensions?.length);
    this.packageDimensionsEditForm.controls['width'].setValue(this.selectedProduct.packageDimensions?.width);
    this.packageDimensionsEditForm.controls['height'].setValue(this.selectedProduct.packageDimensions?.height);
    this.packageDimensionsEditForm.controls['weight'].setValue(this.selectedProduct.packageDimensions?.weight);
    this.itemDimensionsEditForm.controls['length'].setValue(this.selectedProduct.itemDimensions?.length);
    this.itemDimensionsEditForm.controls['width'].setValue(this.selectedProduct.itemDimensions?.width);
    this.itemDimensionsEditForm.controls['height'].setValue(this.selectedProduct.itemDimensions?.height);
    this.itemDimensionsEditForm.controls['weight'].setValue(this.selectedProduct.itemDimensions?.weight);
    this.productEditForm.controls['photo'].setValue(this.selectedProduct.photo);
    this.productEditForm.controls['price'].setValue(this.selectedProduct.price);
    this.productEditForm.controls['promoFlag'].setValue(this.selectedProduct.promoFlag);
    this.productEditForm.controls['provider'].setValue(this.selectedProduct.provider);
    this.productEditForm.controls['shortCharacteristics'].setValue(this.selectedProduct.shortCharacteristics);
    this.productEditForm.controls['shortDescription'].setValue(this.selectedProduct.shortDescription);
    this.productEditForm.controls['stockCount'].setValue(this.selectedProduct.stockCount);
    this.productEditForm.controls['storeCount'].setValue(this.selectedProduct.storeCount);
    this.productEditForm.controls['title'].setValue(this.selectedProduct.title);
  }

  onSaveEdit(productEditForm: FormGroup) {
    delete productEditForm.value.level;
    this.productService.updateProduct(productEditForm.value, this.token, this.selectedProduct.id)
      // .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
          // console.log(res);
        },
        error => {
          console.log(error.error.message);
          alert(`error: ${error.error.message}`);
        })
  }

  onAddPhoto() {
    this.addPhotoFlag = true;
  }

  onChangePhotoFiles(event: any) {
    this.photos = event.target.files;
    if (!this.photos) {
      alert('No files selected');
      return;
    }
    for (let i = 0; i < this.photos.length; i++) {
      this.sourcePhotoFiles[i] = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.photos[i]));
    }
  }

  onSavePhoto() {
    this.productService.addPhotos(this.photos, this.selectedProduct.id, this.token)
      // .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
          console.log(res);
        },
        error => {
          console.log(error.error.message);
          alert(`error: ${error.error.message}`);
        });
    this.photos = null;
    this.sourcePhotoFiles = [];
    this.addPhotoFlag = false;
  }

  onCancelPhoto() {
    this.sourcePhotoFiles = [];
    this.addPhotoFlag = false;
  }

  getSelectedProductPhotos() {
    for (let i = 0; i < this.selectedProduct.photo.length; i++) {
      // console.log('*******************************************************');
      // console.log(this.selectedProduct.photo.length);
      // console.log(this.selectedProduct.photo[i]);
      //TODO нужен ли pipe ?
      this.productService.getProductPhotos(this.selectedProduct.id, this.selectedProduct.photo[i])
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
          this.photoName = this.selectedProduct.photo[i];
          this.selectedProductPhotos.push({
            src: this.src,
            photoName: this.photoName,
            photoTitle: this.selectedProduct.photo[i]
          });
        },
        error => {
          console.log(error.error.message);
          alert(`error: Photo ${i + 1} of ${this.selectedProduct.photo.length} not found`);
        })
    }
  }

  onDeleteItemPhoto(photoName: string) {
    this.productService.deletePhoto(this.selectedProduct.id, photoName, this.token).subscribe(res => {
        console.log(res);
      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      })
  }

  onChangeDiscount(event: any) {
    const discount = +event.target.value/100;
    // console.log( typeof (event.target.value));
    // console.log( typeof (discount));
    const price = this.productEditForm.get('originalPrice')?.value;
    console.log(typeof (price));
    const newPrice = Number(price * (1 - discount)).toFixed(2);
    this.productEditForm.controls['price'].patchValue(newPrice);
    if (discount>0) {
      this.productEditForm.controls['promoFlag'].patchValue(true);
    }
  }
}
