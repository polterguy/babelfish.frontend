/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

// Angular and system specific imports.
import { Injectable } from '@angular/core';
import { Endpoint } from './models/endpoint';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

// Application specific imports.
import { IMe } from './interfaces/me-interface';
import { environment } from 'src/environments/environment';
import { AuthenticateToken } from './models/authenticate-token';
import { AutoAuthResponse } from './models/auto-auth-response';

/**
 * Authentication and authorization service, allowing you to query your backend
 * for its users/roles, authenticating users, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endpoints: Endpoint[] = [];
  private userRoles: string[] = [];

  /**
   * Creates an instance of our object.
   * 
   * @param httpClient HTTP client to use for HTTP invocations
   * @param jwtHelper OAuth0 helper class to parse JWT tokens
   */
  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService) {
    this.initialize();
  }

  /**
   * Returns true if endpoints have been initialized.
   * 
   * Do not initialize your app before this one returns true
   */
  public hasEndpoints() {
    return this.endpoints.length > 0;
  }

  /**
   * Returns true if backend can automatically login user, without
   * having the user provide a username/password combination.
   */
  public hasAutoLogin() {

    // Invoking backend, returning observable to caller.
    return this.httpClient.get<AutoAuthResponse>(
      environment.apiUrl +
      'magic/modules/system/auth/auto-auth');
  }

  /**
   * Returns method groups associated with the current user, allowing the user
   * to login, logout, change password, etc.
   */
  get me() : IMe {

    return {

      canInvoke: (url: string, verb: string) => {
        const endpoints = this.endpoints
          .filter((x: Endpoint) => x.path === url && x.verb === verb);

        if (endpoints.length === 0) {
          return false; // No such endpoint
        }
        return endpoints[0].auth === null ||
          endpoints[0].auth
            .filter(x => this.userRoles.includes(x)).length > 0;
      },
    
      inRole: (roles: string[]) => {
        return this.userRoles
          .filter(x => roles.indexOf(x) !== -1).length > 0;
      },
    
      isLoggedIn: () => {
        const ticket = localStorage.getItem('jwt_token');
        if (this.jwtHelper.isTokenExpired(ticket)) {
          localStorage.removeItem('jwt_token');
          return false;
        } else {
          return true;
        }
      },
    
      authenticate: (username: string, password: string) => {
        return new Observable<any>((observer: Subscriber<AuthenticateToken>) => {
          let query = '';
          if (username && username !== '') {
            query += '?username=' + encodeURIComponent(username);
            query += '&password=' + encodeURIComponent(password);
          }
          this.httpClient.get<AuthenticateToken>(
            environment.apiUrl +
            'magic/modules/system/auth/authenticate' + query, {
              withCredentials: query === ''
            }).subscribe((res: any) => {
    
              // Success.
              localStorage.setItem('jwt_token', res.ticket);
              this.userRoles = this.jwtHelper.decodeToken(res.ticket).role.split(',');
              observer.next(res);
              observer.complete();
    
            }, (error: any) => {
    
              // Error.
              observer.error(error);
              observer.complete();
            });
          });
      },
    
      logout: () => {
        localStorage.removeItem('jwt_token');
        this.userRoles = [];
      },
    
      refreshTicket: () => {
        return this.httpClient.get<AuthenticateToken>(
          environment.apiUrl +
          'magic/modules/system/auth/refresh-ticket');
      }
    }
  }

  /*
   * Invoked as object is created, which only happens once, since
   * service is consumed as a Singleton due to Angular's way of reusing
   * service instantiations.
   */
  private initialize() {

    /*
     * Checking JWT token is persisted, and not expired, at which point
     * we use stored token to initialize roles.
     */
    const ticket = localStorage.getItem('jwt_token');
    if (this.jwtHelper.isTokenExpired(ticket)) {
      localStorage.removeItem('jwt_token');
    } else {
      this.userRoles = this.jwtHelper.decodeToken(ticket).role.split(',');
    }

    /*
     * Retrieving endpoints from backend, which is a URL/verb association,
     * coupled with all roles allowed to invoke URL/verb combination.
     */
    this.httpClient.get<Endpoint[]>(
      environment.apiUrl + 
      'magic/modules/system/auth/endpoints').subscribe((res: Endpoint[]) => {
        this.endpoints = res;
      }, (error: any) => {
        console.log(error);
      });
  }
}
