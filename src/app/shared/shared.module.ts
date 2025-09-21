import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { TableComponent } from './components/table/table.component';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  declarations: [BannerComponent, TableComponent, AvatarComponent],
  imports: [CommonModule],
  exports: [BannerComponent, TableComponent, AvatarComponent],
})
export class SharedModule {}
