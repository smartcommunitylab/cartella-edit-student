import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { Tab3PageRoutingModule } from './tab3-routing.module'
import { DocumentUploadModalComponent } from './actions/documento-upload-modal/document-upload-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
    NgCircleProgressModule.forRoot({})
  ],
  entryComponents: [
    DocumentUploadModalComponent
  ],
  declarations: [Tab3PageRoutingModule.components]
})
export class Tab3PageModule {}
