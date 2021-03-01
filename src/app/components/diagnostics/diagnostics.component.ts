/*
 * Copyleft Thomas Hansen - thomas@servergardens.com
 */

import { ChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { Diagnostics } from 'src/app/services/models/diagnostics.model';

/**
 * Diagnostics component allowing user to see missing translation entities, etc.
 */
@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent implements OnInit {

  /**
   * Data model to display in HTML for list of translations.
   */
  public items: Diagnostics[] = [];

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
    this.httpService.diagnostics().subscribe((res: Diagnostics[]) => {

      // Finding maximum number of translations.
      let max = 0;
      for (const idx of res) {
        if (idx.count > max) {
          max = idx.count;
        }
      }

      // Assigning statistics data to result from server.
      this.statistics = res.map(x => x.count);
      this.statisticsLabels = res.map(x => {
        if (x.count < max) {
          return `${x.locale} - ${max - x.count} missing`
        }
        return x.locale;
      });

      // Assigning color to bars, according to whether or not they're probably missing items or not.
      this.statisticsColors[0].backgroundColor = res.map(x => {
        if (x.count < max) {
          return 'rgb(255,200,200)';
        } else {
          return 'rgb(200,200,200)';
        }
      });

      // Assigning result from server to data model.
      this.items = res;
    });
  }
}
