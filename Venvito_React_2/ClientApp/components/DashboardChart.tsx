import * as React from 'react';
import * as NumberFormat from 'react-number-format';
import * as Numeral from 'numeral';
import { Bar } from 'react-chartjs-2';
import { MetricsChart } from '../MetricsChart';

export type DashboardChartProps = MetricsChart & React.Props<{}>;

export class DashboardChart extends React.Component<DashboardChartProps, {}>
{
  private barChartOptions: any =
    {
      scales: {
        xAxes: [{
          barPercentage: 0.4,
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: "grey"
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: "grey",
            callback: (value, index, values) =>
            {
              return this.formatYAxisValue(this.props, value);
            }
          },
          gridLines: {
            zeroLineColor: "grey"
          }
        }],
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) =>
          {
            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
            const label = Numeral(value).format("0,0");
            return (this.props.type == "AMOUNT" ? "$" : "") + label;
          }
        }
      },
      animation: false,
      scaleShowVerticalLines: false,
      responsive: true,
    };

  constructor(props)
  {
    super(props);
  }

  componentWillMount()
  {
    // This method runs when the component is first added to the page
  }

  private getBarChartData(): any
  {
    const data =
    {
      labels: this.getBarChartLabels(),
      datasets: [
          {
            data: this.getBarChartDataset(),
            backgroundColor: this.getBarChartColor()
          }
        ]
      };
    return data;
  }

  private getBarChartDataset(): any[]
  {
    let result = new Array();
    for (let i = 0; i < this.props.chartData.length; i++)
    {
      result.push(this.props.chartData[i].value);
    }

    return result;
  }

  private getBarChartLabels(): string[]
  {
    let result = new Array();
    for (let i = 0; i < this.props.chartData.length; i++)
    {
      result.push(this.props.chartData[i].periodName);
    }

    return result;
  }

  private getBarChartColor(): string
  {
    return this.props.color;
  }

  private get hasData(): boolean
  {
    for (let i = 0; i < this.props.chartData.length; i++)
    {
      if (this.props.chartData[i].value > 0) return true;
    }
    return false;
  }

  private formatYAxisValue(chart: MetricsChart, value: number): string
  {
    const suffix = ["", "k", "M", "G", "T", "P", "E"];
    let index = 0;
    let dvalue = value;
    while ((value /= 1000) >= 1 && ++index) dvalue /= 1000;
    let result =
      (chart.type == "AMOUNT" ? "$" : "") +
      Math.round(dvalue).toString() + suffix[index];
    return result;
  }

  public render(): JSX.Element
  {
    const data = this.getBarChartData();

    return <div className="container w-100">
      <div className="row  mt-2 mb-2 ml-2 mr-2">
        <div className="col-8 chart-description pl-0">
            { this.props.description }
        </div>
        <div className="col chart-total pr-0">
          <span className="badge badge-primary total-badge">
            <NumberFormat
              value={this.props.totalValue}
              displayType={'text'}
              thousandSeparator={true}
              prefix={(this.props.type == "AMOUNT" ? "$" : "")}
              decimalScale={0} />
          </span>
        </div>
      </div>
      <div className="row" style={{ display: "block" }}>

        {this.hasData ?
          <div className="col ml-2 chart-height">
            <Bar 
              data={data}
              options={this.barChartOptions}
              legend={{ display: false }}
              ></Bar>
          </div>
          :
          <div className="col ml-2 chart-height no-data-parent">
            <div className="no-data-child">No data for this period</div>
          </div>
        }

      </div>
    </div>
    ;
  }
}

export default DashboardChart;