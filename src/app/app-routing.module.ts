/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

// Angular core imports.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Application specific component imports.
import { HomeComponent } from './components/home/home.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { StatisticsComponent as StatisticsComponent } from './components/statistics/statistics.component';


const routes: Routes = [

  // First common/global routes.
  { path: '', component: HomeComponent },

  // Then routes for all CRUD components.
  { path: 'languages', component: LanguagesComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'translations', component: TranslationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
