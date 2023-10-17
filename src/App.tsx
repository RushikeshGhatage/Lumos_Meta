// Importing Statements
import React from "react";

//Components
import MainCanvasComponent from "./components/MainCanvasComponent";

class App extends React.Component {
  render() {
    return (
      <div className="Home">
        <MainCanvasComponent/>
      </div>
    );
  }
}

export default App;
