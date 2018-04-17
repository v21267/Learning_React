import { MetricsDefinition } from './MetricsDefinition';
import { MetricsChartData } from './MetricsChartData';

export class MetricsChart extends MetricsDefinition
{
  totalValue: number;
  chartData: MetricsChartData[];
}
