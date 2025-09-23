import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  it('should render the banner with the correct title', async () => {
    await render(AppComponent, {
      imports: [SharedModule],
      providers: [provideRouter([])],
    });

    const bannerElement = screen.getByRole('heading', { name: /Banco/i });
    expect(bannerElement).toBeInTheDocument();
  });

  it('should render a router outlet element', async () => {
    await render(AppComponent, {
      imports: [SharedModule],
      providers: [provideRouter([])],
    });

    const routerOutletElement = document.querySelector('router-outlet');
    expect(routerOutletElement).toBeInTheDocument();
  });
});
