import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { SearchModel } from '../models/search.model';
import { Period } from '../models/enums/period.enum';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { 
    this.currentEntriesDataSubject = new BehaviorSubject<any[]>(null);
    this.currentEntriesData = this.currentEntriesDataSubject.asObservable();

    this.currentPeriodSubject = new BehaviorSubject<Period>(1);
    this.currentDateSubjet = new BehaviorSubject<Date>(null);
  }

  private currentEntriesDataSubject: BehaviorSubject<any[]>;
  public currentEntriesData: Observable<any>;

  updateEntriesData(data){
    this.currentEntriesDataSubject.next(null);
    this.currentEntriesDataSubject.next(data);
  }
  
  //Subj for chart period
  private currentPeriodSubject: BehaviorSubject<Period>;
  currentPeriod(): Observable<Period> {
    return this.currentPeriodSubject.asObservable();
  }
  updatePeriodSelection(period: Period) {
    this.currentPeriodSubject.next(period);
  }

  //Subj for chart date
  private currentDateSubjet: BehaviorSubject<Date>;

  getDate(): Observable<Date> {
    return this.currentDateSubjet.asObservable();
  }
  updateDate(date: Date) {
    this.currentDateSubjet.next(date);
  }

  defStartEndDaysInWeek(date: Date){
    let currentDate = new Date(date);
    currentDate.setHours(0,0,0,0);

    let firstday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    let lastday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()+6));

    let res: SearchModel = { 
      startDate: firstday,  
      finishDate: lastday 
    }

    return res;
  }

  defStartEndDaysInMonth(date: Date){
    let days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let startDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0);
    let endDay = new Date(date.getFullYear(), date.getMonth(), days, 0, 0);
    
    let res: SearchModel = { 
      startDate: startDay,  
      finishDate: endDay 
    }

    return res;
  }

  defStartEndDaysInYear(date: Date){
    let startDay = new Date(`${date.getFullYear()}-01-01`)
    let endDay = new Date(`${date.getFullYear()}-12-31`)
    
    let res: SearchModel = { 
      startDate: startDay,  
      finishDate: endDay 
    }

    return res;
  }

  removePropFromObject(array: any[]){
    let temp;
    let group = [];

    array.forEach(element => {
      temp = (({category, amount})=>({category, amount}))(element);   
      group.push(temp);
    });

    return group;
  }

  sumByGroup(array: any[]){
    var result: any[] = [];

    array.reduce(function(res, value) {
      if (!res[value.category]) {
        res[value.category] = { category: value.category, amount: 0 };
        result.push(res[value.category])
      }
      res[value.category].amount += value.amount;
      return res;
    }, {}); 

    return result;
  }
  
  replaceColourForArray(array){
    let replaced: any[] = [];
    //
    array.forEach(element => {
      replaced.push(this.categoriesColour.get(element));
    });
    //
    return replaced;
  }

  public categoriesColour = new Map<string, string>([
    ['Groceries', '#4fa7f0' ],
    ['Health', '#58b25b' ],
    ['Transport', '#f2a73e' ],
    ['Gifts', '#f55555' ],
    ['Family', '#845cef' ],
    ['Shopping', '#7b594d' ],
    ['Restaurant', '#4350b4' ],
    ['Leisure', '#f74581' ]
  ])

  public categoriesIcon = new Map<string, string>([
    ['Groceries', 'shopping_basket'],
    ['Health', 'spa'],
    ['Transport', 'directions_bus'],
    ['Gifts', 'card_giftcard'],
    ['Family', 'face'],
    ['Shopping', 'local_mall'],
    ['Restaurant', 'restaurant'],
    ['Leisure', 'local_movies']
  ])
}