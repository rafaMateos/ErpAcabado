import { Pipe, PipeTransform } from "@angular/core";


@Pipe({

name: 'DispatchDateConversion'})
export class DispatchDateConversion implements PipeTransform{

transform(date: string) : string {

    let ret : string = date
    if(date === "01/01/0001") ret = "-"

    return ret
}

}