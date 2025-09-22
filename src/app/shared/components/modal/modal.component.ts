import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title: string = 'Confirmación';
  @Input() message: string =
    '¿Estás seguro de que quieres realizar esta acción?';
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor() {}

  onConfirm() {
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }
}
