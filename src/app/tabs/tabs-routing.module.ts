import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService } from '../auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        canActivate: [AuthGuardService],
        loadChildren: '../tab1/tab1.module#Tab1PageModule'
      },
      {
        path: 'tab2',
        canActivate: [AuthGuardService],
        loadChildren: '../tab2/tab2.module#Tab2PageModule'
      },
      {
        path: 'tab3',
        canActivate: [AuthGuardService],
        loadChildren: '../tab3/tab3.module#Tab3PageModule'
      },
      {
        path: 'terms/:authorized',
        canActivate: [AuthGuardService],
        loadChildren: '../terms/terms.module#TermsModule'
      },
      {
        path: '',
        redirectTo: '/home/tab2',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/tab2',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
