import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

const MaterialComponents = [
  
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
];


@NgModule({
  imports: [
    MaterialComponents,
  ],
  exports: [MaterialComponents],
  providers: [],
})
export class MaterialModule {}
