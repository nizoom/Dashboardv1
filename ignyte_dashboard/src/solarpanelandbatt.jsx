import { useState, useEffect } from "react";
import "./App.css";
import { addTimeStampToData } from "./add_timestamp.js";
import ChartContainer from "./temporary_chartcontainer.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function SolarPanelAndBattery() {
  // no diode
  const url = `https://ignyte-sensor-default-rtdb.firebaseio.com/devices/esp32_01/readings.json?${
    import.meta.env.VITE_FB_AUTH
  }`;
  const [rawData, setRawData] = useState();
  const [readings, setReadings] = useState();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCount((c) => c + 1);
        setRawData(data);
        convertToArr(data); // pass directly
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const convertToArr = (dataObj) => {
      // console.log("Fetch count:", count);
      if (!dataObj) {
        console.log("No data received");
        return;
      }

      const readingsArr = Object.entries(dataObj).map(([id, reading]) => {
        try {
          const timestamp = addTimeStampToData(id);
          return {
            id,
            timestamp,
            ...reading,
          };
        } catch (error) {
          console.error("error with timestamp: " + error);
        }
      });

      console.log(readingsArr);
      setReadings(readingsArr);
    };

    fetchData();
  }, []);

  return (
    <>
      {readings ? (
        <>
          <ChartContainer readings={readings} />
        </>
      ) : null}
    </>
  );
}

export default SolarPanelAndBattery;
