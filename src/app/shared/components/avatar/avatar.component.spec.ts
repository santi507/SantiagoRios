import { render, screen } from '@testing-library/angular';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  it('should render the first two letters of the provided text in uppercase', async () => {
    await render(AvatarComponent, {
      componentProperties: {
        text: 'financial products',
      },
    });
    const avatarText = screen.getByText('FI');

    expect(avatarText).toBeInTheDocument();
  });

  it('should render with a default text string if no input is provided', async () => {
    await render(AvatarComponent);

    const avatarElement = screen.getByText('DE');

    expect(avatarElement).toBeInTheDocument();
  });
});
