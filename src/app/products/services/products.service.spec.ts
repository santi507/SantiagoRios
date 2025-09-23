import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ProductsService } from './products.service';
import { Product, ProductsResponse } from '../models/product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });

    service = TestBed.inject(ProductsService);
  });

  describe('getProducts', () => {
    it('should call GET /bp/products and return response', (done) => {
      const mockResponse: ProductsResponse = {
        data: [
          {
            id: '1',
            name: 'mockName',
            description: 'mockDescription',
            logo: 'mockLogo',
            date_release: 'mockDateRelease',
            date_revision: 'mockDateRevision',
          },
        ],
      };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.getProducts().subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(httpClientMock.get).toHaveBeenCalledWith('/bp/products');
        done();
      });
    });

    it('should handle error', (done) => {
      httpClientMock.get.mockReturnValue(
        throwError(() => ({ status: 500, message: 'Server Error' }))
      );

      service.getProducts().subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toContain('Server returned code: 500');
          done();
        },
      });
    });
  });

  describe('getProductById', () => {
    it('should call GET /bp/products/:id', (done) => {
      const product: Product = {
        id: '123',
        name: 'Laptop',
        description: 'Laptop description',
        logo: 'laptop-logo.png',
        date_release: '2023-01-01',
        date_revision: '2024-01-01',
      };
      httpClientMock.get.mockReturnValue(of(product));

      service.getProductById('123').subscribe((res) => {
        expect(res).toEqual(product);
        expect(httpClientMock.get).toHaveBeenCalledWith('/bp/products/123');
        done();
      });
    });
  });

  describe('createProduct', () => {
    it('should call POST /bp/products with body', (done) => {
      const product: Product = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        logo: 'test-logo.png',
        date_release: '2023-01-01',
        date_revision: '2024-01-01',
      };
      httpClientMock.post.mockReturnValue(of(product));

      service.createProduct(product).subscribe((res) => {
        expect(res).toEqual(product);
        expect(httpClientMock.post).toHaveBeenCalledWith(
          '/bp/products',
          product
        );
        done();
      });
    });
  });

  describe('updateProduct', () => {
    it('should call PUT /bp/products/:id with body', (done) => {
      const product: Product = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated description',
        logo: 'updated-logo.png',
        date_release: '2023-01-01',
        date_revision: '2024-01-01',
      };
      httpClientMock.put.mockReturnValue(of(product));

      service.updateProduct('1', product).subscribe((res) => {
        expect(res).toEqual(product);
        expect(httpClientMock.put).toHaveBeenCalledWith(
          '/bp/products/1',
          product
        );
        done();
      });
    });
  });

  describe('deleteProduct', () => {
    it('should call DELETE /bp/products/:id', (done) => {
      httpClientMock.delete.mockReturnValue(of({}));

      service.deleteProduct('1').subscribe((res) => {
        expect(res).toEqual({});
        expect(httpClientMock.delete).toHaveBeenCalledWith('/bp/products/1');
        done();
      });
    });
  });

  describe('checkIdUniqueness', () => {
    it('should return true when id does not exist', (done) => {
      const mockResponse: ProductsResponse = {
        data: [
          {
            id: '2',
            name: 'Another Product',
            description: 'Desc',
            logo: '',
            date_release: '',
            date_revision: '',
          },
        ],
      };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.checkIdUniqueness('1').subscribe((isUnique) => {
        expect(isUnique).toBe(true);
        done();
      });
    });

    it('should return false when id exists', (done) => {
      const mockResponse: ProductsResponse = {
        data: [
          {
            id: '1',
            name: 'Existing',
            description: '',
            logo: '',
            date_release: '',
            date_revision: '',
          },
        ],
      };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.checkIdUniqueness('1').subscribe((isUnique) => {
        expect(isUnique).toBe(false);
        done();
      });
    });
  });
});
