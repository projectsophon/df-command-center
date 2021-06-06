import React, { useState } from "react";
import "./App.css";
import { PlanetLevelsChart } from "./PlanetLevelsChart";
import { PlanetTypesChart } from "./PlanetTypesChart";

function App() {
  const [player, setPlayer] = useState("0x5d07904bb86cbf524b42d4e7d292a867f05d3b31");

  function onChangePlayer(evt: any) {
    setPlayer(evt.target.value);
  }

  let children: JSX.Element[] = [];
  if (player) {
    children = [<PlanetLevelsChart player={player} />, <PlanetTypesChart player={player} />];
  } else {
    children = [<div>No user selected.</div>];
  }

  return (
    <div className="App">
      <div className="InputWrapper">
        <input onChange={onChangePlayer} value={player} />
      </div>
      <div className="ChartWrapper">{children}</div>
    </div>
  );
}

export default App;
