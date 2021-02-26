/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { throwError } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http-service';
import { DialogComponent, DialogData } from '../../../base/dialog.component';

/**
 * Modal dialog for editing your existing Translations entity types, and/or
 * creating new entity types of type Translations.
 */
@Component({
  templateUrl: './edit.translations.component.html',
  styleUrls: ['./edit.translations.component.scss']
})
export class EditTranslationsComponent extends DialogComponent {

  /**
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<EditTranslationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    protected snackBar: MatSnackBar,
    private service: HttpService) {
    super(snackBar);
    this.primaryKeys = ['id', 'locale'];
    this.createColumns = [
      'id',
      'locale',
      'content'
    ];
    this.updateColumns = [
      'id',
      'locale',
      'content'
    ];
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
    return this.data.entity.locale && this.data.entity.id && this.data.entity.content;
  }
}
