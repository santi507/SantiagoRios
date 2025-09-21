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
  displayedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.totalResults = this.data.length;
      this.updateDisplayedData();
    }
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.updateDisplayedData();
  }

  private updateDisplayedData() {
    this.displayedData = this.data.slice(0, this.pageSize);
    this.totalResults = this.displayedData.length;
  }
}
