import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render the title', async () => {
    await render(AppComponent, {
      componentProperties: { title: 'Test Title' },
    });

    const title = screen.getByRole('heading', { name: 'Hello, Test Title' });
    expect(title).toBeTruthy();
  });
});
