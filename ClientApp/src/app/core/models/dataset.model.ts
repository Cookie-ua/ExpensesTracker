export class Dataset{
    constructor(label: string, backgroundColor: string, data: number[]){
      this.label = label, this.backgroundColor = backgroundColor, this.data = data;
    }
    label: string;
    backgroundColor: string;
    data: number[];
  }