// src/app/products/pages/product-list/product-list.component.spec.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideLocationMocks } from '@angular/common/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

/** Mock child components used by the template **/

@Component({
  selector: 'app-table',
  standalone: false,
  template: `
    <div data-testid="mock-table">
      <div *ngFor="let row of data" class="row-item">
        <span class="product-name">{{ row.name }}</span>
      </div>
    </div>
  `,
})
class MockTableComponent {
  @Input() data: any[] = [];
  @Input() headers: any;
  @Input() propertyNames: any;
  @Input() customCellTemplates: any;
  @Output() delete = new EventEmitter<number>();
}

@Component({
  standalone: false,
  selector: 'app-avatar',
  template: `<span class="mock-avatar">{{ text }}</span>`,
})
class MockAvatarComponent {
  @Input() text = '';
}

@Component({
  standalone: false,
  selector: 'app-modal',
  template: `
    <div data-testid="mock-modal">
      <p>{{ message }}</p>
      <button (click)="confirm.emit()">Confirm</button>
      <button (click)="close.emit()">Close</button>
    </div>
  `,
})
class MockModalComponent {
  @Input() message!: string;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}

/** Mock data & service **/
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop',
    description: 'Powerful laptop',
    date_release: '2023-01-01',
    date_revision: '2023-01-02',
    logo: '',
  },
  {
    id: '2',
    name: 'Phone',
    description: 'Smartphone device',
    date_release: '2023-02-01',
    date_revision: '2023-02-02',
    logo: '',
  },
];

const mockProductsService = {
  getProducts: jest.fn().mockReturnValue(of({ data: mockProducts })),
  deleteProduct: jest.fn().mockReturnValue(of({})),
};

describe('ProductListComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductsService.getProducts.mockReturnValue(of({ data: mockProducts }));
  });

  it('should fetch and display products', async () => {
    await render(ProductListComponent, {
      imports: [FormsModule],
      declarations: [
        MockTableComponent,
        MockAvatarComponent,
        MockModalComponent,
      ],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: ProductsService, useValue: mockProductsService },
      ],
    });

    expect(await screen.findByText('Laptop')).toBeTruthy();
    expect(screen.getByText('Phone')).toBeTruthy();

    expect(mockProductsService.getProducts).toHaveBeenCalled();
  });

  it('should filter products by search query', async () => {
    await render(ProductListComponent, {
      imports: [FormsModule],
      declarations: [
        MockTableComponent,
        MockAvatarComponent,
        MockModalComponent,
      ],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: ProductsService, useValue: mockProductsService },
      ],
    });

    const input = screen.getByPlaceholderText(/Buscar/i) as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'phone' } });

    expect(await screen.findByText('Phone')).toBeTruthy();
    expect(screen.queryByText('Laptop')).toBeNull();
  });

  it('should show no-results message on error', async () => {
    mockProductsService.getProducts.mockReturnValueOnce(
      throwError(() => new Error('Server error'))
    );

    await render(ProductListComponent, {
      imports: [FormsModule],
      declarations: [
        MockTableComponent,
        MockAvatarComponent,
        MockModalComponent,
      ],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: ProductsService, useValue: mockProductsService },
      ],
    });

    expect(
      await screen.findByText(/No se encontraron productos/i)
    ).toBeTruthy();
  });
});
