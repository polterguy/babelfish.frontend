/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { ChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { TranslationCount } from 'src/app/services/models/translation-count.model';

/**
 * Diagnostics component allowing user to see missing translation entities, etc.
 */
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  /**
   * Maximum number of translated entities according to language,
   * allowing us to see missing translation entities for specific languages.
   */
  public max = 0;

  /**
   * Total number of translation entities in all languages.
   */
  public total = 0;

  /**
   * Total number of failed translations in the database.
   */
  public totalFailures = 0;

  /**
   * Total number of languages.
   */
  public languageCount = 0;

  /**
   * Total number of missing items for all languages.
   */
  public totalMissing = 0;

  /**
   * Data model to display in HTML for list of translations.
   */
  public items: TranslationCount[] = [];

  /**
   * Options for log items per day bar chart.
   */
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0
        }
      }]
    }
  };

  /**
   * Dataset for log items per day bar chart.
   */
  public statistics: SingleDataSet = null;

  /**
   * Labels for log items per day bar chart.
   */
  public statisticsLabels: Label[] = [];

  /**
   * Colors for log items per day bar chart.
   */
  public statisticsColors: any[] = [{
    backgroundColor: []
  }];

  /**
   * Creates an instance of your component.
   * 
   * @param httpService Backend HTTP service, required to retrieve statistics from backend
   */
  constructor(private httpService: HttpService) { }

  /**
   * Implementation of OnInit.
   */
  public ngOnInit() {

    // Retrieving statistics data from backend.
    this.httpService.statistics().subscribe((res: TranslationCount[]) => {

      // Avoiding null reference exceptions.
      res = res || [];

      // Finding maximum number of translations and total number of translations.
      for (const idx of res) {
        if (idx.count > this.max) {
          this.max = idx.count;
        }
        this.total += idx.count;
      }

      // Calculating total number of missing items.
      for (const idx of res) {
        this.total += idx.count;
        this.totalMissing += this.max - idx.count;
      }

      // Assigning statistics data to result from server.
      this.statistics = res.map(x => x.count);
      this.statisticsLabels = res.map(x => {
        return x.locale;
      });

      // Assigning color to bars, according to whether or not they're probably missing items or not.
      this.statisticsColors[0].backgroundColor = res.map(x => {
        if (x.count < this.max) {
          return 'rgb(225,200,200)';
        } else {
          return 'rgb(200,225,200)';
        }
      });

      // Assigning result from server to data model.
      this.items = res;
    });

    // Retrieving count of failed items, grouped by locale.
    this.httpService.failedTranslations().subscribe((res: TranslationCount[]) => {

      // Assigning result to model.
      this.totalFailures = (res || []).length;
    });
  }
}
