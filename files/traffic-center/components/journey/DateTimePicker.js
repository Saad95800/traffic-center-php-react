import React, { Component } from 'react';
import PickyDateTime from 'react-picky-date-time';

export default class DateTimePicker extends Component {

    constructor(props){
      super(props);
      this.state = {
        showPickyDateTime: this.props.showPickyDateTime,
        date: '30',
        month: '01',
        year: '2020',
        hour: '23',
        minute: '50',
        second: '40',
        meridiem: 'PM'
      }
    }


    componentDidMount(){
        console.log(document.getElementsByClassName('picky-date-time'))
        console.log(document.getElementsByClassName('picky-date-time')[0])
        let picker = document.getElementsByClassName('picky-date-time')[0];
        picker.style.position = 'absolute'
        // picker.style.zIndex = '1'
        picker.style.backgroundColor = '#fff'
        
        // document.getElementById('container-picky-date-time').addEventListener('click', function(e){
        //   e.stopPropagation()
        // });
        
      }
  
      onYearPicked(res) {
        const { year } = res;
        this.setState({ year: year});
        this.props.updateDate({ year: year });
      }
    
      onMonthPicked(res) {
        const { month, year } = res;
        this.setState({ year: year, month: month});
        this.props.updateDate({ year: year, month: month });
      }
    
      onDatePicked(res) {
        const { date, month, year } = res;
        this.setState({ year: year, month: month, date: date });
        this.props.updateDate({ year: year, month: month, date: date });
      }
    
      onResetDate(res) {
        const { date, month, year } = res;
        this.setState({ year: year, month: month, date: date });
        this.props.updateDate({ year: year, month: month, date: date });
      }
    
      onResetDefaultDate(res) {
        const { date, month, year } = res;
        this.setState({ year: year, month: month, date: date });
        this.props.updateDate({ year: year, month: month, date: date });
      }
    
      onSecondChange(res) {
        this.setState({ second: res.value });
        this.props.updateDate({ second: res.value });
      }
    
      onMinuteChange(res) {
        this.setState({ minute: res.value });
        this.props.updateDate({ minute: res.value });
      }
    
      onHourChange(res) {
        this.setState({ hour: res.value });
        this.props.updateDate({ hour: res.value });
      }
    
      onMeridiemChange(res) {
        this.setState({ meridiem: res });
        this.props.updateDate({ meridiem: res });
      }
    
      onResetTime(res) {
        this.setState({
          second: res.clockHandSecond.value,
          minute: res.clockHandMinute.value,
          hour: res.clockHandHour.value
        });
      }
    
      onResetDefaultTime(res) {
        this.setState({
          second: res.clockHandSecond.value,
          minute: res.clockHandMinute.value,
          hour: res.clockHandHour.value
        });
      }
    
      onClearTime(res) {
        this.setState({
          second: res.clockHandSecond.value,
          minute: res.clockHandMinute.value,
          hour: res.clockHandHour.value
        });
      }
    
      // just toggle your outter component state to true or false to show or hide <PickyDateTime/>
      openPickyDateTime() {
        this.setState({showPickyDateTime: true});
      }
    
      onClose() {
        this.setState({showPickyDateTime: false});
      }
    
      showDatePicker(e){
        e.stopPropagation();
        if(this.state.showPickyDateTime == false){
          this.setState({showPickyDateTime: true})
        }
      }
  
      hideDatePicker(){
        if(this.props.showPickyDateTime == true){
          this.props.hideDatePicker()
        }
      }

    render() {

        const {
            showPickyDateTime,
            date,
            month,
            year,
            hour,
            minute,
            second,
            meridiem
            } = this.state;

        let date_picker = this.state.date + '/' + this.state.month + '/' + this.state.year + '-' + this.state.hour + ':' + this.state.minute + ':' + this.state.second

        let {inputMoment, bigInputMoment, datePickerMoment, datePickerRangeStartMoment, datePickerRangeEndMoment, timePickerMoment, showSeconds, locale, size} = this.state;
        let wrapperClass = 'wrapper ' + size;

        return (
        <div>
            {/* <input type="text" onClick={this.showDatePicker.bind(this)} className="form-control" id="date_departure" value={date_picker}/> */}
            <PickyDateTime
            size="m"// 'xs', 's', 'm', 'l'
            mode={0} //0: calendar only, 1: calendar and clock, 2: clock only; default is 0
            locale={`fr`}// 'en-us' or 'zh-cn'; default is en-us
            show={this.props.showPickyDateTime} //default is false
            onClose={() => this.hideDatePicker()} 
            defaultTime={`${hour}:${minute}`} // OPTIONAL. format: "HH:MM:SS AM"
            defaultDate={`${month}/${date}/${year}`} // OPTIONAL. format: "MM/DD/YYYY"
            onYearPicked={res => this.onYearPicked(res)}
            onMonthPicked={res => this.onMonthPicked(res)}
            onDatePicked={res => this.onDatePicked(res)}
            onResetDate={res => this.onResetDate(res)}
            onResetDefaultDate={res => this.onResetDefaultDate(res)}
            onSecondChange={res => this.onSecondChange(res)}
            onMinuteChange={res => this.onMinuteChange(res)}
            onHourChange={res => this.onHourChange(res)}
            onMeridiemChange={res => this.onMeridiemChange(res)}
            onResetTime={res => this.onResetTime(res)}
            onResetDefaultTime={res => this.onResetDefaultTime(res)}
            onClearTime={res => this.onClearTime(res)}
            />
        </div>
        );
      }
  
    }