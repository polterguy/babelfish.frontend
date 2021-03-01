/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridComponent } from '../../base/grid.component';
import { MatPaginator } from '@angular/material/paginator';
import { HttpService } from 'src/app/services/http-service';
import { AuthService } from 'src/app/services/auth-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EditTranslationsComponent } from './modals/edit.translations.component';

/**
 * "Datagrid" component for displaying instance of Translations
 * entities from your HTTP REST backend.
 */
@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent extends GridComponent implements OnInit {

  /**
   * All languages backend supports.
   */
  public languages: any[] = [];

  /**
   * Which columns we should display. Reorder to prioritize columns differently.
   * Notice! 'delete-instance' should always come last.
   */
  public displayedColumns: string[] = [
    'locale',
    'id',
    'content',
    'delete-instance'
  ];

  // Need to view paginator as a child to update page index of it.
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  // Form control declarations to bind up with reactive form elements.
  public id: FormControl;
  public locale: FormControl;
  public content: FormControl;

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
    return 'magic/modules/babelfish/translations';
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually retrieve items from backend.
   */
  protected read(filter: any) {
    if (filter['id.like'] && filter['id.like'].length > 0) {
      filter['id.like'] = '%' + filter['id.like'];
    }
    if (filter['content.like'] && filter['content.like'].length > 0) {
      filter['content.like'] = '%' + filter['content.like'];
    }
    return this.httpService.translations.read(filter);
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually retrieve count of items from backend.
   */
  protected count(filter: any) {
    return this.httpService.translations.count(filter);
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually delete items in backend.
   */
  protected delete(ids: any) {
    return this.httpService.translations.delete(ids);
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
    this.id = this.createFormControl('id.like');
    this.locale = this.createFormControl('locale.like');
    this.content = this.createFormControl('content.like');

    /*
     * Retrieving all supported languages from backend to populate
     * locale filtering select drop down.
     */
    this.httpService.languages.read({limit:-1}).subscribe((res) => {

      // Creating a default value for our filter.
      this.filter['locale.eq'] = null;

      // Assigning model to result from backend.
      this.languages = [{locale: null, 'language': 'No filter ...'}].concat(res || []);
    });
  }

  /**
   * Invoked when user wants to edit an entity
   * 
   * This will show a modal dialog, allowing the user to edit his record.
   */
  public editEntity(entity: any) {

    const dialogRef = this.dialog.open(EditTranslationsComponent, {
      width: '800px',
      data: this.getEditData(entity)
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

    const dialogRef = this.dialog.open(EditTranslationsComponent, {
      width: '800px',
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
