import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { CreditsPage } from './actions/credits/credits.page';

const routes: Routes = [
  { path: '',  component: Tab1Page },
  { path: 'credits', component: CreditsPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {
  static components = [
    Tab1Page,
    CreditsPage,
  ];
}
