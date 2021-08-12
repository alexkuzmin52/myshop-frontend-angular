import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProduct} from "../product-models/product-interface";
import {ProductUrlEnum} from "../product-constants/product-url-enum";
import {HeaderRequestEnum} from "../product-constants/header-request-enum";
import {ICategory, ISubCategory, ISubSubCategory} from "../../category/category-models";
import {CategoryUrlEnum} from "../../category/constants";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProducts = (): Observable<IProduct[]> => {
    return this.http.get<IProduct[]>(ProductUrlEnum.PRODUCT);
  }

  getCategories = (): Observable<ICategory[]> => {
    return this.http.get<ICategory[]>(CategoryUrlEnum.CATEGORY)
  }

  getSubCategories = (): Observable<ISubCategory[]> => {
    return this.http.get<ISubCategory[]>(CategoryUrlEnum.SUB_CATEGORY)
  }

  getSubSubCategories = (): Observable<ISubSubCategory[]> => {
    return this.http.get<ISubSubCategory[]>(CategoryUrlEnum.SUB_SUB_CATEGORY)
  }


  createProductsFromCSV = (csvFile: File, token: string): Observable<IProduct[]> => {
    const formData = new FormData();
    formData.append('csv_file', csvFile);
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return this.http.post<IProduct[]>(ProductUrlEnum.PRODUCT_CREATE_FROM_CSV, formData, {headers: myHeaders})

  }

  createProduct = (product: IProduct, token: string): Observable<IProduct> => {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return this.http.post<IProduct>(ProductUrlEnum.PRODUCT, product, {headers: myHeaders});

  }

  getProductCsvFile = (token: string):Observable<Blob> => {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return this.http.get(ProductUrlEnum.PRODUCT_GET_CSV, {headers: myHeaders, responseType: 'blob'});
  }
}
