import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ProductFormComponent } from './product-form.component';
import { ProductsService } from '../../services/products.service';
import { Component, Input } from '@angular/core';

// Mock de ActivatedRoute para simular parámetros de ruta
class MockActivatedRoute {
  params = of({});
}

// Mock de app-form-errors para evitar errores de compilación
@Component({ standalone: false, selector: 'app-form-errors', template: '' })
class MockFormErrorsComponent {
  @Input() control: any;
}

// Mock de los servicios para aislar el componente
const productsServiceMock = {
  checkIdUniqueness: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
};

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductFormComponent, MockFormErrorsComponent],
      providers: [
        FormBuilder,
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;

    productsServiceMock.checkIdUniqueness.mockReturnValue(of(true));
    productsServiceMock.getProductById.mockReturnValue(of({}));
    productsServiceMock.createProduct.mockReturnValue(of({}));
    productsServiceMock.updateProduct.mockReturnValue(of({}));
    routerMock.navigate.mockReset();
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    fixture.detectChanges();
  });

  it('should create the component and form', () => {
    expect(component).toBeTruthy();
    expect(component.productForm).toBeDefined();
  });

  describe('Form validations', () => {
    it('should initialize form with default values and be invalid', () => {
      const idInput = screen.getByLabelText(/ID/i) as HTMLInputElement;
      const nameInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement;

      expect(idInput.value).toBe('');
      expect(nameInput.value).toBe('');
      expect(component.productForm.valid).toBeFalsy();
    });

    it('should mark form fields as invalid if they are too short', async () => {
      const idInput = screen.getByRole('textbox', { name: /id/i });
      const descriptionInput = screen.getByRole('textbox', {
        name: /descripción/i,
      });

      await fireEvent.input(idInput, { target: { value: 'ab' } });
      await fireEvent.input(descriptionInput, { target: { value: 'short' } });

      await fireEvent.blur(idInput);
      await fireEvent.blur(descriptionInput);

      fixture.detectChanges();

      await waitFor(() => {
        expect(idInput.classList.contains('is-invalid')).toBeTruthy();
        expect(descriptionInput.classList.contains('is-invalid')).toBeTruthy();
      });

      expect(
        component.productForm.get('id')?.hasError('minlength')
      ).toBeTruthy();
      expect(
        component.productForm.get('description')?.hasError('minlength')
      ).toBeTruthy();
    });

    it('should mark date_release as invalid if it is in the past', () => {
      const dateReleaseInput = screen.getByLabelText(
        /Fecha de Liberación/i
      ) as HTMLInputElement;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formattedYesterday = yesterday.toISOString().split('T')[0];

      fireEvent.input(dateReleaseInput, {
        target: { value: formattedYesterday },
      });

      expect(
        component.productForm
          .get('date_release')
          ?.hasError('dateGreaterOrEqual')
      ).toBeTruthy();
    });
  });

  describe('Async validation', () => {
    it('should mark id as valid if it is unique', fakeAsync(() => {
      productsServiceMock.checkIdUniqueness.mockReturnValue(of(true));
      const idInput = screen.getByLabelText(/id/i) as HTMLInputElement;

      fireEvent.input(idInput, { target: { value: 'unique-id' } });
      tick(500);
      expect(idInput.classList.contains('is-invalid')).toBeFalsy();
    }));

    it('should mark id as invalid if it is not unique', fakeAsync(() => {
      productsServiceMock.checkIdUniqueness.mockReturnValue(of(false));
      const idInput = screen.getByLabelText(/ID/i) as HTMLInputElement;

      fireEvent.input(idInput, { target: { value: 'not-unique-id' } });
      tick(500);
      fixture.detectChanges();

      expect(idInput.classList.contains('is-invalid')).toBeTruthy();
    }));
  });

  describe('Form behavior', () => {
    it('should update date_revision when date_release changes', () => {
      const dateReleaseInput = screen.getByLabelText(
        /Fecha de Liberación/i
      ) as HTMLInputElement;
      const dateRevisionInput = screen.getByLabelText(
        /Fecha de Revisión/i
      ) as HTMLInputElement;
      const testDate = '2024-01-01';
      const expectedRevisionDate = '2025-01-01';

      fireEvent.input(dateReleaseInput, { target: { value: testDate } });
      expect(dateRevisionInput.value).toBe(expectedRevisionDate);
    });

    it('should load product data for editing', async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [ProductFormComponent, MockFormErrorsComponent],
        providers: [
          FormBuilder,
          { provide: ProductsService, useValue: productsServiceMock },
          { provide: Router, useValue: routerMock },
          {
            provide: ActivatedRoute,
            useValue: { params: of({ id: 'test-id' }) },
          },
        ],
      }).compileComponents();

      const editFixture = TestBed.createComponent(ProductFormComponent);
      const editComponent = editFixture.componentInstance;

      const mockProduct = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'logo.png',
        date_release: '2023-01-01',
        date_revision: '2024-01-01',
      };
      productsServiceMock.getProductById.mockReturnValue(of(mockProduct));

      editFixture.detectChanges();

      await waitFor(() => {
        expect(productsServiceMock.getProductById).toHaveBeenCalledWith(
          'test-id'
        );
        expect(editComponent.productForm.get('id')?.disabled).toBe(true);
      });
    });

    it('should reset the form', async () => {
      const idInput = screen.getByLabelText(/ID/i) as HTMLInputElement;
      const resetButton = screen.getByRole('button', { name: /Reiniciar/i });

      fireEvent.input(idInput, { target: { value: 'some-id' } });
      expect(idInput.value).toBe('some-id');

      fireEvent.click(resetButton);
      expect(idInput.value).toBe('');
    });
  });

  describe('Form submission', () => {
    it('should create a new product', fakeAsync(async () => {
      const idInput = screen.getByRole('textbox', { name: /id/i });
      const nameInput = screen.getByRole('textbox', { name: /nombre/i });
      const descriptionInput = screen.getByRole('textbox', {
        name: /descripción/i,
      });
      const logoInput = screen.getByRole('textbox', { name: /logo/i });
      const dateReleaseInput = fixture.nativeElement.querySelector(
        'input[formcontrolname="date_release"]'
      );
      const submitButton = screen.getByRole('button', { name: /Enviar/i });

      fireEvent.input(idInput, { target: { value: 'new-id' } });
      fireEvent.blur(idInput);
      fireEvent.input(nameInput, { target: { value: 'New Product' } });
      fireEvent.blur(nameInput);
      fireEvent.input(descriptionInput, {
        target: { value: 'New product description' },
      });
      fireEvent.blur(descriptionInput);
      fireEvent.input(logoInput, { target: { value: 'logo.jpg' } });
      fireEvent.blur(logoInput);
      fireEvent.input(dateReleaseInput, { target: { value: '2028-05-20' } });
      fireEvent.blur(dateReleaseInput);

      fixture.detectChanges();

      productsServiceMock.checkIdUniqueness.mockReturnValue(of(true));
      tick(500);
      fixture.detectChanges();

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      fireEvent.click(submitButton);

      expect(productsServiceMock.createProduct).toHaveBeenCalled();
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'Producto creado exitosamente.'
        );
      });
    }));

    it('should show error message if product creation fails', fakeAsync(async () => {
      const idInput = screen.getByRole('textbox', { name: /id/i });
      const nameInput = screen.getByRole('textbox', { name: /nombre/i });
      const descriptionInput = screen.getByRole('textbox', {
        name: /descripción/i,
      });
      const logoInput = screen.getByRole('textbox', { name: /logo/i });
      const dateReleaseInput = fixture.nativeElement.querySelector(
        'input[formcontrolname="date_release"]'
      );
      const submitButton = screen.getByRole('button', { name: /Enviar/i });

      fireEvent.input(idInput, { target: { value: 'new-id' } });
      fireEvent.blur(idInput);
      fireEvent.input(nameInput, { target: { value: 'New Product' } });
      fireEvent.blur(nameInput);
      fireEvent.input(descriptionInput, {
        target: { value: 'New product description' },
      });
      fireEvent.blur(descriptionInput);
      fireEvent.input(logoInput, { target: { value: 'logo.jpg' } });
      fireEvent.blur(logoInput);
      fireEvent.input(dateReleaseInput, { target: { value: '2028-05-20' } });
      fireEvent.blur(dateReleaseInput);

      fixture.detectChanges();

      productsServiceMock.checkIdUniqueness.mockReturnValue(of(true));
      tick(500);
      fixture.detectChanges();

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      productsServiceMock.createProduct.mockReturnValue(
        throwError(() => new Error('Server error'))
      );
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'Error al agregar el producto. Por favor, revisa el ID o intenta de nuevo.'
        );
      });
    }));
  });
});
