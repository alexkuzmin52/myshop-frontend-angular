import {ActivatedRoute, Router} from "@angular/router";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {DomSanitizer} from "@angular/platform-browser";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatSidenav} from "@angular/material/sidenav";
import {Subject} from "rxjs";
import {delay, takeUntil} from "rxjs/operators";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICategory, ISubCategory, ISubSubCategory} from "../../../category";
import {IProductFilterQuery} from "../../product-models";
import {IProduct} from "../../product-models";
import {ProductService} from "../../product-services";
import {minMaxProductPriceHelper} from "../../product-helpers";

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})

export class ProductHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  products: IProduct[];
  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  subSubCategories: ISubSubCategory[] = [];

  listProductCategory: Array<string> = [''];
  listProductBrand: Array<string> = [''];

  productFilter: IProductFilterQuery = {};
  productFilterArray: Array<any> = [];
  productFilterForm: FormGroup;
  filterActionPriceGte: Boolean = false;
  filterActionPriceLte: Boolean = false;

  gridColumns = 4;
  minMaxPrice: { min: number, max: number };

  destroy$: Subject<boolean> = new Subject<boolean>();


  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMTY1NDUsImV4cCI6MTYzNjk1NjU0NX0.0B0nGk9yZZc2zO0Butx8J6ugMFkc_ddhi1Hwe-UobjE';

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private productService: ProductService,
              private router: Router,
              private menuToggleObserver: BreakpointObserver,
              private sanitizer: DomSanitizer) {
    this.categories = activatedRoute.snapshot.data.data[0];
    this.subCategories = activatedRoute.snapshot.data.data[1];
    this.subSubCategories = activatedRoute.snapshot.data.data[2];
    this.products = activatedRoute.snapshot.data.data[3];

    this.minMaxPrice = minMaxProductPriceHelper(this.products);

    this.listProductCategory = Array.from(new Set(this.products.map((value) => value.category).sort()));
    this.listProductBrand = Array.from(new Set(this.products.map((value) => value.brand).sort()));

    this.onGetAllPhotos();
    /***************************************************** productFilter  Form */
    this.productFilterForm = fb.group({
      brand: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      category: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      priceGte: [this.minMaxPrice.min, [Validators.required, Validators.min(this.minMaxPrice.min), Validators.max(this.minMaxPrice.max)]],
      priceLte: [this.minMaxPrice.max, [Validators.required, Validators.min(this.minMaxPrice.min), Validators.max(this.minMaxPrice.max)]],
      newFlag: [false],
      promoFlag: [false],
    })
  }

  ngOnInit(): void {
    this.productFilterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.productFilter = Object.fromEntries(Object.entries(res).filter(([k, v]) => !!v));
    });

    this.productFilterArray = Object.entries(this.productFilter);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

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

  onItemEdit(item: IProduct) {
    this.router.navigate(['/product/edit'], {queryParams: {id: item.id}});
  }

  onProductCreate() {
    this.router.navigate(['/product/create']);
  }

  onChangeProductFilterForm() {

    if (!this.filterActionPriceLte) {
      delete this.productFilter.priceLte;
    }
    if (!this.filterActionPriceGte) {
      delete this.productFilter.priceGte;
    }

    this.productFilterArray = Object.entries(this.productFilter);
    this.productService.getProductsByFilter(this.productFilter)
      .subscribe(res => {
        this.products = res;
        this.listProductCategory = Array.from(new Set(this.products.map((value) => value.category).sort()));
        this.listProductBrand = Array.from(new Set(this.products.map((value) => value.brand).sort()));
        this.onGetAllPhotos();
      });
  }

  onCancelFilters() {
    this.productFilterForm.reset();
    this.onChangeProductFilterForm();
  }

  onChangeNewFlag(event: MatCheckboxChange) {
    if (event.checked) {
      this.productFilterForm.controls['newFlag'].patchValue(true);
    } else {
      this.productFilterForm.controls['newFlag'].reset();
    }
    this.onChangeProductFilterForm();
  }

  onChangePromoFlag(event: MatCheckboxChange) {
    if (event.checked) {
      this.productFilterForm.controls['promoFlag'].patchValue(true);
    } else {
      this.productFilterForm.controls['promoFlag'].reset();
    }
    this.onChangeProductFilterForm();
  }

  onItemDelete(id: number) {
    this.productService.deleteProduct(id, this.token).subscribe(res => {
      console.log(res);
    },
      error => {
        console.log(error.error.message);
      })
  }

  uploadProductPhotos(product: IProduct) {
    product.photoSRC = [];
    if (product.photo != undefined && product.photo.length > 0) {
      for (let i = 0; i < product.photo.length; i++) {
        this.productService.getProductPhotos(product.id, product.photo[i]).subscribe(res => {
            const src = URL.createObjectURL(res);
            product.photoSRC[i] = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
          },
          error => {
            console.log(error.error.message);
          })
      }
    }
  }

  onGetAllPhotos() {
    for (let product of this.products) {
      this.uploadProductPhotos(product);
    }
  }

  onChangeProductFilterFormPriceGte() {
    this.filterActionPriceGte = true;
    this.onChangeProductFilterForm();
  }

  // TODO корректировать priceGte, priceLte как в userComponent
  onRemoveElemFilters(event: string) {
    switch (event[0]) {
      case 'category':
        this.productFilterForm.controls['category'].patchValue('');
        this.onChangeProductFilterForm();
        break;
      case 'brand':
        this.productFilterForm.controls['brand'].patchValue('');
        this.onChangeProductFilterForm();
        break;
      case 'priceGte':
        this.filterActionPriceGte = false;
        this.productFilterForm.controls['priceGte'].patchValue(this.minMaxPrice.min);
        this.onChangeProductFilterForm();
        break;
      case 'priceLte':
        this.filterActionPriceLte = false;
        this.productFilterForm.controls['priceLte'].patchValue(this.minMaxPrice.max);
        this.onChangeProductFilterForm();
        break;
      case 'newFlag':
        this.filterActionPriceLte = false;
        this.productFilterForm.controls['newFlag'].patchValue(false);
        this.onChangeProductFilterForm();
        break;
      case 'promoFlag':
        this.filterActionPriceLte = false;
        this.productFilterForm.controls['promoFlag'].patchValue(false);
        this.onChangeProductFilterForm();
        break;
      default:
        break;
    }
  }

  onChangeProductFilterFormPriceLte() {
    this.filterActionPriceLte = true;
    this.onChangeProductFilterForm();

  }
}
