import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductsResponse } from '../models/product.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http
      .get<ProductsResponse>('/bp/products')
      .pipe(catchError(this.handleError));
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<Product>(`/bp/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  createProduct(product: Product) {
    return this.http
      .post('/bp/products', product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string, product: Product): Observable<any> {
    return this.http
      .put(`/bp/products/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<any> {
    return this.http
      .delete(`/bp/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  checkIdUniqueness(id: string): Observable<boolean> {
    return this.getProducts().pipe(
      map((response) => {
        const products = Array.isArray(response) ? response : response.data;
        const exists = products.some((product) => product.id === id);
        return !exists;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
