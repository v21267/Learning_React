import { MetricsDefinition } from './MetricsDefinition';
import { MetricsChartData } from './metricsChartData';

export class MetricsChart extends MetricsDefinition
{
  totalValue: number;
  chartData: MetricsChartData[];
}
