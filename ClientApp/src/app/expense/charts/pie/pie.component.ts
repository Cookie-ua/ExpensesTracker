import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js';
import { ShareService } from 'src/app/core/services/share.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit, AfterViewInit {

  @ViewChild('pieChartCanvas', {static: false}) pieChartCanvas: ElementRef;

  public pieChartData: Chart;
  public explanationData;
  totalAmount: number = 0;

  constructor(private cd: ChangeDetectorRef,
              private shareService: ShareService) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.createChart();
    this.cd.detectChanges();
  }

  createChart(){
    this.shareService.currentEntriesData.subscribe(res => {
      if (res) {

        let data = this.shareService.sumByGroup(this.shareService.removePropFromObject(res));

        let amount = data.map(x => x.amount);
        let labelsArray =  data.map(res => res.category);
        let colorsArray = this.shareService.replaceColourForArray(labelsArray);

        this.explanationData = data;
        this.explanationData.forEach((item, i, arr) => {
          this.explanationData[i].icon = this.shareService.categoriesIcon.get(item.category);
          this.explanationData[i].color = this.shareService.categoriesColour.get(item.category);
        });
        this.totalAmount = amount.reduce((a, b) => a + b, 0).toFixed(2);

        if(this.pieChartData)
          this.pieChartData.destroy();

        let ctx = this.pieChartCanvas.nativeElement.getContext('2d');
        this.pieChartData = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labelsArray,
            datasets: [
              {
                backgroundColor: colorsArray,
                data: amount
              }
            ]
          },
          options: {
            legend: {
              display: false,
            },
            responsive: true,
            title: {
              display: false,
            }
          }
        })
      }
    });
  }
}