import React from "react";
import "./App.css";

import { useQuery, gql } from "@apollo/client";
import type { Help } from "../generated/Help";

const DEFAULT = gql`
  query Help {
    players(first: 5) {
      id
      initTimestamp
      homeWorld {
        id
      }
      milliWithdrawnSilver
    }
    planets(first: 5) {
      id
      locationDec
      owner {
        id
      }
      isInitialized
    }
  }
`;

function App() {
  const { loading, data } = useQuery<Help>(DEFAULT);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <div className="App">
      {data?.players.map((player) => (
        <div>{player.id}</div>
      ))}
    </div>
  );
}

export default App;
