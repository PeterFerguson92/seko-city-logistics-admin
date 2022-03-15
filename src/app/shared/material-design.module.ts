import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [MatIconModule, MatGridListModule, MatToolbarModule, MatSidenavModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatDividerModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatRadioModule, MatExpansionModule, MatProgressSpinnerModule,
    MatTooltipModule, MatDialogModule, MatStepperModule, MatCheckboxModule],
})
export class MaterialDesignModule { }
