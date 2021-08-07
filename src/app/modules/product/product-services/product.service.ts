import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProduct} from "../product-models/product-interface";
import {ProductUrlEnum} from "../product-constants/product-url-enum";
import {HeaderRequestEnum} from "../product-constants/header-request-enum";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProducts = (): Observable<IProduct[]> => {
    return this.http.get<IProduct[]>(ProductUrlEnum.PRODUCT);
  }

  createProductsFromCSV(csvFile: File, token:string):Observable<IProduct[]> {
    const formData = new FormData();
    formData.append('csv_file', csvFile);
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
   return  this.http.post<IProduct[]>(ProductUrlEnum.PRODUCT_CREATE_FROM_CSV, formData, {headers:myHeaders})

  }
}
