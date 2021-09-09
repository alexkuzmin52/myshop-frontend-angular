import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {delay} from "rxjs/operators";
import {BreakpointObserver} from "@angular/cdk/layout";
import {IProduct} from "../../../product-models";
import {ICategory, ISubCategory, ISubSubCategory} from "../../../../category/category-models";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../product-services";
import {IProductFilterQuery} from "../../../product-models";
import {minMaxProductPriceHelper} from "../../../product-helpers";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.css']
})
export class ProductHomeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  products: IProduct[];

  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  subSubCategories: ISubSubCategory[] = [];

  productFilterForm: FormGroup;

  listProductCategory: Array<string> = [''];
  listProductBrand: Array<string> = [''];

  productFilter: IProductFilterQuery = {};

  minMaxPrice: { min: number, max: number };

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMTY1NDUsImV4cCI6MTYzNjk1NjU0NX0.0B0nGk9yZZc2zO0Butx8J6ugMFkc_ddhi1Hwe-UobjE';

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private productService: ProductService,
              private router: Router,
              private menuToggleObserver: BreakpointObserver) {
    this.categories = activatedRoute.snapshot.data.data[0];
    this.subCategories = activatedRoute.snapshot.data.data[1];
    this.subSubCategories = activatedRoute.snapshot.data.data[2];
    this.products = activatedRoute.snapshot.data.data[3];
    this.minMaxPrice = minMaxProductPriceHelper(this.products);
    this.listProductCategory = Array.from(new Set(this.products.map((value) => value.category).sort()));
    this.listProductBrand = Array.from(new Set(this.products.map((value) => value.brand).sort()));

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
    this.productFilterForm.valueChanges.subscribe(res => {
      this.productFilter = Object.fromEntries(Object.entries(res).filter(([k, v]) => !!v));
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

  onItemEdit(item: IProduct) {
    this.router.navigate(['/product/edit'], {queryParams: {id: item.id}});
  }

  onChangeProductFilterForm() {
    this.productService.getProductsByFilter(this.productFilter)
      .subscribe(res => {
        this.products = res;
        this.listProductCategory = Array.from(new Set(this.products.map((value) => value.category).sort()));
        this.listProductBrand = Array.from(new Set(this.products.map((value) => value.brand).sort()));

        if (!this.productFilterForm.get('priceGte')?.value) {
          this.productFilterForm.controls['priceGte'].patchValue(this.minMaxPrice.min);
          this.productFilterForm.controls['priceLte'].patchValue(this.minMaxPrice.max);
        }
      }, error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      });

  }

  onCancelFilters() {
    this.productFilter = {};
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

  onHome() {
    this.router.navigate(['']);
  }

  onProductCreate() {
    this.router.navigate(['/product/create']);
  }

  onProductEdit() {
    // this.router.navigate(['/product/edit']);
  }

  onItemDelete(id: number) {
    this.productService.deleteProduct(id, this.token).subscribe(res => {
      console.log(res);
    })
  }
}
