import { render, screen, fireEvent } from '@testing-library/angular';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  it('should render correct message', async () => {
    await render(ModalComponent, {
      componentProperties: {
        message: 'Are you sure you want to delete this item?',
      },
    });

    const messageElement = screen.getByText(
      'Are you sure you want to delete this item?'
    );
    expect(messageElement).toBeInTheDocument();
  });

  it('should emit a confirm event when the confirm button is clicked', async () => {
    const mockConfirm = jest.fn();

    await render(ModalComponent, {
      componentProperties: {
        confirm: {
          emit: mockConfirm,
        } as any,
      },
    });

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.click(confirmButton);

    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it('should emit a close event when the cancel button is clicked', async () => {
    const mockClose = jest.fn();

    await render(ModalComponent, {
      componentProperties: {
        close: {
          emit: mockClose,
        } as any,
      },
    });

    const closeButton = screen.getByRole('button', { name: 'Cancelar' });

    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
