/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridComponent } from '../../base/grid.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { EditLanguagesComponent } from './modals/edit.languages.component';
import { HttpService } from 'src/app/services/http-service';
import { AuthService } from 'src/app/services/auth-service';

/**
 * "Datagrid" component for displaying instance of Languages
 * entities from your HTTP REST backend.
 */
@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent extends GridComponent implements OnInit {

  /**
   * Which columns we should display. Reorder to prioritize columns differently.
   * Notice! 'delete-instance' should always come last.
   */
  public displayedColumns: string[] = [
    'language',
    'locale',
    'delete-instance'
  ];

  // Need to view paginator as a child to update page index of it.
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  // Form control declarations to bind up with reactive form elements.
  public locale: FormControl;
  public language: FormControl;

  // Constructor taking a bunch of services/helpers through dependency injection.
  constructor(
    public authService: AuthService,
    protected snackBar: MatSnackBar,
    private httpService: HttpService,
    private dialog: MatDialog) {
      super(authService, snackBar);
  }

  /**
   * Overridde abstract method necessary to return the URL endpoint
   * for CRUD methods to base class.
   */
  protected url() {
    return 'magic/modules/babelfish/languages';
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually retrieve items from backend.
   */
  protected read(filter: any) {
    return this.httpService.languages.read(filter);
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually retrieve count of items from backend.
   */
  protected count(filter: any) {
    return this.httpService.languages.count(filter);
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually delete items in backend.
   */
  protected delete(ids: any) {
    return this.httpService.languages.delete(ids);
  }

  /**
   * Implementation of abstract base class method, to reset paginator
   * of component.
   */
  protected resetPaginator() {
    this.paginator.pageIndex = 0;
    this.filter.offset = 0;
  }

  /**
   * OnInit implementation. Retrieves initial data (unfiltered),
   * and instantiates our FormControls.
   */
  public ngOnInit() {

    // Retrieves data from our backend, unfiltered, and binds our mat-table accordingly.
    this.getData();

    /*
     * Creating our filtering FormControl instances, which gives us "live filtering"
     * on our columns.
     */
    this.locale = this.createFormControl('locale.like');
    this.language = this.createFormControl('language.like');
  }

  /**
   * Invoked when user wants to edit an entity
   * 
   * This will show a modal dialog, allowing the user to edit his record.
   */
  public editEntity(entity: any) {

    const dialogRef = this.dialog.open(EditLanguagesComponent, {
      data: this.getEditData(entity),
      width: '150px'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.setEditData(res, entity);
      }
    });
  }

  /**
   * Invoked when user wants to create a new entity
   * 
   * This will show a modal dialog, allowing the user to supply
   * the initial data for the entity.
   */
  public createEntity() {

    const dialogRef = this.dialog.open(EditLanguagesComponent, {
      data: {
        isEdit: false,
        entity: {},
      }});
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.itemCreated(res);
      }
    });
  }
}
