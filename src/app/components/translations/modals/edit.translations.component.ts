/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http-service';
import { DialogComponent, DialogData } from '../../../base/dialog.component';
import { SessionStateService } from 'src/app/services/session-state-service';

/**
 * Modal dialog for editing your existing Translations entity types, and/or
 * creating new entity types of type Translations.
 */
@Component({
  templateUrl: './edit.translations.component.html',
  styleUrls: ['./edit.translations.component.scss'],
})
export class EditTranslationsComponent
  extends DialogComponent
  implements OnInit
{
  /**
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<EditTranslationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public sessionStateService: SessionStateService,
    protected snackBar: MatSnackBar,
    public service: HttpService
  ) {
    super(snackBar);
    this.primaryKeys = ['id', 'locale'];
    this.createColumns = ['id', 'locale', 'content'];
    this.updateColumns = ['id', 'locale', 'content'];
  }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {
    // Defaulting language to English if English exists in database.
    if (!this.data.isEdit) {
      this.service.languages.read({ limit: -1 }).subscribe((res) => {
        if (res.filter((x) => x.locale === 'en')) {
          this.data.entity['locale'] = 'en';
        }
      });
    }
  }

  /**
   * Returns a reference to ths DialogData that was dependency injected
   * into component during creation.
   */
  protected getData() {
    return this.data;
  }

  /**
   * Returns a reference to the update method, to update entity.
   */
  protected getUpdateMethod() {
    return this.service.translations.update(this.data.entity);
  }

  /**
   * Returns a reference to the create method, to create new entities.
   */
  protected getCreateMethod() {
    // This is a bit naive, but actually works.
    this.data.entity.translate = this.sessionStateService.translate;
    return this.service.translations.create(this.data.entity);
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

  /**
   * Returns true it entity is valid and can be saved.
   */
  public isValid() {
    return (
      this.data.isEdit ||
      (this.data.entity.locale &&
        this.data.entity.id &&
        this.data.entity.content)
    );
  }
}
