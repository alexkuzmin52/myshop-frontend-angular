import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IProduct} from "../../product-models/product-interface";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
products: IProduct[];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.products = activatedRoute.snapshot.data.products;
    console.log(this.products);
  }

  ngOnInit(): void {
  }

}
