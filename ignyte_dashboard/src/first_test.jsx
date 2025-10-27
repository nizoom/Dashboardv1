import Stack from "@mui/material/Stack";
import exportData from "./firebase_export/export_oct_14.json" assert { type: "json" };
import { useState, useEffect } from "react";
import { addTimeStampToData } from "./add_timestamp";
import HomeButton from "./minis/backbtn";
import Typography from "@mui/material/Typography";
import { BatteryRateOfChangeChart } from "./rateofchange";

import {
  No2LineChart,
  O3LineChart,
  VoltageLineChart,
  BatteryPercentChart,
  DHTChart,
} from "./charts";

const FirstTest = () => {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    try {
      const dataObj = exportData.devices.esp32_01.readings;
      if (!dataObj) {
        console.error("No readings found in JSON");
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
          console.error("Error with timestamp:", error);
          return null;
        }
      });

      const validReadings = readingsArr.filter(Boolean);
      const sorted = validReadings.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setReadings(sorted);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, []);

  // console.log("Processed readings:", readings);

  return (
    <Stack container spacing={2}>
      <HomeButton />

      <Typography variant="h5" gutterBottom>
        Fully charged battery. No solar panel.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Voltage
      </Typography>
      <VoltageLineChart readings={readings} />
      <Typography variant="h6" gutterBottom>
        Battery / State of Charge
      </Typography>
      <BatteryPercentChart readings={readings} />
      <Typography variant="h6" gutterBottom>
        Battery Rate of Change
      </Typography>
      <BatteryRateOfChangeChart readings={readings} />
      <Typography variant="h6" gutterBottom>
        No2
      </Typography>
      <No2LineChart readings={readings} />
      <Typography variant="h6" gutterBottom>
        O3
      </Typography>
      <O3LineChart readings={readings} />
      <Typography variant="h6" gutterBottom>
        Temperature
      </Typography>
      <DHTChart readings={readings} />
    </Stack>
  );
};

export default FirstTest;
