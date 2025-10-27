import Stack from "@mui/material/Stack";
import HomeButton from "./minis/backbtn";
import {
  No2LineChart,
  O3LineChart,
  VoltageLineChart,
  BatteryPercentChart,
  DHTChart,
} from "./charts";
import { BatteryRateOfChangeChart } from "./rateofchange";
import Typography from "@mui/material/Typography";

// ✅ Destructure the prop correctly
const ChartContainer = ({ readings }) => {
  return (
    <Stack container spacing={2}>
      <HomeButton />

      <Typography variant="h5" gutterBottom>
        Fully charged battery with solar panel
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

export default ChartContainer;
