/*-- import statements --*/
import React, { Component } from "react";

/*-- import statement for babylonjs --*/
import { Engine, Scene } from "babylonjs";
import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import "babylonjs-loaders";
import { WaterMaterial } from "babylonjs-materials";
import { CharacterController } from "babylonjs-charactercontroller";
import { SkyMaterial } from "babylonjs-materials";

/*-- import statements for styles --*/
import SettingsPopupComponent from './SettingsPopupComponent';

/*-- import statements for images and videos --*/
import { float } from "@babylonjs/core/types";

/*-- global variable declaration --*/
var	engine	:	Engine;                                //This is for creating engine on which babylon will run
var	canvas	:	any;
var	gamepadManager	:	BABYLON.GamepadManager;

//for gamepad
var bMoveCameraAlpha		=	false;
var bMoveCameraAlphaLeft		=	false;
var bMoveCameraAlphaRight	=	false;

var bMoveCameraBeta		=	false;
var bMoveCameraBetaLeft	=	false;
var bMoveCameraBetaRight	=	false;
var gamepadSensitivity	=	0.025;

//for scene rendering counter
var	counter	:	number	=	0;
var	fadeLevel	:	float	=	1.0;

//for scene transition
var bOnPPABuilding		:	boolean	=	false;
var triggerFadeInOut	:	boolean	=	false;
var bInFading			:	boolean	=	false;

//for scene
var	scene_0	:	BABYLON.Scene;                                //This is for creating scene_0

var	bWKeyPressed	:	boolean	=	false;
var	bAKeyPressed	:	boolean	=	false;
var	bSKeyPressed	:	boolean	=	false;
var	bDKeyPressed	:	boolean	=	false;

var	isSoundOff			:	boolean	=	false;
var	isSoundOn				:	boolean	=	false;
var	isShift				:	boolean	=	false;
var	currentAmbientVolume	:	float	=	0.4;
var	tapSound				:	BABYLON.Sound;

/*--- Player ---*/
//for character movement
var	bPlayerJumped		:	boolean	=	false;
var	bFreezeControl		:	boolean	=	false;

//GUI
var	advancedTexture	:	GUI.AdvancedDynamicTexture;

//water
var	domebeach		:	BABYLON.AbstractMesh;
var	beach		:	BABYLON.AbstractMesh;
var	beach_arc1	:	BABYLON.AbstractMesh;
var	beach_arc2	:	BABYLON.AbstractMesh;
var	parkBeach		:	BABYLON.AbstractMesh;
var	sky			:	BABYLON.AbstractMesh;
var	character		:	BABYLON.AbstractMesh;

//settings components
var	soundValueParent	:	number	=	30;
var	musicValueParent	:	number	=	30;
var	bShowSettingsIcon	:	boolean	=	false;
var	menuOpen 			:	boolean	=	false;

//state
interface IState {
	currentActiveScene?		:	number;
	loadingData?			:	boolean;
	showSettingsIcon?		:	boolean;
	showSettings?			:	boolean;
	showHintFromSetting?	:	boolean;
}

// props
interface IProps {

}

export default class MainCanvasComponent extends Component<IProps, IState> {
	/*--- Global Variable Declaration and initialization ---*/
	gui				:	any;
	button1			:	any;
	motherURL			:	string;
	envName			:	string;
	modelName			:	string;

	//for external models
	cityModel				:	any;

	//lights
	directionalLight	:	any;

	//atmosphere
	water			:	any;

	//raycaster
	rayOrigin		:	BABYLON.Vector3;
	forward		:	BABYLON.Vector3;
	rayDirection	:	BABYLON.Vector3;
	rayLength		:	number;
	rayCaster		:	any;
	hit			:	any;

	//character
	player				:	any;
	bPlayerOnShoulderRight	:	boolean;
	jumpCounter			:	number;

	characterFalling		:	any;
	characterIdle			:	any;
	characterIdleJumping	:	any;
	characterRunning		:	any;
	characterRunJumping		:	any;
	characterWalking		:	any;
	bShiftKeyPressed		:	boolean;
	bSpaceKeyPressed		:	boolean;

	//sky material
	skyMaterial	:	any;

	//character nodes
	skeleton	:	any;

	//character controller
	characterController		:	any;

	//camera
	mainCamera			:	any;			//This is for creating mainCamera
	radiusMax				:	number;
	bInTPPMode			:	boolean;
	cameraTargetXOffset		:	float;
	cameraTargetYOffset		:	float;

	//soundFX
	menuPanel		:	any;
	startButton	:	any;
	ambientSound_0	:	any;
	walkingSound	:	any;
	runningSound	:	any;
	jumpingSound	:	any;

	/*--- Code ---*/
	constructor(props: IProps) {
		super(props);

		//GUI
		this.gui				=	null;
		this.button1			=	null;
		this.motherURL			=	"https://lumos-metaverse-assets.s3.us-east-2.amazonaws.com/";
		this.envName			=	"Explorable_City_2.glb";
		this.modelName			=	"avatar/bot.glb";

		//lights
		this.directionalLight	=	null;

		//models
		this.cityModel			=	null;

		//atmosphere elements / environment
		this.water		=	null;

		//raycaster
		this.rayOrigin		=	BABYLON.Vector3.Zero();
		this.forward		=	BABYLON.Vector3.Zero();
		this.rayDirection	=	BABYLON.Vector3.Zero();
		this.rayLength		=	20;
		this.rayCaster		=	null;
		this.hit			=	null;

		//character
		this.player				=	null;
		this.bPlayerOnShoulderRight	=	false;
		this.jumpCounter			=	0;

		this.characterFalling		=	null;
		this.characterIdle			=	null;
		this.characterIdleJumping	=	null;
		this.characterRunning		=	null;
		this.characterRunJumping		=	null;
		this.characterWalking		=	null;

		this.bShiftKeyPressed	=	false;
		this.bSpaceKeyPressed	=	false;

		//sky material
		this.skyMaterial		=	null;

		//character node
		this.skeleton			=	null;

		//character controller
		this.characterController	=	null;

		//camera
		this.mainCamera		=	null;
		this.radiusMax			=	4;
		this.bInTPPMode		=	true;
		this.cameraTargetXOffset	=	3.5;
		this.cameraTargetYOffset	=	0;

		//soundFX
		this.menuPanel		=	null;
		this.startButton	=	null;
		this.ambientSound_0	=	null;
		this.walkingSound	=	null;
		this.runningSound	=	null;
		this.jumpingSound	=	null;

		this.state = {
			currentActiveScene	:	0,
			loadingData		:	false,
			showSettingsIcon	:	false,
			showSettings		:	false,
			showHintFromSetting	:	true
		};
	};

	/*************************************************
	 *
	 * React Life Cycle method calls immediately after application born. Here Acts as Initialization method
	 *
	 *************************************************/
	//Component Did Mount
	componentDidMount() {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		counter += 1;

		if (counter === 2) {
			this.initialize();
		}
	};

