/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

// Angular core imports.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing components, first "global/common" components.
import { HomeComponent } from './components/home/home.component';

// Then importing all CRUD components.
import { LanguagesComponent } from './components/languages/languages.component';
import { DiagnosticsComponent } from './components/diagnostics/diagnostics.component';
import { TranslationsComponent } from './components/translations/translations.component';


const routes: Routes = [

  // First common/global routes.
  { path: '', component: HomeComponent },

  // Then routes for all CRUD components.
  { path: 'languages', component: LanguagesComponent },
  { path: 'diagnostics', component: DiagnosticsComponent },
  { path: 'translations', component: TranslationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
