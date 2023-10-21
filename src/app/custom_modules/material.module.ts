import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

const MaterialComponents = [MatIconModule, MatButtonModule, MatDividerModule];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  providers: [],
})
export class MaterialModule {}
