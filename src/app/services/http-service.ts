/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { ILog } from './interfaces/log-interface';
import { HttpClient } from '@angular/common/http';
import { CountResponse } from './models/count-response';
import { UpdateResponse } from './models/update-response';
import { DeleteResponse } from './models/delete-response';
import { StatusResponse } from './models/status-response';
import { CreateResponse } from './models/create-response';
import { ICrudEntity } from './interfaces/crud-interfaces';
import { environment } from 'src/environments/environment';
import { TranslationCount } from './models/translation-count.model';

/**
 * Your main HTTP service for invoking CRUD methods in your backend.
 * 
 * This class encapsulates the generated HTTP endpoints for your app.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  /**
   * Creates an instance of your service.
   * 
   * @param httpClient What HTTP client to use for invocations towards your backend
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Returns the log instance, allowing you to create server-side
   * log entries.
   */
  get log() : ILog {

    return {

      debug: (content: string) => {
        this.httpClient.post<StatusResponse>(
          environment.apiUrl +
          'magic/modules/system/logging/log', {
            type: 'debug',
            content
        }).subscribe((res: StatusResponse) => {
          console.log('Info item successfully logged');
        }, (error: any) => {
          console.error(error.error.message);
        });
      },

      info: (content: string) => {
        this.httpClient.post<StatusResponse>(
          environment.apiUrl +
          'magic/modules/system/logging/log', {
            type: 'info',
            content
        }).subscribe((res: StatusResponse) => {
          console.log('Info item successfully logged');
        }, (error: any) => {
          console.error(error.error.message);
        });
      },

      error: (content: string) => {
        this.httpClient.post<StatusResponse>(
          environment.apiUrl +
          'magic/modules/system/logging/log', {
            type: 'error',
            content
        }).subscribe((res: StatusResponse) => {
          console.log('Info item successfully logged');
        }, (error: any) => {
          console.error(error.error.message);
        });
      },

      fatal: (content: string) => {
        this.httpClient.post<StatusResponse>(
          environment.apiUrl +
          'magic/modules/system/logging/log', {
            type: 'fatal',
            content
        }).subscribe((res: StatusResponse) => {
          console.log('Info item successfully logged');
        }, (error: any) => {
          console.error(error.error.message);
        });
      }
    }
  }

  /*
   * HTTP REST methods your backend exposes.
   * 
   * These parts is exposed such that each table returns an ICrudEntity
   * or an ICrdEntity, depending upon whether or not the endpoint group
   * contains an update method or not.
   */

  /**
   * HTTP CRUD service methods for your 'languages' entities.
   */
  get languages() : ICrudEntity {

    return {

      delete: (filter: any) => {
        return this.httpClient.delete<DeleteResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/languages' +
          this.getQueryArgs(filter));
      },

      read: (filter: any) => {
        return this.httpClient.get<any[]>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/languages' +
          this.getQueryArgs(filter));
      },

      count: (filter: any) => {
        return this.httpClient.get<CountResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/languages-count' +
          this.getQueryArgs(filter));
      },

      create: (args: any) => {
        return this.httpClient.post<CreateResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/languages',
          args);
      },

      update: (args: any) => {
        return this.httpClient.put<UpdateResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/languages',
          args);
      }
    }
  }

  /**
   * HTTP CRUD service methods for your 'translations' entities.
   */
  get translations() : ICrudEntity {

    return {

      delete: (filter: any) => {
        return this.httpClient.delete<DeleteResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/translations' +
          this.getQueryArgs(filter));
      },

      read: (filter: any) => {
        return this.httpClient.get<any[]>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/translations' +
          this.getQueryArgs(filter));
      },

      count: (filter: any) => {
        return this.httpClient.get<CountResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/translations-count' +
          this.getQueryArgs(filter));
      },

      create: (args: any) => {
        return this.httpClient.post<CreateResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/translations',
          args);
      },

      update: (args: any) => {
        return this.httpClient.put<UpdateResponse>(
          environment.apiUrl +
          'magic/modules/babelfish/admin/translations',
          args);
      }
    }
  }

  /**
   * Returns number of translation entities grouped by locale, allowing
   * you to see how many items exists in each language more easily.
   */
  statistics() {
    return this.httpClient.get<TranslationCount[]>(
      environment.apiUrl +
      'magic/modules/babelfish/admin/statistics');
  }

  /**
   * Returns number of translation entities grouped by locale, that for some
   * reasons failed when trying to automatically translate them using Google Translate.
   */
  failedTranslations() {
    return this.httpClient.get<TranslationCount[]>(
      environment.apiUrl +
      'magic/modules/babelfish/admin/failed-translations');
  }


  /*
   * Creates QUERY parameters from the specified "args" argument given.
   *
   * Used by CRUD service methods to create the correct QUERY parameters
   * during invocations towards your backend.
   */
  private getQueryArgs(args: any) {
    let result = '';
    for(const idx in args) {
      if (Object.prototype.hasOwnProperty.call(args, idx)) {
        const idxFilter = args[idx];
        if (idxFilter !== null && idxFilter !== undefined && idxFilter !== '') {
          if (result === '') {
            result += '?';
          } else {
            result += '&';
          }
          if (idx.endsWith('.like')) {
            result += idx + '=' + encodeURIComponent(idxFilter + '%');
          } else {
            result += idx + '=' + encodeURIComponent(idxFilter);
          }
        }
      }
    }
    return result;
  }
}
