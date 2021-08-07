import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IProduct} from "../../product-models/product-interface";
import {ProductActionEnum} from "../../product-constants/product-action-enum";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../product-services/product.service";

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

  csvFile: File | any = 0;

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTk2MDcxNjUsImV4cCI6MTYyODI0NzE2NX0.hVS9Esd4mVw8gHe97oUJTBd9VdyBCmddqJ1afHuS-Sk';


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private productService: ProductService) {
    this.products = activatedRoute.snapshot.data.products;
    console.log(this.products);

    this.createProductCSV = fb.group({
      file_name: [{value: '', disabled: true}]
      // csv_file: ['', [Validators.required]]
    })
  }

  onHome() {
    this.router.navigate([''])
  }

  ngOnInit(): void {
  }

  onCreateProductsFromCSV() {
    this.productAction = ProductActionEnum.CREATE_PRODUCT_FROM_CSV;

  }

  onChangeCsvFile(event: any) {
    let fileList:FileList = event.target.files;
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
}