	/*************************************************
	 *
	 * React Life Cycle method calls when the state of the component changes.
	 *
	 *************************************************/
	componentDidUpdate = (prevProps : any, prevState : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		if (this.state.loadingData === true) {

			//attach controls from mainCamera
			this.mainCamera.attachControl(canvas, true);

			//enable settings Icon
			bShowSettingsIcon = true;

			//prepare shader for future fade-in-fade-out
			this.prepareFadeInOutEffect();
		}

		this.resize();
	};

	/*************************************************
	 *
	 * Function to Handle onClick Setting icon
	 *
	 *************************************************/
	handleSettingsButton = () => {
		/*--- Local Variable Declaration and initialization ---*/
		const menuBtn = document.getElementsByClassName("menu_btn");

		/*--- Code ---*/
		//exit from pointerlock
		engine.exitPointerlock();

		if (menuOpen === false) {
			//show settings popup
			menuBtn[0].classList.add('open');
			menuOpen = true;
			this.setState({
				showSettings	:	true
			});
		}
		else
		{
			//hide settings popup
			menuBtn[0].classList.remove('open');
			menuOpen = false;
			this.setState({
				showSettings	:	false
			});
		}
	};

	/*************************************************
	 *
	 * Initialization method
	 *
	 *************************************************/
	initialize = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code --*/
		console.clear();

		//fetching canvas details
		canvas = document.getElementById("canvas") as HTMLCanvasElement;
		console.log("Canvas created successfully!");

		//3D engine required for creating scene
		engine = new BABYLON.Engine(canvas, true, {doNotHandleContextLost	:	true}, true);
		engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
		engine.enableOfflineSupport	=	false;
		engine.doNotHandleContextLost	=	true;
		engine.cullBackFaces		=	true;

		//create scene_0
		this.createScene0();

		this.setState({
			currentActiveScene	:	0
		});

		//advanced dynamic textures created in advance for future use
		advancedTexture	=	GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		advancedTexture.useInvalidateRectOptimization = false;

		//create axis helper
		// const axes = new BABYLON.AxesViewer(scene_0, 25);

		//resize
		this.resize();

		//start button
		this.menuPanel		=	document.getElementById("menuPanel");
		this.startButton	=	document.getElementById("startButton");

		//key down / key up events (WndProc)
		this.startButton.addEventListener("click",() => {
			//load all necessary sound
			this.loadSound(soundValueParent, musicValueParent);
		});

		document.addEventListener("keydown", (event) => {
			this.keyDown(event);      
		});

		document.addEventListener("keyup", (event) => {
			this.keyUp(event);
		});

		//for gamepad
		gamepadManager = new BABYLON.GamepadManager();

		gamepadManager.onGamepadConnectedObservable.add( (gamepad, state) => {
			console.log("Controller Connected");
			this.gamepadHandler(gamepad, state);
		});

