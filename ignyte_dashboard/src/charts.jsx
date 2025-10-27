import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";

// ------------------ NO2 ------------------
export const No2LineChart = ({ readings }) => {
  if (!readings || readings.length === 0) return <p>No NO₂ data available</p>;

  const margin = { right: 24 };
  const no2_we = readings.map((r) => r.no2_we);
  const xLabels = readings.map((r) => r.timestamp);

  return (
    <Box>
      <LineChart
        width={1000}
        series={[{ data: no2_we, label: "NO₂ WE", showMark: false }]}
        xAxis={[
          {
            scaleType: "point",
            data: xLabels,
            valueFormatter: (data, context) =>
              context.location === "tick"
                ? `${data.slice(0, 3)} \n2025`
                : `${data} 202`,
            height: 40,
            tickLabelStyle: {
              fontSize: "7px",
              textAnchor: "middle",
            },
          },
        ]}
        yAxis={[{ width: 1 }]}
        margin={margin}
      />
    </Box>
  );
};

// ------------------ O3 ------------------
export const O3LineChart = ({ readings }) => {
  if (!readings || readings.length === 0) return <p>No O₃ data available</p>;

  const margin = { right: 24 };
  const ox_we = readings.map((r) => r.ox_we);
  const xLabels = readings.map((r) => r.timestamp);

  return (
    <Box>
      <LineChart
        width={1000}
        series={[{ data: ox_we, label: "O₃ WE", showMark: false }]}
        xAxis={[
          {
            scaleType: "point",
            data: xLabels,
            tickLabelStyle: {
              fontSize: "7px",
              textAnchor: "middle",
            },
          },
        ]}
        yAxis={[{ width: 1 }]}
        margin={margin}
      />
    </Box>
  );
};

// ------------------ Voltage ------------------
export const VoltageLineChart = ({ readings }) => {
  if (!readings || readings.length === 0)
    return <p>No voltage data available</p>;

  const margin = { right: 24, bottom: 60 };

  // Don't filter - use all your readings for 60+ ticks
  const batt_v = readings.map((r) => r.batt_v);
  const xLabels = readings.map((r) => r.timestamp);

  // Helper to check if this is a "major" tick (e.g., every 6 hours or start of day)
  const shouldShowLabel = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    // Show label at midnight, 6am, noon, 6pm
    return hours % 6 === 0;
  };

  return (
    <Box>
      <LineChart
        width={1000}
        height={500}
        series={[{ data: batt_v, label: "Battery (V)", showMark: false }]}
        xAxis={[
          {
            scaleType: "point",
            data: xLabels,
            valueFormatter: (timestamp, context) => {
              // Only show labels for major ticks
              if (context.location === "tick" && !shouldShowLabel(timestamp)) {
                return "";
              }

              const date = new Date(timestamp);
              const month = date.toLocaleString("en-US", { month: "short" });
              const day = date.getDate();
              const hours = date.getHours();
              const ampm = hours >= 12 ? "PM" : "AM";
              const displayHours = hours % 12 || 12;

              return `${month} ${day} ${displayHours}${ampm}`;
            },
            tickLabelStyle: {
              fontSize: "10px",
              textAnchor: "middle",
              fontWeight: "bold",
            },
          },
        ]}
        yAxis={[
          {
            label: "Voltage (V)",
            min: 3.0,
            max: 4.2,
            tickLabelStyle: { fontSize: "10px" },
          },
        ]}
        margin={margin}
      />
    </Box>
  );
};

// ------------------ Battery Percentage ------------------
export const BatteryPercentChart = ({ readings }) => {
  if (!readings || readings.length === 0)
    return <p>No battery data available</p>;

  const margin = { right: 24 };
  const batt_soc = readings.map((r) => r.batt_soc);
  const xLabels = readings.map((r) => r.timestamp);

  return (
    <Box>
      <LineChart
        width={1000}
        height={500}
        series={[{ data: batt_soc, label: "Battery (%)", showMark: false }]}
        xAxis={[
          {
            scaleType: "point",
            data: xLabels,
            tickLabelStyle: {
              fontSize: "8px",
              textAnchor: "middle",
              fontWeight: "bold",
            },
          },
        ]}
        yAxis={[
          {
            label: "Percentage (%)",
            min: 0,
            max: 100,
            tickLabelStyle: { fontSize: "10px" },
          },
        ]}
        margin={margin}
      />
    </Box>
  );
};

// ------------------ DHT (Temp + Humidity) ------------------
export const DHTChart = ({ readings }) => {
  if (!readings || readings.length === 0) return <p>No DHT data available</p>;

  const margin = { right: 56 };
  const tempdata = readings.map((r) => r.temp);
  const humdata = readings.map((r) => r.hum);
  const xLabels = readings.map((r) => r.timestamp);

  return (
    <Box>
      <LineChart
        width={1000}
        height={500}
        series={[
          {
            data: tempdata,
            label: "Temperature (°C)",
            showMark: false,
            yAxisKey: "tempAxis",
          },
          {
            data: humdata,
            label: "Humidity (%)",
            showMark: false,
            yAxisKey: "humAxis",
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: xLabels,
            tickLabelStyle: {
              fontSize: "8px",
              textAnchor: "middle",
              fontWeight: "bold",
            },
          },
        ]}
        yAxis={[
          {
            id: "tempAxis",
            position: "left",
            label: "Temperature (°C)",
            min: 0,
            max: 50,
            tickLabelStyle: { fontSize: "10px" },
            labelStyle: {
              fontSize: "11px",
              fontWeight: "600",
              paddingRight: 8,
            },
          },
          {
            id: "humAxis",
            position: "right",
            label: "Humidity (%)",
            min: 0,
            max: 100,
            tickLabelStyle: { fontSize: "10px" },
            labelStyle: { fontSize: "11px", fontWeight: "600", paddingLeft: 8 },
          },
        ]}
        legend={{ position: "top" }}
        margin={margin}
      />
    </Box>
  );
};
