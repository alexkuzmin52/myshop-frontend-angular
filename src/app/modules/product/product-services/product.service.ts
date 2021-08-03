import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProduct} from "../product-models/product-interface";
import {ProductUrlEnum} from "../product-constants/product-url-enum";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts = ():Observable<IProduct[]> => {
    return this.http.get<IProduct[]>(ProductUrlEnum.PRODUCT);
  }
}