		gamepadManager.onGamepadDisconnectedObservable.add( (gamepad, state) => {
			console.log("Controller Disconnected");
		});
	};

	/*************************************************
	 *
	 * To Handle Gamepad Event
	 *
	 *************************************************/
	gamepadHandler = (gamepad : any, state : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code --*/
		if (gamepad instanceof BABYLON.Xbox360Pad) {

			//for buttons
			gamepad.onButtonDownObservable.add((button, state) => {
				// console.log(BABYLON.Xbox360Button[button], " is pressed", button);
				switch (button) {
					//A Button
					case 0:
						if(this.bInTPPMode === true){
							this.mainCamera.radius = 0.0;
						}
						else{
							this.mainCamera.radius = this.radiusMax;
						}
					break;

					//B Button
					case 1:
						this.characterController.jump(true);
						if (this.state.loadingData === true) {
							if (this.jumpCounter < 5) {
								this.bSpaceKeyPressed = true;
								this.jumpCounter += 1;
								this.playSound();
							}
						}
					break;

					//X Button
					case 2:

					break;

					//Y Button
					case 3:
						if (this.state.currentActiveScene === 0 && this.characterIdle.isPlaying === true) {
							/*--- For PPA Building Scene ---*/
							if (bOnPPABuilding === true) {
								tapSound.play();
								triggerFadeInOut = !triggerFadeInOut;
							}
						}
					break;

					//LB Button
					case 4:
						this.bPlayerOnShoulderRight = false;
					break;

					//RB Button
					case 5:
						this.bPlayerOnShoulderRight = true;
					break;

					//Back Button
					case 8:
						//Toggle settings popup
						this.handleSettingsButton();
					break;

					//Start Button
					case 9:
					break;

					//Left Stick
					case 10:

					break;

					//Right Stick
					case 11:

					break;

					default:

					break;
				}
			});

			// for LEFT sticks
			gamepad.onleftstickchanged( (values) => {
				let X = Number(values.x.toString().slice(0, 3));
				let Y = Number(values.y.toString().slice(0, 3));

				if (Y === -0) {
					Y = 0;
				}

				if (X !== 0) {
					if (X < 0) {
						this.characterController.turnLeft(true)
					}
					else if (X > 0) {
						this.characterController.turnRight(true);
					}
				}
				else{
					this.characterController.turnLeft(false);
					this.characterController.turnRight(false);
				}

				if (Y !== 0) {
					if (Y < 0) {
						this.characterController.walk(true);
					}
					else if (Y > 0) {
						this.characterController.walkBack(true);
					}
				}
				else{
					this.characterController.walk(false);
					this.characterController.walkBack(false);
				}
			});

			//for RIGHT sticks
			gamepad.onrightstickchanged( (values) => {
				let X = Number(values.x.toString().slice(0, 3));
				let Y = Number(values.y.toString().slice(0, 3));

				if (Y === -0) {
					Y = 0;
				}

				//for X
				if (X !== 0.00) {
					bMoveCameraAlpha = true;

					if (X > 0) {
						bMoveCameraAlphaRight = true;
						bMoveCameraAlphaLeft = false;
					}
					else if (X < 0) {
						bMoveCameraAlphaRight = false;
						bMoveCameraAlphaLeft = true;
					}
				}
				else
				{
					bMoveCameraAlpha = false;
				}

				//for Y
				if (Y !== 0.00) {
					bMoveCameraBeta = true;

					if (Y > 0) {
						bMoveCameraBetaRight = true;
						bMoveCameraBetaLeft = false;
					}
					else if (Y < 0) {
						bMoveCameraBetaRight = false;
						bMoveCameraBetaLeft = true;
					}
				}
				else
				{
					bMoveCameraBeta = false;
				}
			});

			//for LEFT trigger
			gamepad.onlefttriggerchanged( (values) => {
				if (Number(values.toString().slice(0, 3)) > 0) {
					this.characterController.run(true);
					if (this.state.loadingData === true) {
						this.bShiftKeyPressed	=	false;
						isSoundOff			=	true;
						this.playSound();
					}
				}
				else{
					this.characterController.run(false);
					this.characterController.walk(true);
				}
			});

			//for RIGHT trigger
			gamepad.onrighttriggerchanged( (values) => {
				console.log('RIGHT : ', values.toFixed(2));
			});
		}
	};

	/*************************************************
	 *
	 * To handle Key Up Event (WndProc)
	 *
	 *************************************************/
	keyUp = (event : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code --*/
		//for escape
		if (event.key === "Escape") {

		}

		//for space bar
		if (event.key === " ") {
			if (this.state.loadingData === true) {
				this.bSpaceKeyPressed	=	false;
				this.jumpCounter		=	0;
				this.playSound();
			}
		}

		//for shift
		if (event.keyCode === 16) {
			if (this.state.loadingData === true) {
				this.bShiftKeyPressed	=	false;
				isSoundOff			=	true;
				this.playSound();
			}
		}

		//for alt/cmd
		if (event.keyCode === 18 || event.keyCode === 91) {

		}

		switch (event.key) {
			case "W":
			case "w":
			case "ArrowUp":
				if (this.state.loadingData === true) {
					bWKeyPressed	=	false;
					isSoundOff	=	true;
					this.playSound();
				}
				break;

			case "A":
			case "a":
			case "ArrowLeft":
				if (this.state.loadingData === true) {
					bAKeyPressed	=	false;
					isSoundOff	=	true;
					this.playSound();
				}
				break;

			case "S":
			case "s":
			case "ArrowDown":
				if (this.state.loadingData === true) {
					bSKeyPressed	=	false;
					isSoundOff	=	true;
					this.playSound();
				}
				break;

			case "D":
			case "d":
			case "ArrowRight":
				if (this.state.loadingData === true) {
					bDKeyPressed	=	false;
					isSoundOff	=	true;
					this.playSound();
				}
				break;
		}
	};

	/*************************************************
	 *
	 * To handle Key Down Event (WndProc)
	 *
	 *************************************************/
	keyDown = (event : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code --*/
		//for escape
		if (event.key === "Escape") {
			if (this.state.showSettings === true)
			{
				if (engine.isPointerLock === false) {
					//exit from pointerlock
					engine.enterPointerlock();
				}
			}	
		}

		//for space bar
		if (event.key === " ") {
			if (this.state.loadingData === true) {
				if (this.jumpCounter < 5) {
					this.bSpaceKeyPressed = true;
					this.jumpCounter += 1;
					this.playSound();
				}
			}
		}

		//for shift
		if (event.keyCode === 16) {
			if (this.state.loadingData === true) {
				this.bShiftKeyPressed = true;
				this.playSound();
			}
		}

		//for Alt/Cmd
		if (event.keyCode === 18 || event.keyCode === 91) {
			this.characterController?.walk(false);
			this.characterController?.run(false);
			this.characterController?.turnLeft(false);
			this.characterController?.turnRight(false);
			this.characterController?.walkBack(false);
		}

		//switch case for other Keys
		switch (event.key) {
			case "W":
			case "w":
			case "ArrowUp":
				if (this.state.loadingData === true) {
					this.playSound();
					bWKeyPressed	=	true;
				}
				break;

			case "A":
			case "a":
			case "ArrowLeft":
				if (this.state.loadingData === true) {
					this.playSound();
					bAKeyPressed	=	true;
				}
			 break;

			case "S":
			case "s":
			case "ArrowDown":
				if (this.state.loadingData === true) {
					this.playSound();
					bSKeyPressed	=	true;
				}
				break;

			case "D":
			case "d":
			case "ArrowRight":
				if (this.state.loadingData === true) {
					this.playSound();
					bDKeyPressed	=	true;
				}
			 break;

			case "X":
			case "x":
				console.log("Check 1 : ", this.mainCamera.position.y);
				break;

			case "Z":
			case "z":
				if (this.bPlayerOnShoulderRight === true) {
					this.bPlayerOnShoulderRight = false;
				}
				else{
					this.bPlayerOnShoulderRight = true;
				}
				break;

			case "E":
			case "e":
				console.log(this.player.position);
				break;

			case "F":
			case "f":
				this.toggleFullscreen();
				break;
		}
	};

	/*************************************************
	 *
	 * Function to Create all assets for Scene 0
	 *
	 *************************************************/
	createScene0 = () => {
		/*--- Local Variable Declaration and initialization ---*/
		var options;
		var optimizer;

		/*--- Code ---*/
		//create basic BJS Scene object
		scene_0 = new Scene(engine);

		scene_0.clearCachedVertexData();
		scene_0.cleanCachedTextureBuffer();

		scene_0.pointerMovePredicate	= () => false;
		scene_0.pointerDownPredicate	= () => false;
		scene_0.pointerUpPredicate	= () => false;

		//enable collision to scene_0
		scene_0.collisionsEnabled = true;
		scene_0.gravity = new BABYLON.Vector3(0, -9.81, 0);

		scene_0.autoClear					=	false;	// Color buffer
		scene_0.blockMaterialDirtyMechanism	=	true;
		scene_0.autoClearDepthAndStencil		=	false;	// Depth and stencil, obviously

		//clear color in Black Screen
		scene_0.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 1.0);
		scene_0.clearCachedVertexData();
        	scene_0.cleanCachedTextureBuffer();

		BABYLON.Database.IDBStorageEnabled = true;

		//optimizer
		options = new BABYLON.SceneOptimizerOptions(80,800);
		options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1.5));
		options.targetFrameRate = 90;

		options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));

		BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed()// Optimizer
		optimizer = new BABYLON.SceneOptimizer(scene_0, options);
		optimizer.start();

		//directional Light
		this.createDirectionalLight(scene_0);

		//loading Model
		this.loadModel(scene_0);

		//setting mainCamera
		this.setupCamera(scene_0);

		//calling draw which creates mesh and light
		this.draw();

		//creating basic babylon cursor for user
		this.createCursor();
	};

	/*************************************************
	 *
	 * Function to Load all the Sound from Scene 0
	 *
	 *************************************************/
	loadSound = (s_Value: any, m_Value: any) => {
		/*--- Local Variable Declaration and initialization ---*/
		let soundCorrection	=	s_Value / 100;
		let musicCorrection	=	m_Value / 100;

		/*--- Code ---*/
		//exit from pointerlock
		engine.enterPointerlock();

		//hide click to start button
		this.menuPanel.style.display = "none";

		/*--- Tap Sound ---*/
		tapSound = new BABYLON.Sound("elevatorReachedSound", "/sounds/tap_sound.mp3", scene_0, null, 
			{
				volume	:	soundCorrection
			}
		);
		
		/*--- Walking Sound ---*/
		this.walkingSound = new BABYLON.Sound("walkingSound", "/sounds/walk.mp3", scene_0, null,
			{
				loop		:	true,
				volume	:	soundCorrection
			}
		);

		/*--- Running Sound ---*/
		this.runningSound = new BABYLON.Sound("runningSound", "/sounds/run.mp3", scene_0, null,
			{
				loop		:	true,
				volume	:	soundCorrection
			}
		);

		/*--- Ambient Sound ---*/
		this.ambientSound_0 = new BABYLON.Sound("ambientSound_0", "/sounds/ambient.mp3", scene_0, null,
			{
				loop		:	true,
				autoplay	:	true,
				volume	:	musicCorrection
			}
		);

		/*--- Jumping Sound ---*/
		this.jumpingSound = new BABYLON.Sound("jumpingSound", "/sounds/jump.mp3", scene_0, null,
			{
				loop		:	false,
				autoplay	:	false,
				volume	:	soundCorrection
			}
		);
	};

	/*************************************************
	 *
	 *  Function to Pick Mesh Function On mouse Click Event
	 *
	 *************************************************/
	pickedMeshEventOnClick = (cursorHit : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		if (cursorHit.pickedMesh) {
			//performing actions on hitting on any mesh using cursor
			if (cursorHit.pickedMesh.id != null) {
				
			}
		}
	};

	/*************************************************
	 *
	 *  Function to Pick Mesh Function On mouse Hover Event
	 *
	*************************************************/
	pickedMeshEventOnHover = (cursorHit: any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		if (cursorHit.pickedMesh) {			

		}
	};

	/*************************************************
	 *
	 *  Function to Toggle Function for Fullscreen
	 *
	 *************************************************/
	toggleFullscreen = () => {
		/*--- Local Variable Declaration and initialization ---*/
		var fullscreen_element = document.fullscreenElement;

		/*--- Code ---*/
		if (fullscreen_element == null) {
			if (canvas.requestFullscreen) {
				document.body.requestFullscreen();
			}
			else if (canvas.webkitRequestFullscreen) {
				document.body.requestFullscreen();
			}
			else if (canvas.mozRequestFullScreen) {
				document.body.requestFullscreen();
			}
			else if (canvas.msRequestFullscreen) {
				document.body.requestFullscreen();
			}
		}
		else {
			if (document.exitFullscreen) {
				document.exitFullscreen();

				this.resize();
			}
		}
	};

	/*************************************************
	 *
	 *  Function to setup Directional Light
	 *
	 *************************************************/
	createDirectionalLight = (currentScene : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		this.directionalLight = new BABYLON.DirectionalLight(
			"directionalLight",
			new BABYLON.Vector3(0, 10, 10),
			currentScene
		);

		this.directionalLight.intensity = 0.8;
	};

	/*************************************************
	 * 
	 * Function to Load Model
	 *
	 *************************************************/
	//City
	loadModel = async (currentScene : any) => {
		/*--- Local Variable Declration and initialization ---*/
		var material		=	new BABYLON.StandardMaterial("myMat", currentScene);
		var tempMat = new BABYLON.StandardMaterial("tempMat", scene_0);

		/*--- Code --*/
		material.backFaceCulling	=	false;
		tempMat.backFaceCulling	=	false;    

		this.cityModel = BABYLON.SceneLoader.ImportMesh(
			"",
			"/assets/",
			"Explorable_City_2.glb",
			currentScene,
			(meshes, particals, skeletons, animationGroups) => {
				/*--- Code --*/
				scene_0.createDefaultCameraOrLight(false);

				for (let i = 0; i < meshes.length; i++) {
					if (	meshes[i].name.includes("Floor_middle_building") ||
						meshes[i].name.includes("New_Road") ||
						meshes[i].name.includes("Barrier") ||
						meshes[i].name.includes("screen") ||
						meshes[i].name.includes("Screen_Emission") ||
						meshes[i].name.includes("Middle_building") ||
						meshes[i].name.includes("middle_building_emission"))
					{
						meshes[i].checkCollisions = true;
					}

					if (meshes[i].name.includes("New_Road")) {
						beach = meshes[i];
					}
					
					if (meshes[i].name.includes("Floor_middle_building")) {
						beach_arc1 = meshes[i];
					}
				};

				console.log("City Loaded Successfully!");

				this.drawWater();

				//proceed for Loading Character
				this.loadCharacterModel(scene_0);
			}
		); 

		this.cityModel.scaling		=	new BABYLON.Vector3(100.0, 100.0, 100.0);
	};

	/*--------- Player ---------*/
	loadCharacterModel = (currentScene : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		BABYLON.SceneLoader.ImportMesh(
			"",
			"/assets/",
			"mainCharacter.glb",
			currentScene, 
			(newMeshes, particleSystems, skeletons, animationGroups) => {
				this.skeleton	=	skeletons[0];        
				this.player	=	newMeshes[0];
				character		=	newMeshes[2];

				this.player.skeleton	=	this.skeleton;
				this.player.layerMask	=	1;

				this.player.checkCollisions	=	true;

				this.player.ellipsoid		=	new BABYLON.Vector3(0.5, 1, 0.5);
				this.player.ellipsoidOffset	=	new BABYLON.Vector3(0, 1, 0);

				this.player.rotation			=	this.player.rotationQuaternion.toEulerAngles();
				this.player.rotationQuaternion	=	null;

				this.player.rotation	=	new BABYLON.Vector3(0, -Math.PI / 2, 0);
				this.player.position	=	new BABYLON.Vector3(-17.66157847179414, 23, 2.2060328840614463);

				// console.log("animationGroups : ", animationGroups);

				this.characterFalling		=	animationGroups[1];
				this.characterIdle			=	animationGroups[2];
				this.characterIdleJumping	=	animationGroups[3];
				this.characterRunning		=	animationGroups[5];
				this.characterRunJumping		=	animationGroups[6];
				this.characterWalking		=	animationGroups[9];

				this.characterMovement();

				this.setState({
					loadingData	:	true,
				});
			}
		);

		console.log("Character Loaded Successfully!");
	};

	/*************************************************
	*
	*  Update Function for Third Person Character Movement
	*
	*************************************************/
	characterMovement = () => {
		/*--- Local Variable Declaration and initialization ---*/
		let agMap:{} = {
			"fall"		:	this.characterFalling,
			"idle"		:	this.characterIdle,
			"idleJump"	:	this.characterRunJumping,
			"run"		:	this.characterWalking,
			"runJump"		:	this.characterRunJumping,
			"walk"		:	this.characterRunning
		};

		/*--- Code ---*/
		this.characterController = new CharacterController(this.player, this.mainCamera, scene_0, agMap, true);

		//characterController can run in one of two modes - 0 or 1.
		this.characterController.setMode(0);

		//if the camera comes close to the player we want to enter first person mode.
		this.characterController.setNoFirstPerson(true);

		//the height of steps which the player can climb
		this.characterController.setStepOffset(1);

		//the minimum and maximum slope the player can go up
		//between the two, the player will start sliding down if it stops
		this.characterController.setSlopeLimit(30,60);

		//tell controller 
		// - which animation range should be used for which player animation
		// - rate at which to play that animation range
		// - whether the animation range should be looped
		this.characterController.setFallAnim(		"fall",		1.0,	true);
		this.characterController.setIdleAnim(		"idle",		1.0,	true);
		this.characterController.setRunAnim(		"walk",		1.0,	true);
		this.characterController.setWalkAnim(		"run",		1.0,	true);
		this.characterController.setTurnLeftAnim(	"turnLeft",	1.0,	true);
		this.characterController.setTurnRightAnim(	"turnRight",	1.0,	true);
		this.characterController.setWalkBackAnim(	"walkBack",	1.0,	true);
		this.characterController.setIdleJumpAnim(	"idleJump",	1.0,	false);
		this.characterController.setRunJumpAnim(	"runJump",	1.0,	false);
		//set the animation range name to "null" to prevent the controller from playing a player animation.
		// cc.setFallAnim("null", 2, false);

		//turn left or turn right keys result in avatar facing and moving left or right with respect to camera rather then just turning left or right
		this.characterController.setTurningOff(true);

		//if something comes between the camera and avatar the camera snaps to a position in front of that something
		this.characterController.setCameraElasticity(false);

		//To change gravity or speed at which avatar/player is moved
		this.characterController.setGravity(50);

		this.characterController.setWalkSpeed(10);
		this.characterController.setRunSpeed(2);
		this.characterController.setJumpSpeed(22);

		this.characterController.strafeLeft(false);
		this.characterController.strafeRight(false);

		this.characterController.setStrafeLeftKey("null");
		this.characterController.setStrafeRightKey("null");

		this.characterController.start();

		this.characterController.setCameraTarget(new BABYLON.Vector3(0, 2, 0));

		this.player.onCollide = (otherMesh : any) => {
			/*--- for exception handling ---*/
			if (otherMesh.name.includes("exceptionHandlingPlane")) {
				this.player.rotation	=	new BABYLON.Vector3(0, -Math.PI / 2, 0);
				this.player.position	=	new BABYLON.Vector3(-17.66157847179414, 23, 2.2060328840614463);

				this.mainCamera.alpha	=	Math.PI;
				this.mainCamera.beta	=	1.769;
			}
		};
	};

	/*************************************************
	*
	*  Function for drawing Ellipsoid around mesh
	*
	*************************************************/
	drawEllipsoid = (mesh : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		let testMat	=	new BABYLON.StandardMaterial("testMat", scene_0);
		testMat.backFaceCulling	=	false;

		let test = BABYLON.CreateDisc("test", {
			radius	:	1
		}, scene_0);

		test.material		=	testMat;
		test.position.y	=	1.5;
		test.rotation		=	new BABYLON.Vector3(Math.PI / 2, 0, 0);
		test.parent		=	mesh;
	};

	/*************************************************
	 *
	 *  Draw Water
	 *
	 *************************************************/
	drawWater = () =>{
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		//water
		var water = BABYLON.MeshBuilder.CreateGround("water", {width: 1500, height: 1500}, scene_0);

		water.position.y	+=	22;
		 this.water = new WaterMaterial(
			"water",
			scene_0,
			new BABYLON.Vector2(800, 800)
		);

		//stylized water shader
		BABYLON.Effect.ShadersStore["customVertexShader"]= "\r\n"+   
		"precision highp float;\r\n"+

		//attributes
		"attribute vec3 position;\r\n"+
		"attribute vec2 uv;\r\n"+
		//uniforms
		"uniform mat4 worldViewProjection;\r\n"+
		"uniform float time;\r\n"+
		//varying
		"varying vec3 vPosition;\r\n"+
		"varying vec4 vClipSpace;\r\n"+
		"void main(void) {\r\n"+
			"float scale = 1.0;\r\n"+
			//calc new position
			"float newY = (sin(position.x * 1.0 / scale + time * 1.0));\r\n"+
			//new model position
			"vec3 newPositionM = vec3(position.x,newY,position.z);\r\n"+
			"gl_Position = worldViewProjection * vec4(newPositionM, 1.0);\r\n"+
			//grab vertex position in world space
			"vPosition = position;\r\n"+
			//grab vertex position in view space
			"vClipSpace = gl_Position;\r\n"+
		"}\r\n";

		BABYLON.Effect.ShadersStore["customFragmentShader"]="\r\n"+
			"precision highp float;\r\n"+

			//Varyings
			"varying vec3 vPosition;\r\n"+
			//world distance, camera to water
			"varying vec4 vClipSpace;\r\n"+
			//uniforms
			"uniform sampler2D depthTex;\r\n"+
			"uniform sampler2D refractionSampler;\r\n"+
			"uniform float camMinZ;\r\n"+
			"uniform float camMaxZ;\r\n"+
			"uniform float maxDepth;\r\n"+
			//water colors
			"uniform vec4 wDeepColor;\r\n"+
			"uniform vec4 wShallowColor;\r\n"+
			"uniform float time;\r\n"+
			"uniform float wNoiseScale;\r\n"+
			"uniform float wNoiseOffset;\r\n"+
			"uniform float fNoiseScale;\r\n"+
			"float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\r\n"+
			"vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\r\n"+
			"vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}\r\n"+

			"float noise(vec3 p){\r\n"+
				"vec3 a = floor(p);\r\n"+
				"vec3 d = p - a;\r\n"+
				"d = d * d * (3.0 - 2.0 * d);\r\n"+

				"vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);\r\n"+
				"vec4 k1 = perm(b.xyxy);\r\n"+
				"vec4 k2 = perm(k1.xyxy + b.zzww);\r\n"+

				"vec4 c = k2 + a.zzzz;\r\n"+
				"vec4 k3 = perm(c);\r\n"+
				"vec4 k4 = perm(c + 1.0);\r\n"+

				"vec4 o1 = fract(k3 * (1.0 / 41.0));\r\n"+
				"vec4 o2 = fract(k4 * (1.0 / 41.0));\r\n"+

				"vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);\r\n"+
				"vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);\r\n"+

				"return o4.y * d.y + o4.x * (1.0 - d.y);\r\n"+
			"}\r\n"+

			"void main(void) {\r\n"+
				//init baseColor
				"vec4 baseColor = vec4(0.0);\r\n"+
				//generate noise value
				"float waveNoise = noise(vec3(0., time, 0.)+vPosition*wNoiseScale)*wNoiseOffset;\r\n"+
				//remap frag screen space coords to ndc (-1 to +1)
				"vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;\r\n"+
				//grab depth value (0 to 1) at ndc for object behind water
				"float depthOfObjectBehindWater = texture2D(depthTex, vec2(ndc.x, ndc.y)+waveNoise).r;\r\n"+
				//get depth of water plane
				"float linearWaterDepth = (vClipSpace.z + camMinZ) / (camMaxZ + camMinZ);\r\n"+
				//calculate water depth scaled to camMaxZ since camMaxZ >> camMinZ
				"float waterDepth = camMaxZ*(depthOfObjectBehindWater - linearWaterDepth);\r\n"+
				//get water depth as a ratio of maxDepth
				"float wdepth = clamp((waterDepth/maxDepth), 0.0, 1.0);\r\n"+
				//mix water colors based on depth
				"baseColor = mix(wShallowColor, wDeepColor, wdepth);\r\n"+
				//mix colors with scene render
				"vec4 refractiveColor = texture2D(refractionSampler, vec2(ndc.x, ndc.y)+waveNoise);\r\n"+
				"baseColor = mix(refractiveColor, baseColor, baseColor.a);\r\n"+
				//decide the amount of foam 
				"float foam = 1.0-smoothstep(0.1, 0.2, wdepth);\r\n"+
				//make the foam effect using noise
				"float foamEffect = smoothstep( 0.1, 0.2, noise(vec3(0., time, 0.)+vPosition*fNoiseScale*0.3)*foam);\r\n"+
				"baseColor.rgba += vec4(foamEffect);\r\n"+
				//final result
				"gl_FragColor = baseColor;\r\n"+	
			"}\r\n";

		var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene_0, {vertex: "custom",fragment: "custom"},
		{
			attributes	:	["position", "normal", "uv"],
			uniforms		:	["world", "worldView", "worldViewProjection", "view", "projection"],
		});

		//linear depth only!!
		var depthRenderer	=	scene_0.enableDepthRenderer(scene_0.activeCamera,false);
		var depthTex		=	depthRenderer.getDepthMap();
		depthTex.renderList	=	[beach, beach_arc1, beach_arc2, domebeach, parkBeach, sky, character];

		var _refractionRTT					=	new BABYLON.RenderTargetTexture("water_refraction", { width: 128, height: 128 }, scene_0, false, true);
		_refractionRTT.wrapU				=	BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
		_refractionRTT.wrapV				=	BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
		_refractionRTT.ignoreCameraViewport	=	true;
		_refractionRTT.refreshRate			=	1;
		_refractionRTT.renderList?.push(beach, beach_arc1, beach_arc2, domebeach, parkBeach, character);

		scene_0.customRenderTargets.push(_refractionRTT);

		//set shader parameters
		shaderMaterial.setFloat("camMinZ",				this.mainCamera.minZ);
		shaderMaterial.setFloat("camMaxZ",				this.mainCamera.maxZ);
		shaderMaterial.setFloat("time",				0);
		shaderMaterial.setFloat("wNoiseScale",			4.0);
		shaderMaterial.setFloat("wNoiseOffset",			0.01);
		shaderMaterial.setFloat("fNoiseScale",			8.0);
		shaderMaterial.setFloat("maxDepth",			5.0);
		shaderMaterial.setVector4("wDeepColor",			new BABYLON.Vector4(0.0,0.2,0.5,0.8));
		shaderMaterial.setVector4("wShallowColor",		new BABYLON.Vector4(0.3,0.4,0.8,0.5));
		shaderMaterial.setTexture("depthTex",			depthTex);
		shaderMaterial.setTexture("refractionSampler",	_refractionRTT);

		var time	=	0;
		scene_0.registerBeforeRender(() => {
				time	+=	engine.getDeltaTime() * 0.001;
				shaderMaterial.setFloat("time", time);
		});

		water.material = shaderMaterial;
	};

	/*************************************************
	 *
	 *  Function to Resize Event Handler For Engine/Canvas
	 *
	 *************************************************/
	resize = () => {
		/*--- Local Variable Declaration and Initialization ---*/

		/*--- Code ---*/
		window.addEventListener("resize", function () {
			engine.resize();
		});
	};

	/*************************************************
	 *
	 *  Draw() or Display() Function
	 *
	 *************************************************/
	draw = () => {
		/*--- Local Variable Declaration and initialization ---*/
		var light;
		var plane;
		var skybox;

		/*--- Code ---*/
		//creating hemispheric light for scene_0.
		//scene required atleast one light
		light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,80, 0), scene_0);
		light.intensity = 0.9;

		//plain for exception handling
		plane = BABYLON.CreatePlane("exceptionHandlingPlane", { size : 1000 }, scene_0);
		plane.rotation	=	new BABYLON.Vector3(Math.PI / 2, 0, 0);
		plane.position	=	new BABYLON.Vector3(0, -100, 0);
		plane.checkCollisions	=	true;
		plane.visibility		=	0;

		this.skyMaterial = new SkyMaterial("skyMaterial", scene_0);
		this.skyMaterial.backFaceCulling	=	false;
		this.skyMaterial.inclination		=	-0.3;

		skybox	=	BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene_0);
		skybox.material = this.skyMaterial;

		this.renderLoop();
	};

	/*************************************************
	 *
	 *  Function for Action Camera
	 *
	**************************************************/
	createMainCamera0 = (currentScene : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		this.mainCamera	=	new BABYLON.ArcRotateCamera(
								"mainCamera",
								-Math.PI / 2,
								Math.PI / 1.95,
								this.radiusMax,
								BABYLON.Vector3.Zero(),
								currentScene);

		this.mainCamera.wheelPrecision	=	10;
		this.mainCamera.checkCollisions	=	false;

		this.mainCamera.lowerRadiusLimit	=	0;
		this.mainCamera.upperRadiusLimit	=	this.radiusMax;

		this.mainCamera.fov			=	0.60;
		this.mainCamera.layerMask	=	1;
		this.mainCamera.radius		=	this.radiusMax;
		this.mainCamera.minZ		=	0.1;
		this.mainCamera.alpha		=	Math.PI;
		this.mainCamera.beta		=	1.769;

		this.mainCamera.keysLeft		=	[];
		this.mainCamera.keysRight	=	[];
		this.mainCamera.keysUp		=	[];
		this.mainCamera.keysDown		=	[];

		this.mainCamera.attachControl(canvas, false);
	};

	/*************************************************
	 *
	 *  Function for Setting Action Camera
	 *
	*************************************************/
	setupCamera = (currentScene : any) => {
		/*--- Local Variable Declaration and Initialization ---*/
		var framesPerSecond	=	60;
		var gravity		=	-9.81;

		/*--- Code ---*/
		currentScene.gravity = new BABYLON.Vector3(0.0, gravity / framesPerSecond, 0.0);

		//if mainCamera is in Intro
		this.createMainCamera0(currentScene);

		currentScene.activeCameras = [];

		currentScene.activeCameras.push(this.mainCamera);
	};

	/*************************************************
	*
	*  Trigger Function for Fade-Out Effect
	*
	*************************************************/
	prepareFadeInOutEffect = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		BABYLON.Effect.RegisterShader("fadeOutEffect", 
						"precision highp float;" +
						"varying vec2 vUV;" +
						"uniform sampler2D textureSampler; " +
						"uniform float fadeLevel; " +
						"void main(void){" +
							"vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
							"baseColor.a = 1.0;" +
							"gl_FragColor = baseColor;" +
						"}");

		var postProcess = new BABYLON.PostProcess("Fade", "fadeOutEffect", ["fadeLevel"], null, 1.0, this.mainCamera);

		postProcess.onApply = (effect) => {
			effect.setFloat("fadeLevel", fadeLevel);      
		};	
	};

	/*************************************************
	 *
	 *  Function to create Raycaster
	 *
	*************************************************/
	createRayCaster = (currentCamera : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		this.rayOrigin	=	currentCamera.position;
		this.forward	=	new BABYLON.Vector3(0, 0, 1);
		this.forward	=	this.vecToLocal(this.forward, currentCamera);

		this.rayDirection	=	this.forward.subtract(this.rayOrigin);
		this.rayDirection	=	BABYLON.Vector3.Normalize(this.rayDirection);   
		this.rayCaster		=	new BABYLON.Ray(this.rayOrigin, this.rayDirection, this.rayLength);
	};

	/*************************************************
	 *
	 *  Function to which return Vector3 in Current Coordinates
	 *
	*************************************************/
	vecToLocal = (vector : BABYLON.Vector3, mesh : any) => {
		/*--- Local Variable Declaration and initialization ---*/
		let m;
		let v;

		/*--- Code ---*/
		m	=	mesh.getWorldMatrix();
		v	=	BABYLON.Vector3.TransformCoordinates(vector, m);

		return v;
	};

	/*************************************************
	 *
	 * RenderLoop or Gameloop. Responsible for drawing scene_0 on screen frame by frame
	 *
	 *************************************************/
	renderLoop = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		engine.runRenderLoop(() => {
			if (this.state.currentActiveScene === 0) {
				this.update();
				scene_0.render();
			}
		});
	};

	/*************************************************
	 *
	 *  Update Function for animation
	 *
	**************************************************/
	update = () => {
		/*--- Local variable declaration and Initialization---*/

		/*--- Code --*/
		if (this.state.loadingData === true){
			if (this.skyMaterial.inclination < 0.6 && this.skyMaterial.inclination >= -0.6) {
				this.skyMaterial.inclination += 0.0003;	
			}
			else{
				this.skyMaterial.inclination = -0.6
			}

			if (engine.isPointerLock === true) {
				if(this.rayCaster){
					if (this.hit?.pickedMesh != null) {
						this.hit = scene_0.pickWithRay(this.rayCaster);
						this.pickedMeshEventOnHover(this.hit);
					}
				}
			}

			//handle events from gamepad
			this.handleGamepadMovement();

			//toggling Fade-In and Fade-Out
			if (triggerFadeInOut === true) { 
				this.goFadeInOut();
			}

			this.cameraToggling(this.mainCamera);

			//ray-caster to take Cursor hit
			this.createRayCaster(this.mainCamera);

			//exception handling
			this.exceptionHandling();
		}

		//for fettings icon pop-up
		if (engine.isPointerLock === true && this.state.showSettings === true) {
			this.setState({
				showSettings : false
			})
		}
		else
		{
			if (bShowSettingsIcon === true) {
				if (this.state.showSettingsIcon === false) {
					this.setState({
						showSettingsIcon	:	true,
					});
				}
			}
			else
			{
				if (this.state.showSettingsIcon === true) {
					this.setState({
						showSettingsIcon	:	false,
					});
				}
			}
		}
	};

	/*************************************************
	*
	*  Update Function for Handling Gamepad Events
	*
	*************************************************/
	handleGamepadMovement = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		/**************** Gamepad RIGHT Stick ****************/
		//to move see right and left
		if (bMoveCameraAlpha === true) {
			if (bMoveCameraAlphaRight === true) {
				this.mainCamera.alpha -= gamepadSensitivity;
			}
			else if (bMoveCameraAlphaLeft === true) {
				this.mainCamera.alpha += gamepadSensitivity;
			}
		}

		//to move see up and down
		if (bMoveCameraBeta === true) {
			if (bMoveCameraBetaRight === true) {
				this.mainCamera.beta -= gamepadSensitivity;
			}
			else if (bMoveCameraBetaLeft === true) {
				this.mainCamera.beta += gamepadSensitivity;
			}
		}
	};

	/*************************************************
	*
	*  Update Function for Toggling Freeze Controls from Player
	*
	*************************************************/
	freezeControls = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		if (bFreezeControl === true) {
			//freeze character
			this.characterController.enableKeyBoard(false);
		}
		else{
			//un-freeze character
			this.characterController.enableKeyBoard(true);
		}
	};

	/*************************************************
	*
	*  Update Function for Toggling Fade-In and Fade-Out
	*
	*************************************************/
	goFadeInOut = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		//True : Go to Fade Out Scene       
		if (fadeLevel >= 0.01) {
			fadeLevel -= 0.025;
			bInFading = true;
			if (fadeLevel <= 0.01) {
				fadeLevel	=	0.0;
				bInFading	=	false;
			}

			currentAmbientVolume -= 0.0044;
			this.ambientSound_0.setVolume(currentAmbientVolume);
		}

		if (fadeLevel === 0.0) {
			this.ambientSound_0.dispose();

			engine.exitPointerlock();

			this.setState({
				loadingData		:	false,
				showSettingsIcon	:	false,
				currentActiveScene	:	1
			});

			document.removeEventListener("keydown", this.keyDown, false);
			document.removeEventListener("keyup", this.keyUp, false);
			this.startButton.removeEventListener("click", this.loadSound, false);

			fadeLevel = 0.001;
		}

		if (bInFading === true) {
			//freeze character and detach controls while changing scene
			this.mainCamera.detachControl();

			bFreezeControl	=	true;
			this.freezeControls();
		}
		else{
			bFreezeControl	=	false;
			this.freezeControls();
		}
	};

	/*************************************************
	*
	*  Update Function for Exception Handling
	*
	*************************************************/
	exceptionHandling = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		//freeze character while sitting on Sofa and Reading book
		//unFreeze character while Closing book
		bFreezeControl = false;
		this.freezeControls();

		//when pointer is exit GUI pointer also hidden
		if (engine.isPointerLock === false) {
			this.gui.removeControl(this.button1);
		}
		else{
			this.gui.addControl(this.button1);
		}
	};

	/*************************************************
	 *
	 *  Update Function for Camera Toggling
	 *
	 *************************************************/
	cameraToggling = (currentCamera : any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		this.cameraTargetXOffset = currentCamera.radius / (this.radiusMax / 1);

		if (this.cameraTargetYOffset <= 1.75) {
			this.cameraTargetYOffset += 0.01;  
		}

		if (currentCamera.radius <= 0.5) {
			this.bInTPPMode = false;
		}
		else{
			this.bInTPPMode = true;
			if (this.mainCamera.radius <= this.radiusMax) {
				this.mainCamera.radius += 0.015;
			}
			else{
				this.mainCamera.radius = this.mainCamera.radius - 0.25;
			}
		}

		if (this.bInTPPMode === true) {
			//In TPP Mode!
			if (this.bPlayerOnShoulderRight === true) {
				this.characterController.setCameraTarget(new BABYLON.Vector3(
					-(Math.sin(-this.mainCamera.alpha) * this.cameraTargetXOffset),
					this.cameraTargetYOffset,
					-(Math.cos(-this.mainCamera.alpha) * this.cameraTargetXOffset)));
			}
			else{
				this.characterController.setCameraTarget(new BABYLON.Vector3(
					(Math.sin(-this.mainCamera.alpha) * this.cameraTargetXOffset),
					this.cameraTargetYOffset,
					(Math.cos(-this.mainCamera.alpha) * this.cameraTargetXOffset)));
			}
			this.player.setEnabled(true);
		}
		else{
			//in FPP Mode!
			currentCamera.radius = 0;
			this.player.setEnabled(false);
		}
	};

	/*************************************************
	 *
	 *  Update Function for Background Music / Sound
	 *
	 *************************************************/
	playSound = () => {
		/*--- Local variable declaration and Initialization---*/

		/*--- Code ---*/
		if (this.state.currentActiveScene === 0) {
			//character movement sound
			if((bWKeyPressed === true || bAKeyPressed === true || bSKeyPressed === true || bDKeyPressed === true) && !isSoundOn && !isSoundOff){
				this.walkingSound.stop();
				this.runningSound.play();
				isSoundOff = false;
				isSoundOn = true;
			}

			if(isSoundOff) {
				isShift= false;
				if(bWKeyPressed === true || bAKeyPressed === true || bSKeyPressed === true || bDKeyPressed === true) {
					this.walkingSound.stop();
					this.runningSound.pause();
					this.runningSound.play();
					isSoundOff = false;
					isSoundOn = true;
				}
				else {
					if (this.walkingSound) {
						this.walkingSound.stop();
						this.runningSound.pause();
						isSoundOff = false;
						isSoundOn = false;
					}
				}
			}

			if((bWKeyPressed === true || bAKeyPressed === true || bSKeyPressed === true || bDKeyPressed === true) && this.bShiftKeyPressed === true && !isShift) {
				this.runningSound.stop();
				this.walkingSound.play();
				isShift = true;
			}

			if (this.bSpaceKeyPressed === true) {
				if (bPlayerJumped === false && this.jumpingSound.isPlaying === false) {
					this.jumpingSound.play();
					this.bSpaceKeyPressed = false;
				}
			}
		}
	};

	/*************************************************
	*
	*  Customized Function for Creating MiniPopUp
	*
	*************************************************/
	createCustomMiniPopup = (name : string, text : string, width : string, height : string, textColor : string, backgroundColor : string, left : any, top : any) => {
		/*--- Local Variable Declaration and initialization ---*/
		var temp;

		/*--- Code ---*/
		temp = GUI.Button.CreateSimpleButton(name, text);
		temp.width		=	width;
		temp.height		=	height;
		temp.color		=	textColor;
		temp.cornerRadius	=	20;
		temp.background	=	backgroundColor;
		temp.left			=	left;
		temp.top			=	top;

		return(temp);
	};

	/*************************************************
	 *
	 *  Update Cursor Position
	 *
	 *************************************************/
	createCursor = () => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui");
		this.button1 = GUI.Button.CreateImageButton(
			"trigger",
			"",
			"Texture/cursor.png"
		);

		this.button1.onPointerClickObservable.add(() => {
			engine.enterPointerlock();
		});

		this.button1.width			=	"15px";
		this.button1.height			=	"15px";
		this.button1.color			=	"white";
		this.button1.cornerRadius	=	100;
		this.button1.cornerRadius	=	20	;
		this.button1.background		=	"blue";
		this.gui.addControl(this.button1);

		let canvas = document.getElementById('canvas');

		canvas?.addEventListener("click", () => {
			if (this.state.currentActiveScene === 0) {
				engine.enterPointerlock();

				if (engine.isPointerLock === true) {
					if(this.rayCaster) {
						this.hit = scene_0.pickWithRay(this.rayCaster);            
						if (this.hit?.pickedMesh !== null) {
							console.log("Ray OnClick: ", this.hit.pickedMesh.name);
							this.pickedMeshEventOnClick(this.hit);
						}
					}
				}
			}
		});
	};

	/*************************************************
	 *
	 *  Prop function to change volume of sound
	 *
	 *************************************************/
	loadSoundValue = (soundValue: any) => {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		let soundCorrection	:	number	=	soundValue / 40;

		soundValueParent = soundValue;

		/*--- Tap Sound ---*/
		tapSound.setVolume(soundCorrection);

		/*--- Walking Sound ---*/
		this.walkingSound.setVolume(soundCorrection);

		/*--- Running Sound ---*/
		this.runningSound.setVolume(soundCorrection);

		/*--- Jumping Sound ---*/
		this.jumpingSound.setVolume(soundCorrection);
	};

	/*************************************************
	 *
	 *  Prop function to change volume of background music
	 *
	 *************************************************/
	loadMusicValue =(musicValue: any) => {
		/*--- Local Variable Declaration and initialization ---*/
		let musicCorrection	:	number	=	musicValue / 95;

		/*--- Code ---*/

		musicValueParent = musicValue;

		/*--- Ambient Sound ---*/
		this.ambientSound_0.setVolume(musicCorrection);

		if(musicCorrection === 0){
			this.ambientSound_0.pause();
		}
		else{
			this.ambientSound_0.play();			
		}
	};

	/*************************************************
	 *
	 * Prop function to toggle hint value (whether to show hint or not)
	 *
	 *************************************************/
	toggleHint = (changedHint : any) =>{
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		this.setState({
			showHintFromSetting	:	changedHint
		});
	};

	/*************************************************
	 *
	 * React's Render Method
	 *
	 *************************************************/
	render() {
		/*--- Local Variable Declaration and initialization ---*/

		/*--- Code ---*/
		return (
			<div className="mainDivMainCanvasComponent">
				{/******************* For Loader *******************/}
				{!this.state.loadingData && (
					<div className="loading-div">
						<div className="loading-head">
							{/* You can add loading animation here */}
						</div>
						<div className="head">Loading</div>
					</div>
				)}
				<div id="menuPanel">
					<button id="startButton">Click to Start</button>
				</div>

				{/******************* For Flipbook *******************/}
				<div className="canvas-div" id="idDiv">
					<canvas id="canvas" />
				</div>

				{/******************* For Settings *******************/}
				{this.state.showSettingsIcon && (
				<div className="menu_btn"
					onClick={ () => { this.handleSettingsButton(); 
					}}>
					<div className="menu_btn_burger"></div>
				</div>
				)}

				{this.state.showSettings &&(
					<div className="testPopup_1">
						<div className="div-map-closeButton placement"/>

						{/*Settings Pop-up Component*/}
						<SettingsPopupComponent
							soundValue	=	{soundValueParent}
							changeSound	=	{this.loadSoundValue}
							musicValue	=	{musicValueParent}
							changeMusic	=	{this.loadMusicValue}
							hintValue		=	{this.state.showHintFromSetting}
							hintValueFunc	=	{this.toggleHint}
						/>
					</div>
				)}
			</div>
		);
	};
};
