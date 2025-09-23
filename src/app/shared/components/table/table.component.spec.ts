import { render, screen, fireEvent } from '@testing-library/angular';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';

describe('TableComponent', () => {
  const mockData = [
    { id: '1', name: 'Product 1', value: 100 },
    { id: '2', name: 'Product 2', value: 200 },
    { id: '3', name: 'Product 3', value: 300 },
    { id: '4', name: 'Product 4', value: 400 },
    { id: '5', name: 'Product 5', value: 500 },
    { id: '6', name: 'Product 6', value: 600 },
    { id: '7', name: 'Product 7', value: 700 },
  ];
  const mockHeaders = ['ID', 'Name', 'Value'];
  const mockProperties = ['id', 'name', 'value'];

  beforeEach(async () => {
    await render(TableComponent, {
      imports: [CommonModule],
      componentProperties: {
        data: mockData,
        headers: mockHeaders,
        propertyNames: mockProperties,
      },
    });
  });

  it('should render the table headers correctly', () => {
    const tableHeaders = screen.getAllByRole('columnheader');
    expect(tableHeaders).toHaveLength(mockHeaders.length);
    expect(tableHeaders[0].textContent).toBe('ID');
    expect(tableHeaders[1].textContent).toBe('Name');
  });

  it('should show the correct number of results (default is 5)', () => {
    const totalResults = screen.getByText(/5 resultados/i);
    expect(totalResults).toBeInTheDocument();
  });

  it('should update the number of rows when page size is changed', () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '10' } });

    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(mockData.length + 1);
  });

  it('should go to the next page when the "»" button is clicked', () => {
    const nextButton = screen.getByRole('button', { name: '»' });
    fireEvent.click(nextButton);

    const displayedRows = screen.getAllByRole('row');
    expect(displayedRows).toHaveLength(3);

    expect(screen.getByText('Product 6')).toBeInTheDocument();
  });

  it('should go to the previous page when the "«" button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: '»' }));

    const previousButton = screen.getByRole('button', { name: '«' });
    fireEvent.click(previousButton);

    const firstRow = screen.getByText('Product 1');
    expect(firstRow).toBeInTheDocument();
  });
});
