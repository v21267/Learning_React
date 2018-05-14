import { fetch, addTask } from 'domain-task';
import axios, { AxiosPromise } from 'axios';
import { MetricsData } from "./MetricsData";
import { MetricsChart } from './MetricsChart';
import * as MetricsDataHandler from './store/MetricsDataHandler';

export class VenvitoService
{
  static API_HOST: String = 'http://localhost:3000';

  static initialDate: Date = new Date();

  static addDays(date: Date, delta: number): Date
  {
    return new Date(date.getTime() + delta * (1000 * 60 * 60 * 24));
  }

  static dateToString(date: Date): string
  {
    const d: string =
      (date.getFullYear().toString() as any).padStart(4, "0") +
      ((date.getMonth() + 1).toString() as any).padStart(2, "0") +
      (date.getDate().toString() as any).padStart(2, "0");
    return d;
  }

  static async getMetricsData(date: Date): Promise<MetricsData[]>
  {
    const d: string = VenvitoService.dateToString(date);
    const url: string = VenvitoService.API_HOST + '/api/MetricsData/' + d;
    const response = await axios.get(url);
    const result = response.data as Promise<MetricsData[]>;
    return result;
  }

  static async updateMetricsData(data: MetricsData): Promise<any>
  {
    const url: string = VenvitoService.API_HOST + '/api/MetricsData/';
    const response = await axios.post(url, data);
    return response;
  }

  static async getMetricsChart(dateRange: string): Promise<MetricsChart[]>
  {
    const url: string = VenvitoService.API_HOST + '/api/MetricsChart/' + dateRange;
    const response = await axios.get(url);
    const result = response.data as Promise<MetricsChart[]>;
    return result;
  }
}
