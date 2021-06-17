/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

// Angular specific imports.
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Application specific imports.
import { AuthService } from '../../../services/auth-service';
import { AutoAuthResponse } from 'src/app/services/models/auto-auth-response';

/**
 * Username password model, returned to caller as dialog is closed.
 */
export class AuthModel {
  username: string;
  password: string;
}

/**
 * Your app's login component.
 *
 * This is the modal window that encapsulates your login form
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /**
   * Username user typed, if any.
   */
  public username: string;

  /**
   * Password user typed, if any.
   */
  public password: string;

  /**
   * True if automatic logins are supported by the backend.
   */
  public autoAuth: boolean = false;

  /**
   * Only true if auto auth is true, yet user still wants to provide
   * explicit credentials during authentication.
   */
  public advanced: boolean = false;

  /**
   * 
   * @param authService Authorization/authentication service to use
   * @param dialogRef Needed to explicitly close the dialog
   * @param data Input data specified by creator of dialog
   */
  public constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthModel) { }

  /**
   * Implementation of OnInit.
   */
  public ngOnInit() {
    this.authService.hasAutoLogin().subscribe((res: AutoAuthResponse) => {

      // Assigning results to model according to returned value.
      this.autoAuth = res.result === 'on';
    });
  }

  /**
   * Invoked when the login button is clicked.
   */
  public login() {

    // Checking if user wants to use an explicit username/password combination.
    if (this.autoAuth === true && this.advanced === false) {

      // User wants to automatically login.
      this.dialogRef.close({
        username: null,
        password: null,
      });

    } else {

      // Username/password provided.
      this.dialogRef.close({
        username: this.username,
        password: this.password
      });

    }
  }

  /**
   * Invoked when the cancel button is clicked.
   */
  public close() {
    this.dialogRef.close();
  }
}
