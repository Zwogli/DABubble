import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';

const MaterialComponents = [
  MatIconModule,
  MatExpansionModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  providers: [],
})
export class MaterialModule {}
