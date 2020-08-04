import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { GestionePresenzeGruppoPage } from './actions/gestione-presenze-gruppo/gestione-presenze-gruppo.page'

const routes: Routes = [
  { path: '', component: Tab2Page },
  { path: 'presenze/gruppo', component: GestionePresenzeGruppoPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {
  static components = [
    Tab2Page,
    GestionePresenzeGruppoPage,
  ];
}
