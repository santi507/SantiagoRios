import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  activeKebabMenuId: string | null = null;
  showModal = false;
  productToDelete: Product | null = null;
  isLoading = false;

  @ViewChild('logoCellTemplate') logoCellTemplate!: TemplateRef<any>;
  @ViewChild('actionsCellTemplate') actionsCellTemplate!: TemplateRef<any>;

  tableHeaders: string[] = [
    'Logo',
    'Nombre del producto',
    'Descripción',
    'Fecha de liberación',
    'Fecha de reestructuración',
    '',
  ];
  tablePropertyNames: string[] = [
    'logo',
    'name',
    'description',
    'date_release',
    'date_revision',
    'actions',
  ];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.productsService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.filteredProducts = this.products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.isLoading = false;
      },
    });
  }

  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  toggleKebabMenu(id: string): void {
    this.activeKebabMenuId = this.activeKebabMenuId === id ? null : id;
  }

  confirmDelete(product: Product): void {
    this.activeKebabMenuId = null;
    this.productToDelete = product;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productToDelete = null;
  }

  deleteProduct(): void {
    if (this.productToDelete) {
      this.productsService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          alert('Producto eliminado exitosamente.');
          this.closeModal();
          this.fetchProducts();
        },
        error: () => {
          alert('Error al eliminar producto');
          this.closeModal();
        },
      });
    }
  }
}
