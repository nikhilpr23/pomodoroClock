import React, { Component } from 'react';
import './App.css';
import Beep from './Beep.mp3';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      ticking: false,
      breakLength: 5,
      sessionLength: 25,
      initialBreak: 5,
      initialSession: 25,
      limit: false,
      session: true,
      sec: 0
    }
    this.audioRef = React.createRef();
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.limitExceed = this.limitExceed.bind(this);
    this.display = this.display.bind(this);
    this.reset = this.reset.bind(this);
    this.countDown = this.countDown.bind(this);
    this.tickFunction = this.tickFunction.bind(this);
    this.ticking = this.ticking.bind(this);
  }

  increment(mode){
    if(!this.state.ticking){
    (mode === 'breakLength' ? 
      this.state.initialBreak >= 1 && this.state.initialBreak < 60 ? 
      this.setState({
        breakLength: this.state.initialBreak + 1,
        initialBreak: this.state.initialBreak + 1}) : this.setState({limit: true}): 
      this.state.initialSession >= 1 && this.state.initialSession < 60 ? 
      this.setState({        
        initialSession: this.state.initialSession + 1,
        sessionLength: this.state.initialSession + 1,
        sec: 0}) : this.setState({limit: true}));}
  }

  decrement(mode){
    if(!this.state.ticking){
    (mode === 'breakLength' ? 
      this.state.initialBreak > 1 && this.state.initialBreak <= 60 ? 
      this.setState({
        breakLength: this.state.initialBreak - 1,
        initialBreak: this.state.initialBreak - 1}) : this.setState({limit: true}) : 
      this.state.initialSession > 1 && this.state.initialSession <= 60 ? 
      this.setState({
        sessionLength: this.state.initialSession - 1,
        initialSession: this.state.initialSession - 1,
        sec: 0}) : this.setState({limit: true}));}
  }

  limitExceed(){
    let warning = 'Limit has been reached!';
    setTimeout(() => this.setState({limit: false}), 300);
    return warning;
  }

  display(){
    let min = this.state.session ? this.state.sessionLength : this.state.breakLength;
    min =  min < 10 ? '0'+ min : min;
    let sec = this.state.sec;
    sec = sec < 10 ? '0'+ sec : sec;
    return min+":"+sec;
  }

  tickFunction(){
    this.tick = setInterval(() => {this.ticking()}, 1000);
  }

  ticking() {    
    if(this.state.session){
      if(this.state.sessionLength === 0 && this.state.sec === 0){
          this.audioRef.current.play();
          this.setState({
            session: false,            
            sec:0,
            sessionLength: this.state.initialSession
          })}
      else if(this.state.sessionLength > 0 && this.state.sec === 0){
          this.setState({
            sec: 59,
            sessionLength : this.state.sessionLength - 1
          })}
      else 
          this.setState({sec: this.state.sec - 1})}
    else
    {
      if(this.state.breakLength === 0 && this.state.sec === 0){
        this.audioRef.current.play();
        this.setState({
          session: true,
          sec:0,
          breakLength: this.state.initialBreak
        })}
    else if(this.state.breakLength > 0 && this.state.sec === 0){
        this.setState({
          sec: 59,
          breakLength : this.state.breakLength - 1
        })}
    else 
        this.setState({sec: this.state.sec - 1})}
  }

  reset() {
    clearInterval(this.tick);
    this.audioRef.current.pause();
    this.audioRef.current.currentTime = 0;
    this.setState({      
      breakLength: 5,
      sessionLength: 25,      
      initialBreak: 5,
      initialSession: 25,
      session: true,
      sec: 0,      
      ticking: false
    })
  }

  countDown() {   
    (!this.state.ticking ? this.tickFunction() : clearInterval(this.tick));    
    this.setState({
      ticking: !this.state.ticking});
  }

  render() {
    return (
      <div className="App">
        <h1> Pomodoro Cl<i className="fa fa-clock-o"/>ck </h1>
        <div className="container">
          <div className="lengthForm">
            <div id="break-label">
              <span className="lengthLabel"> Break Length: </span>              
              <span id="break-length">{this.state.initialBreak}</span>
              <button id="break-increment" onClick={() => this.increment('breakLength')}>
                <i className="fa fa-arrow-up"/></button>
              <button id="break-decrement" onClick={() => this.decrement('breakLength')}>
                <i className="fa fa-arrow-down"/></button>
            </div>
            <div id="session-label">          
              <span className="lengthLabel"> Session Length: </span>              
              <span id="session-length">{this.state.initialSession}</span>
              <button id="session-increment" onClick={() => this.increment('sessionLength')}>
                <i className="fa fa-arrow-up"/>
              </button>
              <button id="session-decrement" onClick={() => this.decrement('sessionLength')}>
                <i className="fa fa-arrow-down"/></button>
            </div>
          </div>
          <div className="timer">
            <span id="timer-label" className={this.state.session ? 'orange' : 'green'}>
              {this.state.session ? 'Session Time!' : 'Break Time!'}</span>            
            <p className="limitLabel">{this.state.limit ? this.limitExceed() : ''}</p>
            <div id="time-left">{this.display()}</div><br/>
            <audio id="beep" ref={this.audioRef}>
              <source src={Beep} type="audio/mpeg"/>
            </audio>
            <button id="start_stop" onClick={this.countDown}>
              <i className={!this.state.ticking ? "fa fa-play" : "fa fa-pause"}/></button>
            <button id="reset" onClick={this.reset}>
              <i className="fa fa-refresh"/></button>        
          </div>
        </div>
      </div>
    );
  }
}

export default App;
