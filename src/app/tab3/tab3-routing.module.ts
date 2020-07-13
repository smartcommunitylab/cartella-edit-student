import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';
// import { EsperienzaDettaglioComponent } from './actions/esperienza-dettaglio/esperienza-dettaglio.component';

const routes: Routes = [
  { path: '', component: Tab3Page },
  // { path: 'detail/:id', component: EsperienzaDettaglioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {
  static components = [
    Tab3Page,
    // EsperienzaDettaglioComponent,
  ];
}
