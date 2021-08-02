/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/services/http-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../../../base/dialog.component';

// Importing all languages from JSON file.
import languages from '../../../languages.json';

/**
 * Modal dialog for editing your existing Languages entity types, and/or
 * creating new entity types of type Languages.
 */
@Component({
  templateUrl: './edit.languages.component.html',
  styleUrls: ['./edit.languages.component.scss'],
})
export class EditLanguagesComponent extends DialogComponent implements OnInit {
  // Languages already defined in backend.
  private existingLanguages: any[] = [];

  /**
   * Statically imported languages associating ISO codes with language name.
   */
  public allLanguages = languages;

  /**
   * Form control for language textbox to allow for having autocomplete.
   */
  public languageControl: FormControl;

  /**
   * Filtered languages as observable, to trap changes during autocomplete process.
   */
  public filteredLanguages: Observable<any[]>;

  /**
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<EditLanguagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    protected snackBar: MatSnackBar,
    private service: HttpService
  ) {
    super(snackBar);
    this.primaryKeys = ['locale'];
    this.createColumns = ['locale', 'language'];
    this.updateColumns = ['locale', 'language'];
  }

  /**
   * Implementation of OnInit.
   */
  public ngOnInit() {
    // Creating filter backends form control.
    this.languageControl = new FormControl();
    if (this.data.isEdit) {
      this.languageControl.setValue(this.data.entity.language);
    } else {
      this.languageControl.setValue('');
    }

    // Making sure we trap value changes for language form control, to make entity field dirty.
    this.languageControl.valueChanges.subscribe((res) => {
      this.changed('language');
    });

    // Retrieving currently existsing languages such that we can remove these as options.
    this.service.languages.read({ limit: -1 }).subscribe((res) => {
      this.existingLanguages = res || [];
    });

    // Creating our filter languages subscriber for our auto completer.
    this.filteredLanguages = this.languageControl.valueChanges.pipe(
      startWith(''),
      map(
        (value) =>
          !this.data.isEdit &&
          this.allLanguages.filter(
            (x: any) =>
              this.existingLanguages.filter((y) => y.locale === x.code)
                .length === 0 &&
              x.name
                .toLowerCase()
                .includes(this.languageControl.value.toLowerCase())
          )
      )
    );
  }

  /**
   * Invoked when user selects a language in the autocompleter.
   */
  public languageSelected() {
    // Changing the entity fields to the updated values.
    this.data.entity.locale = this.allLanguages.filter(
      (x: any) => x.name === this.languageControl.value
    )[0].code;
    this.data.entity.language = this.languageControl.value;

    // Informing base component of that we've changed the relevant entity fields.
    this.changed('locale');
    this.changed('language');
  }

  /**
   * Returns a reference to ths DialogData that was dependency injected
   * into component during creation.
   */
  protected getData() {
    this.data.entity.language = this.languageControl.value;
    return this.data;
  }

  /**
   * Returns a reference to the update method, to update entity.
   */
  protected getUpdateMethod() {
    return this.service.languages.update(this.data.entity);
  }
  /**
   * Returns a reference to the create method, to create new entities.
   */
  protected getCreateMethod() {
    return this.service.languages.create(this.data.entity);
  }

  /**
   * Closes dialog.
   *
   * @param data Entity that was created or updated
   */
  public close(data: any) {
    if (data) {
      this.dialogRef.close(data);
    } else {
      this.dialogRef.close();
    }
  }
}
