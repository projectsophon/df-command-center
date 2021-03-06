import type { PlanetsByPlayer, PlanetsByPlayerVariables } from "../generated/PlanetsByPlayer";

import _ from "lodash";
import { useQuery, gql } from "@apollo/client";
import React, { useState, useEffect } from "react";
//@ts-ignore
import { Chart } from "react-charts/dist/react-charts.esm.js";

const PLANETS_BY_PLAYER = gql`
  query PlanetsByPlayer($owner: String!, $skip: Int!, $first: Int!) {
    planets(skip: $skip, first: $first, where: { owner: $owner }, orderBy: createdAt) {
      id
      planetLevel
    }
  }
`;

export function PlanetLevelsChart({ player }: { player: string }) {
  // Hack to fetch all of something using an effect
  const [fetchingAll, setFetchingAll] = useState(true);

  const { loading, data, fetchMore } = useQuery<PlanetsByPlayer, PlanetsByPlayerVariables>(PLANETS_BY_PLAYER, {
    variables: {
      owner: player.toLowerCase(),
      skip: 0,
      first: 1000,
    },
  });

  useEffect(() => {
    setFetchingAll(true);
  }, [player]);

  useEffect(() => {
    // This causes a reload every time the data changes, so it loads everything
    if (!loading && data) {
      fetchMore<PlanetsByPlayer, PlanetsByPlayerVariables, "skip">({
        variables: { skip: data.planets.length },
      }).then(({ data }) => {
        if (data.planets.length === 0) {
          setFetchingAll(false);
        }
      });
    }
  }, [loading, data]);

  const chartData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    const planetCountByLevel = _.countBy(data.planets, "planetLevel");

    return Object.entries(planetCountByLevel).map(([planetLevel, planetCount]) => {
      return {
        label: `Level ${planetLevel}`,
        data: [{ primary: "Planets (by Level)", secondary: planetCount }],
      };
    });
  }, [data]);

  const chartSeries = React.useMemo(() => {
    return { type: "bar" };
  }, []);

  const chartAxes = React.useMemo(() => {
    return [
      { primary: true, type: "ordinal", position: "bottom" },
      { position: "left", type: "linear", stacked: false, show: true },
    ];
  }, []);

  const getSeriesStyle = React.useCallback((series) => {
    switch (series.label) {
      case "Level 0":
        return { color: "#ffffff" };
      case "Level 1":
        return { color: "#0088ff" };
      case "Level 2":
        return { color: "#46FB73" };
      case "Level 3":
        return { color: "#CFF391" };
      case "Level 4":
        return { color: "#FB6A9D" };
      case "Level 5":
        return { color: "#b48812" };
      case "Level 6":
        return { color: "#ffe554" };
      case "Level 7":
        return { color: "hsl(198, 78%, 77%)" };
      case "Level 8":
        return { color: "#FF5100" };
      case "Level 9":
        return { color: "#bf5bf1" };
      default:
        return { color: "#ffffff" };
    }
  }, []);

  let charts;
  if (fetchingAll) {
    return <div>Loading...</div>;
  } else if (data && data.planets.length) {
    return (
      <Chart data={chartData} series={chartSeries} axes={chartAxes} tooltip dark getSeriesStyle={getSeriesStyle} />
    );
  } else {
    return <div>No data for that user found.</div>;
  }
}
