import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  standalone: false,
  template: `
    @if (control && control.invalid && (control.dirty || control.touched)) {
    <div class="validation-error">
      @if (control.errors?.['required']) {
      <p>Este campo es requerido.</p>
      } @if (control.errors?.['minlength']) {
      <p>
        Mínimo {{ control.errors?.['minlength'].requiredLength }} caracteres.
      </p>
      } @if (control.errors?.['maxlength']) {
      <p>
        Máximo {{ control.errors?.['maxlength'].requiredLength }} caracteres.
      </p>
      } @if (control.errors?.['dateGreaterOrEqual']) {
      <p>La fecha debe ser igual o posterior a la fecha actual.</p>
      } @if (control.errors?.['uniqueId']) {
      <p>Este ID ya existe.</p>
      }
    </div>
    }
  `,
  styleUrl: './form-errors.component.scss',
})
export class FormErrorsComponent {
  @Input() control!: AbstractControl;
}
