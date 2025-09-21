import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<ProductsResponse>('/bp/products');
  }
}
