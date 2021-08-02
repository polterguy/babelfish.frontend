/*
 * Automatically generated by Magic
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { SelectorComponent } from './helpers/selector/selector.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '@env/environment';
import { JwtModule } from '@auth0/angular-jwt';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { FormatDatePipe } from './pipes/format-date-pipe';

// Generated CRUD components here.
import { LanguagesComponent } from './components/languages/languages.component';
import { EditLanguagesComponent } from './components/languages/modals/edit.languages.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { EditTranslationsComponent } from './components/translations/modals/edit.translations.component';

@NgModule({
  imports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AuthModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          const persisted =
            sessionStorage.getItem('credentials') ||
            localStorage.getItem('credentials');
          if (persisted) {
            return JSON.parse(persisted).token;
          }
          return null;
        },
        allowedDomains: [environment.apiDomain],
      },
    }),
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [
    AppComponent,
    SelectorComponent,
    FormatDatePipe,

    // Generated CRUD components here.
    LanguagesComponent,
    EditLanguagesComponent,
    TranslationsComponent,
    EditTranslationsComponent,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
