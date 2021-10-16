import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {CategoryUrlEnum} from "../../category";
import {HeaderRequestEnum} from "../product-constants/header-request-enum";
import {ICategory, ISubCategory, ISubSubCategory} from "../../category";
import {IProduct} from "../product-models";
import {ProductUrlEnum} from "../product-constants";

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

  getProductCsvFile = (token: string): Observable<Blob> => {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return this.http.get(ProductUrlEnum.PRODUCT_GET_CSV, {headers: myHeaders, responseType: 'blob'});
  }

  getProductsByFilter = (filter: any): Observable<IProduct[]> => {
    let params = new HttpParams({fromObject: filter})
    return this.http.get<IProduct[]>(ProductUrlEnum.GET_PRODUCTS_BY_FILTER, {params: params});
  }

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(ProductUrlEnum.PRODUCT + `/${id}`);
  }

  updateProduct(product: Partial<IProduct>, token: string, id: number): Observable<IProduct> {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return this.http.put<IProduct>(ProductUrlEnum.PRODUCT + `/${id}`, product, {headers: myHeaders});
  }

  addPhotos(photos: FileList, id: number, token: string): Observable<any> {
    const formData = new FormData();

    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }

    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return this.http.post(ProductUrlEnum.PRODUCT_ADD_PHOTOS + `/${id}`, formData, {headers: myHeaders});
  }

  getProductPhotos(id: number, photoName: string): Observable<Blob> {
   return  this.http.get(ProductUrlEnum.PRODUCT_GET_PHOTOS + `/${id}/${photoName}`,{responseType: 'blob'});
  }

  deletePhoto(id: number, photoName: string, token:string): Observable<any> {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return  this.http.delete(ProductUrlEnum.PRODUCT_GET_PHOTOS + `/${id}/${photoName}`,{headers: myHeaders});
  }

  deleteProduct(id: number, token:string): Observable<any> {
    const myHeaders = new HttpHeaders().set(HeaderRequestEnum.AUTHORIZATION, token);
    return  this.http.delete(ProductUrlEnum.PRODUCT + `/${id}`,{headers: myHeaders});
  }
}
