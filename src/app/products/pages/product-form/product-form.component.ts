import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { map, Observable, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  formTitle: string = 'Formulario de Registro';
  productForm!: FormGroup;
  isEditing: boolean = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      if (this.productId) {
        this.isEditing = true;
        this.loadProductData(this.productId);
      }
    });
  }

  initForm() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.productForm = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [this.validateIdUniqueness()],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateGreaterOrEqual(today)]],
      date_revision: [{ value: '', disabled: true }, Validators.required],
    });

    this.productForm.get('date_release')?.valueChanges.subscribe((date) => {
      this.updateDateRevision(date);
    });
  }

  loadProductData(id: string): void {
    this.productsService.getProductById(id).subscribe((product) => {
      this.productForm.patchValue(product);
      this.productForm.get('id')?.disable();
    });
  }

  dateGreaterOrEqual(minDate: Date) {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < minDate) {
        return { dateGreaterOrEqual: true };
      }
      return null;
    };
  }

  updateDateRevision(releaseDate: string): void {
    if (releaseDate) {
      const date = new Date(releaseDate);
      date.setFullYear(date.getFullYear() + 1);
      const formattedDate = date.toISOString().split('T')[0];
      this.productForm.get('date_revision')?.setValue(formattedDate);
    }
  }

  validateIdUniqueness(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;
      if (!id) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.productsService.checkIdUniqueness(id)),
        map((isUnique) => (isUnique ? null : { uniqueId: true }))
      );
    };
  }

  resetForm() {
    this.productForm.reset({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: { value: '', disabled: true },
    });
  }

  onUpdate(): void {
    if (this.productForm.valid) {
      const updatedProduct = this.productForm.getRawValue();
      this.productsService
        .updateProduct(this.productId!, updatedProduct)
        .subscribe({
          next: () => {
            alert('Producto actualizado exitosamente.');
            this.router.navigate(['/products']);
          },
          error: () => {
            alert('Error al actualizar el producto.');
          },
        });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onSubmit() {
    if (this.isEditing) {
      this.onUpdate();
    } else {
      if (this.productForm.valid) {
        const newProduct: Product = this.productForm.getRawValue();
        console.log(newProduct);

        this.productsService.createProduct(newProduct).subscribe({
          next: () => {
            alert('Producto creado exitosamente.');
            this.productForm.reset();
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 5000);
          },
          error: () => {
            alert(
              'Error al agregar el producto. Por favor, revisa el ID o intenta de nuevo.'
            );
          },
        });
      } else {
        this.productForm.markAllAsTouched();
      }
    }
  }
}
