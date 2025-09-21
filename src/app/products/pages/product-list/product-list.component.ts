import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

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

  @ViewChild('logoCellTemplate') logoCellTemplate!: TemplateRef<any>;

  tableHeaders: string[] = [
    'Logo',
    'Nombre del producto',
    'Descripción',
    'Fecha de liberación',
    'Fecha de reestructuración',
  ];
  tablePropertyNames: string[] = [
    'logo',
    'name',
    'description',
    'date_release',
    'date_revision',
  ];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.filteredProducts = this.products;
      },
      error: (error) => {
        console.error('Error fetching products', error);
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
}
