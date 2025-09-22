import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() headers: string[] = [];
  @Input() propertyNames: string[] = [];
  @Input() customCellTemplates: { [key: string]: TemplateRef<any> } = {};

  totalResults: number = 0;

  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  displayedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.totalResults = this.data.length;
      this.totalPages = Math.ceil(this.totalResults / this.pageSize);
      this.updateDisplayedData();
    }
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.totalPages = Math.ceil(this.totalResults / this.pageSize);
    this.currentPage = 1;
    this.updateDisplayedData();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedData();
    }
  }

  private updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.data.slice(startIndex, endIndex);
    this.totalResults = this.displayedData.length;
  }
}
