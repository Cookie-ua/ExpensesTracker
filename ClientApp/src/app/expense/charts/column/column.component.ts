import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ShareService } from 'src/app/core/services/share.service';
import { Dataset } from 'src/app/core/models/dataset.model';
import { Expense } from 'src/app/core/models/expense.model';
import { Period } from 'src/app/core/models/enums/period.enum';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit, AfterViewInit {

  @ViewChild('columnChartCanvas', {static: false}) columnChartCanvas: ElementRef;
  
  currentDate: Date;
  selectedPeriod: Period;
  columnChartData: Chart;
  public explanationData;
  totalAmount;
  
  constructor(private cd: ChangeDetectorRef,
              private shareService: ShareService) { }

  ngAfterViewInit() {
    this.createChart();
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.shareService.currentPeriod().subscribe(data => {
      this.selectedPeriod = data;
    });
    this.shareService.getDate().subscribe(data => {
      this.currentDate = data;
    });
  }

  createChart(){
    this.shareService.currentEntriesData.subscribe((data: Expense[]) => {
      if (data) {

        let dataset, date
        if (this.selectedPeriod === Period.Week) {
          date = this.getDateArrayForWeek(this.currentDate);
          dataset = this.datasetInit(data, date);
          date = convertDate(date, 4, 10);
        }
        if (this.selectedPeriod === Period.Month) {
          date = this.getDateArrayForMonth(this.currentDate);
          dataset = this.datasetInit(data, date);
          date = convertDate(date, 8, 10);
        }
        if (this.selectedPeriod === Period.Year) {
          date = this.getDateArrayForYear(this.currentDate);
          dataset = this.datasetInitForYear(data, date);    
          date = convertDate(date, 4, 8);
        }
        
        this.explanationData = this.shareService.sumByGroup(this.shareService.removePropFromObject(data));
        let amount = data.map(x => x.amount);
        this.explanationData.forEach((item, i, arr) => {
          this.explanationData[i].icon = this.shareService.categoriesIcon.get(item.category);
          this.explanationData[i].color = this.shareService.categoriesColour.get(item.category);
        });
        this.totalAmount = amount.reduce((a, b) => a + b, 0).toFixed(2);

        if(this.columnChartData)
          this.columnChartData.destroy();

        let ctx = this.columnChartCanvas.nativeElement.getContext('2d');
        this.columnChartData = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: date,
            datasets: dataset
          },
            options: {
              gridLines: {
                display: false
              },
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                  display: true,
                  stacked: true,
                  gridLines: false,
                  // ticks: {
                  //   fontSize: 8
                  // }
                }],
                yAxes: [{
                  display: true,
                  stacked: true,
                }]
              }
            }  
        })
      }
    });
  }

  getDateArrayForWeek(date){
    let days = this.shareService.defStartEndDaysInWeek(date);
    let dateArray = this.getDateArray(days.startDate, days.finishDate);

    return dateArray;
  }

  getDateArrayForMonth(date){
    let days = this.shareService.defStartEndDaysInMonth(date);
    let dateArray = this.getDateArray(new Date(days.startDate), new Date(days.finishDate));
    
    return dateArray;
  }

  getDateArrayForYear(date){
    var 
      dateArray = new Array(),
      currentYear = date.getFullYear();
  
    let firstDayInYear = new Date(`01.01.${currentYear}`);

    let count = 0;
    while(count <= 11){
      dateArray.push(`${new Date(firstDayInYear).toDateString().substring(4,7)} ${new Date(firstDayInYear).toDateString().substring(11,16)}`);
      firstDayInYear.setMonth(firstDayInYear.getMonth()+1);
      count++;
    }  
    return dateArray;
  }

  getDateArray(start, end) {
    var
      arr = new Array(),
      dt = new Date(start);
  
    while (dt <= end) {
      arr.push(new Date(dt).toDateString());
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  datasetInit(array: any[], dateArray: any[]){
    let uniqueCategory = this.distinct(array.map(c => c.category));
    let datasetForChart: Dataset[] = [];
    uniqueCategory.forEach((item, i, arr) => {
      datasetForChart.push(new Dataset('','',[]));
      datasetForChart[i].label = item as string;
      datasetForChart[i].backgroundColor = this.shareService.categoriesColour.get(item as string);
      datasetForChart[i].data = new Array(dateArray.length).fill(0);
    });

    array.forEach(item => {
      datasetForChart.forEach(element => {
        if(item.category === element.label){
          let index = dateArray.indexOf(new Date(item.date).toDateString() as string);
          if (element.data[index] > 0) {
            element.data[index] += item.amount;
          } else{
            element.data[index] = item.amount;
          }  
        }
      })
    });
  
    return datasetForChart;
  }
  
  datasetInitForYear(array: any[], dateArray: any[]){
    let uniqueCategory = this.distinct(array.map(c => c.category));
    let datasetForChart: Dataset[] = [];
    //
    uniqueCategory.forEach((item, i, arr) => {
      datasetForChart.push(new Dataset('','',[]));
      datasetForChart[i].label = item as string;
      datasetForChart[i].backgroundColor = this.shareService.categoriesColour.get(item as string);
      datasetForChart[i].data = new Array(12).fill(0);
    });

    array.forEach(item => {
      datasetForChart.forEach(element => {
        if(item.category === element.label){
          let index = dateArray.indexOf(`${new Date(item.date).toDateString().substring(4,7)} ${new Date(item.date).toDateString().substring(11,16)}`);
          if (element.data[index] > 0) {
            element.data[index] += item.amount;
          } else{
            element.data[index] = item.amount;
          }  
        }
      })
    });

    return datasetForChart;
  }

  distinct(array){
    let temp = new Set(array);
    let result = [...temp];
    return result;
  }
}

function convertDate(date, a, b){
  let dt: any[] = [];

  date.forEach(element => {
    dt.push(new Date(element).toDateString().slice(a,b))
  });

  return dt;
}