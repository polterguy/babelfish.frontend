/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

// Angular system imports.
import { Injectable } from '@angular/core';

/**
 * Session state service, giving some mechanism to remember choices across
 * multiple component instantiations.
 */
@Injectable({
  providedIn: 'root',
})
export class SessionStateService {
  public _translate = true;

  get translate() {
    return this._translate;
  }

  set translate(value: boolean) {
    this._translate = value;
  }
}
