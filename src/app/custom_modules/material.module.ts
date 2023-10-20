import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

const MaterialComponents = [
  MatIconModule,
  MatCardModule
];

@NgModule({
  imports: [
    MaterialComponents,
  ],
  exports: [MaterialComponents],
  providers: [],
})
export class MaterialModule {}
