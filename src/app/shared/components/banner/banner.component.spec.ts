import { render, screen } from '@testing-library/angular';

import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  it('should render the banner with provided title', async () => {
    await render(BannerComponent, {
      componentInputs: { title: 'Welcome to the Bank' },
    });

    expect(screen.getByRole('heading')).toHaveTextContent(
      'Welcome to the Bank'
    );
  });
});
