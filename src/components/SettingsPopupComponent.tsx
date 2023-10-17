/*-- import statements --*/
import React, { Component } from "react";

/* Global Variables */
let flag = 0;

//state
interface IState {
	open_Settings_Box		:	boolean;
	open_Instruction_Box	:	boolean;
	soundValue			:	any;
	musicValue			:	any;
	showHintValue			:	boolean;
};

// props
interface IProps {
	soundValue	:	any;
	changeSound	:	any;

	musicValue	:	any;
	changeMusic	:	any;

	hintValue		:	any;
	hintValueFunc	:	any;
};

export default class SettingsPopupComponent extends Component<IProps, IState>{
	//code
	constructor(props: IProps) {
		super(props);

		this.state = {
			open_Settings_Box		:	true,
			open_Instruction_Box	:	false,
			soundValue			:	this.props.soundValue,
			musicValue			:	this.props.musicValue,
			showHintValue			:	this.props.hintValue,
		};
	};
	
	/*************************************************
	*
	* React Life Cycle method calls immediately after application born. Here Acts as Initialization method
	*
	*************************************************/
	//Component Did Mount
	componentDidMount() {
		//code
		flag++;

		if(flag > 1){
			//code
			this.setState({
				soundValue: this.props.soundValue,
				musicValue: this.props.musicValue,
				showHintValue: this.props.hintValue,
			});
		}
	};

	/*************************************************
	*
	* React Life Cycle method calls when the state of the component changes.
	*
	*************************************************/
	componentDidUpdate(prevProps : any, prevState : any) {

	};

	/*************************************************
	*
	* Functions
	*
	*************************************************/
	//For Sound
	onChangeSoundSlider = (event:any) =>{
		var soundValue = document.getElementsByClassName("sound_slider_value");

		this.setState({soundValue: event.target.value},()=>{
			soundValue[0].textContent = event.target.value;
			this.props.changeSound(event.target.value);
		});
	};

	//For Music
	onChangeMusicSlider = (event:any) => {
		var musicValue = document.getElementsByClassName("music_slider_value");

		this.setState({musicValue: event.target.value},()=>{
			musicValue[0].textContent = event.target.value;
			this.props.changeMusic(event.target.value);
		});
	};

	//For Show hint
	onChangeToggleButton = (event:any) =>
	{
		this.setState({
			showHintValue	:	event.target.checked
		});

		this.props.hintValueFunc(event.target.checked);
	};

	//For Instruction Box
	onClickInstructionBox = () => {
		this.setState({
			open_Instruction_Box	:	true,
		});
	};

	exit_btn_onclick = () => {
		this.setState({
			open_Settings_Box		:	true,
			open_Instruction_Box	:	false,
		});
	};

	onClick_Home = () => {
		window.location.reload();
	};

	onClick_Feedback = ()=> {
		window.open("https://www.google.com/forms/about/");
	};

	onClick_AboutUs = () => {
		window.open("https://www.lumoslabs.co/");
	};

	onClick_Reset = () => {
		window.location.reload();
	};

	/*************************************************
	*
	* React's Render Method
	*
	*************************************************/
	render() {
		return(
			<div className="setting-main-div">
				{/* <!-------------- Settings Box --------------> */}
				<div className= {this.state.open_Settings_Box?'settings_box activeQuiz':'settings_box'}>
					{/* <!-- Settings Box Header --> */}
					<header>
						<div className="title">Settings</div>
					</header>

					{/* <!-- Settings Box Section --> */}
					<section>
						{/* <!-- For Sound Section --> */}
						<div className="sound_Div">
							<div className="sound_text">Sound Volume</div>
							<div className="sound_slider">
								<input className="sound_slider_input"
									type="range" 
									min="0" 
									max="100" 
									defaultValue= {this.state.soundValue}
									onPointerUp={ (event) => {
										this.onChangeSoundSlider(event);
									}}/>
							</div>
							<div className="sound_slider_value">{this.state.soundValue}</div>
						</div>
						{/* <!-- For Music Section --> */}
						<div className="music_Div">
							<div className="music_text">Music Volume</div>
							<div className="music_slider">
								<input className="music_slider_input" 
									type="range" 
									min="0" 
									max="100" 
									defaultValue= {this.state.musicValue}
									onPointerUp={ (event) => {
										this.onChangeMusicSlider(event);
									}}/>
							</div>
							<div className="music_slider_value">{this.state.musicValue}</div>
						</div>
						{/* <!-- For Show Hint Section --> */}
						<div className="showHint_Div">
							<div className="showHint_text">Show Hints</div>
							<div className="showHint_toggle">
								<input type="checkbox"
									name=""
									checked={this.state.showHintValue}
									onChange={ (event) => {
										this.onChangeToggleButton(event);
									}}/>
							</div>
						</div>

						{/* <!-- For Instruction Section --> */}
						<div className="instruction_Div"
							onClick={ () => {
								this.onClickInstructionBox();
							}}>
							<div className="instruction_text">Instructions</div>
						</div>
					</section>

					{/* <!-- Settings Box Footer --> */}
					<footer>
						<ul>
							<li title="Home" onClick={ () => {
									this.onClick_Home();
								}}>
								<a>
									<i className="fa fa-home" aria-hidden="true"></i>
								</a>
							</li>
							<li title="Feedback" onClick={ () => {
									this.onClick_Feedback();
								}}>
								<a>
									<i className="fa fa-comments" aria-hidden="true"></i>
								</a>
							</li>
							<li title="About us" onClick={ () => {
									this.onClick_AboutUs();
								}}>
								<a>
									<i className="fa fa-info" aria-hidden="true"></i>
								</a>
							</li>
							<li title="Reset Player position (In-case : Player stuck in mesh)" onClick={ () => {
									this.onClick_Reset();
								}}>
								<a>
									<i className="fa fa-repeat" aria-hidden="true"></i>
								</a>
							</li>
						</ul>
					</footer>
				</div>

				{/************************ Instructions Box ************************/}
				<div className= {this.state.open_Instruction_Box?'info_box_Settings activeInfoSettings':'info_box_Settings'}>
						<div className="info_title_settings">	
							<span>Instructions</span>
						</div>
						<div className="info_list_settings">
							<div className="info_settings">1. Use <span>W,A,S,D</span> or <span>Arrow keys</span> to move Player.</div>
							<div className="info_settings">2. Adjust your viewing area by scrolling mouse.</div>
							<div className="info_settings">3. Use mouse to look around.</div>
							<div className="info_settings">4. Use <span>F</span> to toggle Fullscreen display.</div>
							<div className="info_settings">5. Use <span>Z</span> to change side of Player.</div>
							<div className="info_settings">6. Use <span>Shift</span> for Walk and <span>Space</span> for Jump.</div>
							<div className="info_settings">7. Use <span>Esc</span> to Close popup</div>
							<div className="info_settings">8. Use reset position button from settings to reset your Player's position.</div>
						</div>
						<div className="buttons_settings">
							<button className="quit_settings"
								onClick={()=>{this.exit_btn_onclick()}}>Close
							</button>
						</div>
				</div>
			</div>
		);
	};
};
