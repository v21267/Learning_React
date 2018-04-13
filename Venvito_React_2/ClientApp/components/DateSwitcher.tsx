import * as React from 'react';
import DatePicker from 'material-ui/DatePicker';
import * as MetricsDataStore from '../store/MetricsDataHandler';
import { VenvitoService } from '../VenvitoService';
import { CurrentDateState } from '../store/CurrentDate';
import { MetricsDataProps } from './Activities';


export class DateSwitcher extends React.Component<MetricsDataProps, {}>
{
  componentWillMount()
  {
    // This method runs when the component is first added to the page
  }

  componentWillReceiveProps(nextProps: MetricsDataProps)
  {
    // This method runs when incoming props (e.g., route params) change
  }

  get currentDateCaption(): string
  {
    return (this.isToday     ? "Today" :
            this.isYesterday ? "Yesterday" :
                               this.currentDate.toDateString());
  }

  setCurrentDate(newDate: Date)
  {
    this.props.setCurrentDate(newDate);
    const data = VenvitoService.getMetricsData(newDate).then(
      data => this.props.setMetricsData(data));
  }

  shiftDate(delta: number)
  {
    const newDate = VenvitoService.addDays(this.currentDate, delta);
    this.setCurrentDate(newDate);
  }

  get currentDate(): Date
  {
    return new Date(this.props.currentDate);
  }

  get isToday(): boolean
  {
    return (this.currentDate.toDateString() == new Date().toDateString());
  }

  get isYesterday(): boolean
  {
    return (this.currentDate.toDateString() ==
            VenvitoService.addDays(new Date(), -1).toDateString());
  }

  get today(): Date
  {
    return new Date();
  }

  calendarDateChanged = (event, date) =>
  {
    this.setCurrentDate(date);
  };

  formatCalendarDate = (date: Date): string =>
  {
    return this.currentDateCaption;
  }

  public render()
  {
    return <div className="pt-3 pb-3 container w-100 pl-0 pr-0 date-switcher">
      <div className="row ml-0 mr-0">

        <div className="col-2 pl-0 mr-0 text-left">
          <button type="button" className="icon-button date-switcher-button"
                  onClick={() => this.shiftDate(-1)}>
            <span className="fas fa-caret-left fa-2x"></span>
          </button>
        </div>

        <div className="col-8 centered">
          <DatePicker id="calendarDate"
            autoOk={true}
            value={this.currentDate}
            onChange={this.calendarDateChanged}
            formatDate={this.formatCalendarDate}
            maxDate={this.today}
            inputStyle={ { cursor: "pointer", textAlign: "center", fontSize: "larger"} }
            className="text-link current-date"
          />
      </div >

        <div className="col-2 pr-0 mr-0 text-right">
          <button type="button" className="icon-button date-switcher-button"
                  onClick={() => this.shiftDate(1)}
                  disabled={this.isToday}>
            <span className="fas fa-caret-right fa-2x"></span>
          </button>
        </div >

      </div >
    </div >
      ;
  }
}

export default DateSwitcher;