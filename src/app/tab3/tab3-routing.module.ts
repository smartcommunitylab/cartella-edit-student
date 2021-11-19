import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';
import { EsperienzaDettaglioComponent } from './actions/esperienza-dettaglio/esperienza-dettaglio.component';
import { DocumentUploadModalComponent } from './actions/documento-upload-modal/document-upload-modal.component';
import { ValutazioneStudenteComponent } from './actions/valutazione-studente/valutazione-studente.component';

const routes: Routes = [
  { path: '', component: Tab3Page },
  { path: 'detail/:id', component: EsperienzaDettaglioComponent },
  { path: 'valutazione/esperiezna/:id', component: ValutazioneStudenteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {
  static components = [
    Tab3Page,
    EsperienzaDettaglioComponent,
    DocumentUploadModalComponent,
    ValutazioneStudenteComponent,
  ];
}
