import * as React from 'react';
import TextField from 'material-ui/TextField';
import * as NumberFormat from 'react-number-format';
import * as MetricsDataStore from '../store/MetricsDataHandler';
import { VenvitoService } from '../VenvitoService';
import { MetricsData } from '../MetricsData';

// At runtime, Redux will merge together...
export type ActivityRowProps =
  MetricsData                               // ... state we've requested from the Redux store
  & typeof MetricsDataStore.actionCreators  // ... plus action creators we've requested
  & React.Props<{}>;

interface ActicityRowState { inAmountEditing: boolean; amount: number }

export class ActivityRow extends React.Component<ActivityRowProps, ActicityRowState>
{
  private amountInput: any;

  constructor(props)
  {
    super(props);
    this.state = { inAmountEditing: false, amount: this.props.value } as ActicityRowState;
  }

  componentWillMount()
  {
    // This method runs when the component is first added to the page
  }

  componentDidUpdate()
  {
    if (this.state.inAmountEditing)
    {
      (this.amountInput as any).input.focus()
    }
  }

  componentWillReceiveProps(nextProps: ActivityRowProps)
  {
    // This method runs when incoming props (e.g., route params) change
  }

  updateMetricsData(md: MetricsData)
  {
    this.props.updateMetricsData(md);
    VenvitoService.updateMetricsData(md)
      .catch(error => console.log(error.response));
  }

  updateCount(delta)
  {
    const md = { ...this.props } as MetricsData;
    if (md.value + delta < 0) return;

    md.value += delta;
    this.updateMetricsData(md);
  }

  editAmount()
  {
    this.setState((prevState, props) => ({inAmountEditing: true }));
  }

  handleAmountChange(newValue: string)
  {
    const newAmount = parseInt(newValue);
    this.setState((prevState, props) => ({ amount: newAmount }));
  }

  handleKeyUp(event: any)
  {
    if (event.keyCode == 13)
      this.setAmount();
    if (event.keyCode == 27)
      this.cancelAmountEditing();
  }

  setAmount()
  {
    if (!this.isValidAmount) return;

    const md = { ...this.props } as MetricsData;
    md.value = this.state.amount;
    this.updateMetricsData(md);

    this.setState((prevState, props) => ({ inAmountEditing: false }));
  }

  cancelAmountEditing()
  {
    this.setState((prevState, props) => ({ inAmountEditing: false }));
  }

  get isValidAmount(): boolean
  {
    return (this.state.amount >= 0 && this.state.amount != null);
  }

  public render() : JSX.Element
  {
    const md = this.props;
    const indicatorStyle = { backgroundColor: md.color };
    if (md.type == "COUNT")
    {
      return <tr className="activity-row">
        <td className="activity-badge" style={indicatorStyle} />
        <td className="activity-count">
          {md.value}
        </td>
        <td className="activity-description">
          {md.description}
        </td>
        <td className="activity-button">
          <button type="button" className="icon-button full-size"
            onClick={() => this.updateCount(-1)}
            disabled={md.value <= 0}>
            <span className="fas fa-minus fa-lg"></span>
          </button>
        </td>
        <td className="activity-button">
          <button type="button" className="icon-button full-size"
            onClick={() => this.updateCount(1)}>
            <span className="fas fa-plus fa-lg"></span>
          </button>
        </td >
      </tr>;
    }
    else
    {
      const cancelButtonStyle = { color: "red" };
      let okButtonColor: string = (this.isValidAmount ? "green" : "silver");
      const okButtonStyle = {color: okButtonColor};

      return <tr className="activity-row">
        <td className="activity-badge" style={indicatorStyle} />
        <td colSpan={2} className="activity-amount">
          <div className="activity-amount-description">
            {this.props.description}
          </div>

          {!this.state.inAmountEditing ?
            <div className="activity-amount">
              <NumberFormat value={this.props.value} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} />
            </div>
            :
            <div className="activity-amount">
              $
            <TextField
                id="amount"
                ref={(input) => { this.amountInput = input; }}
                type="number"
                min="0" max="999999999"
                defaultValue={this.props.value}
                onChange={(event) => this.handleAmountChange(event.target.value)}
                onKeyUp={(event) => this.handleKeyUp(event) }
                required
                style={{ height: "38px" }}
              >
              </TextField>
            </div>
          }

        </td >

        {!this.state.inAmountEditing ?
          <td className="activity-amount-button" colSpan={2}>
            <button type="button" className="icon-button full-size" onClick={() => this.editAmount()}>
              <span>EDIT</span>
            </button>
          </td>
          :
          [
            <td className="activity-button">
              <button type="button" className="icon-button full-size" onClick={() => this.cancelAmountEditing()} style={cancelButtonStyle} >
                <span className="fas fa-times fa-lg"></span>
              </button>
            </td>
            ,
            <td className="activity-button">
              <button type="button" className="icon-button full-size" onClick={() => this.setAmount()} disabled={!this.isValidAmount} style={okButtonStyle} >
                <span className="fas fa-check fa-lg"></span>
              </button>
            </td>
          ]
        }
      </tr>;
    }
  }
}

export default ActivityRow;