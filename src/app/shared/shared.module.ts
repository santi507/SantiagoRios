import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { TableComponent } from './components/table/table.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorsComponent } from './components/form-errors/form-errors.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    BannerComponent,
    TableComponent,
    AvatarComponent,
    FormErrorsComponent,
    ModalComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    BannerComponent,
    TableComponent,
    AvatarComponent,
    FormErrorsComponent,
    ModalComponent,
  ],
})
export class SharedModule {}
