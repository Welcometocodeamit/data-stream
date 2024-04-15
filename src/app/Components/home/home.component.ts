import { Component } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js'
import ChartStreaming from 'chartjs-plugin-streaming';
import { DateTime } from 'luxon';
import 'chartjs-adapter-luxon';
import { HttpService } from 'src/app/Service/http.service';
// import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(...registerables, ChartStreaming);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private http: HttpService) { }

  indexData: any
  mainData = [];
  price: any = '527.840027'
  date: any = '1966-01-04'
  count = 2
  labels = [];
  labels1 = [];
  chart: Chart;
  chart2: Chart
  dataset = [{
    label: 'Price in $',
    data: [],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    tension: 0.2
  }]

  dataset1 = [{
    label: 'Price in $',
    data: [],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    tension: 0.2
  }]


  ngOnInit() {



    this.http.getData().subscribe(data => {
      this.indexData = this.parseCSV(data);
      setInterval(() => {
        this.count = this.count + 1
        this.feedData(this.count)
      }, 1000)


      this.RenderChart()
      this.RenderChart2()

    })
  }

  feedData(index) {
    this.price = this.indexData[index].Close
    this.date = this.indexData[index].Date
  }

  parseCSV(csvData: string): any[] {
    const lines = csvData.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }

      result.push(obj);
    }

    return result;
  }

  RenderChart(): void {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.dataset
      },
      options: {
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              onRefresh: (chart) => {
                this.chart.data.datasets[0].data.push({
                  x: Date.now(),
                  y: this.price
                })

                this.chart2.data.datasets[0].data.push({
                  x: this.date,
                  y: this.price
                });

                this.chart2.data.labels.push(this.date)

                this.chart2.update()
              },
              delay: 2000
            },

          },
        }
      }
    });
  }

  RenderChart2(): void {

    this.chart2 = new Chart('canvas2', {
      type: 'line',
      data: {
        labels: this.labels1,
        datasets: this.dataset1
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

}
