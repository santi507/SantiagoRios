import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: false,
  template: `
    <div class="avatar-circle">
      <span>{{ text | slice : 0 : 2 | uppercase }}</span>
    </div>
  `,
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() text: string = '';
}
