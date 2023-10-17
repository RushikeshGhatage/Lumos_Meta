# Lumos_Meta
**Date**: 06/09/2023

**Author**: Rushikesh Vinod Ghatage

## Before You Start
### Instructions
- Please follow point (2), If you want to run the code.
- Explanation divided into 2 parts:
  - **Directory Structure**: 
    1. Explaining the overall project structure.
  - **Code Structure**: 
      1. Explaining the basic structure Code and its execution flow.
      2. You will find a short description of each function at the start of the function.
      3. Also, Comments are added in code wherever necessary explaining what is exactly happening at that line.

### Setting up your machine
- Download [Node.js](https://nodejs.org/en/download/).
- Run the following commands:
  - To install dependencies (only the first time): `npm install`
  - To run the local server at your localhost: `npm start`
  - To build for production in the directory: `npm run build`

### Contact
- If you have any concerns about the following information, feel free to contact [me](mailto:rushikeshghatage40@gmail.com).

## Directory Structure
1. **node_modules**:
   - It stores all the third-party libraries and packages that your React project depends (in our case babylonjs & others).
   - It helps to manage and update the packages your project relies on.

2. **public**:
   - It consists of 3 subfolders.
     - **assets**: Consists of 3D models used in our 3D Babylon environment (e.g., 3D city, character model).
     - **sounds**: Consists of sounds used in our 3D Babylon environment (e.g., ambient, touch sound, character jumping, running, walking sound).
     - **texture**: Consists of image textures that can be applied to 3D Babylon meshes.
   - Others are normal files that come by default with the React framework.

3. **src**:
   - It consists of 3 subfolders.
     - **components**:
       - This folder holds the **Main** source code files.
       - Generally, we can store Javascript/Typescript files here (For now, we are using Typescript).
       - Here, We have two Typescript (.tsx) files.
            - **MainCanvasComponent.tsx**:
                 - This is our main component file.
                 - Whole Canvas creation and Engine initialization things will be done here.
            - **SettingsPopupComponent.tsx** (Note: Please refer to Settings UI for better understanding):
                 - Typically, this component handles the settings feature already created in our 3D Babylon environment.
                 - User can adjust Sound & Music volume by clicking on "Sound Volume" & "Music Volume" respectively.
                 - "Show Hint" is a normal trigger to help the user navigate the character through the environment easily.
                 - As the name suggests, "Instructions" consists of a list of instructions for first-time users.
                 - Other buttons:
                   - Home: Which will directly bring you to the main 3D environment.
                   - Feedback: Which will open a Google form where the user can give feedback.
                   - About us: Which will open the official site of the company.
                   - Reset: Which will reset the position of the character (in case the player got stuck in any mesh accidentally).
     - **resources**:
       - This folder consists of other resource files that will be used in the environment.
       - For now, It holds 2 files:
         - **close_button**: Shown while the settings popup is enabled.
         - **loader**: Used as a loading screen shown while loading all assets.
     - **styles**:
       - This folder holds all kinds of stylesheets to be used.

## Code Structure
- We are using the 3D package BabylonJS in the ReactJS Framework with Class-based components.
- Here is an explanation of the overall code structure in the MainCanvasComponent.tsx file.

1. **Imports and Definitions**:
   - Code starts with normal importing and other variable definitions necessary for the rest of the code.

2. **Main component class and Constructor**:
   - This part has global variable declaration and initialization.
   - Some declarations are done in the constructor too.

3. **React Life-Cycle Methods**:
   - We have used `componentDidMount()` & `componentDidUpdate()` methods to get better hand on environmental state management.

4. **Initializing everything**:
   - `initialize()` is the **Main** function, where it all begins.
   - We are creating Canvas, Initializing BabylonJS engine & Creating eventListeners.
   - Our environment also has Gamepad Controller support.
   - You will find initialization of Babylon gamepadManager too.

5. **Creating BabylonJS Scene**:
   - `createScene0()` will create one optimized scene for our 3D environment.
   - Here, We have used basic Babylon optimizers to boost performance.
   - Other basic procedures are also done here like setting up basic lighting and camera for our 3D environment.

6. **Loading Assets**:
   - This is the main part where we load all necessary assets like models and sounds.
   - In `loadSound()`, We load all sounds used in the future.
   - **Please note that**, According to the latest CORS policy, We must load and use external assets after getting user's interaction. That explains why we used **"Click to Start"** button in the beginning.
   - `loadModel()` and `loadCharacterModel()` helps us to load models into our 3D environment.
   - After loading all these assets, the user can start interacting with our environment.

7. **User Interactions**:
   - We mainly get user inputs using two functions: `keyDown()` & `keyUp()`.
   - Also, We have other functions that indirectly handle the interactions.
   - `handleGamepadMovement()` will handle the Gamepad controller interaction.
   - `pickedMeshEventOnClick()` & `pickedMeshEventOnHover()` will get inputs from the rayCaster created in `createRayCaster()`.
   - `characterMovement()` handles the major and difficult part of our Character movement.
   - We have used a third-party package called "BabylonJS-CharacterController" by Developer "Satguru P Srivastava" & "David" (Thanks to them!) :smiley:
   - For more information, visit [BabylonJS-CharacterController](https://github.com/ssatguru/BabylonJS-CharacterController).

8. **Game Loop**:
   - `renderLoop()` creates the loop to keep rendering the Babylon scene.
   - It also calls `update()` to make environmental changes while rendering.

9. **Other**:
   - Code consists of other environmental features too.
   - `handleSettingsButton()` to handle the Settings button on the Top right corner.
   - `toggleFullscreen()` to toggle between fullscreen by tapping "F/f" button.
   - `drawEllipsoid()` to create an ellipsoid around the mesh for debugging purposes.
   - `drawWater()` to render low-poly water using customized shaders.
   - `draw()` to draw basic Babylon meshes into the scene.
   - `prepareFadeInOutEffect()` to give a fade-in & fade-out effect to traverse from one
