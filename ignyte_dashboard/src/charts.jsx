import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

// Helper function to calculate day/night periods
const getDayNightPeriods = (xLabels) => {
  const periods = [];
  let currentPeriod = null;

  xLabels.forEach((timestamp, index) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const isDaytime = hours >= 9 && hours < 20; // 6am-6pm is day

    if (!currentPeriod || currentPeriod.isDaytime !== isDaytime) {
      if (currentPeriod) {
        currentPeriod.endIndex = index - 1;
        periods.push(currentPeriod);
      }
      currentPeriod = { isDaytime, startIndex: index };
    }
  });

  if (currentPeriod) {
    currentPeriod.endIndex = xLabels.length - 1;
    periods.push(currentPeriod);
  }

  return periods;
};

// Component to render day/night legend
const DayNightLegend = () => (
  <Box sx={{ display: "flex", gap: 2, mb: 1, fontSize: "12px" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Box
        sx={{
          width: 16,
          height: 16,
          bgcolor: "rgba(255, 235, 59, 0.15)",
          border: "1px solid rgba(255, 193, 7, 0.5)",
        }}
      />
      <span>Daylight (6am-6pm)</span>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Box
        sx={{
          width: 16,
          height: 16,
          bgcolor: "rgba(63, 81, 181, 0.1)",
          border: "1px solid rgba(63, 81, 181, 0.3)",
        }}
      />
      <span>Night (6pm-6am)</span>
    </Box>
  </Box>
);

// Custom component to render backgrounds
const DayNightBackgrounds = ({
  periods,
  xLabels,
  chartWidth,
  chartHeight,
  margin,
}) => {
  // Calculate the actual drawing area
  const leftMargin = 70; // Approximate left margin for y-axis
  const rightMargin = margin?.right || 24;
  const topMargin = 5;
  const bottomMargin = margin?.bottom || 60;

  const drawingWidth = chartWidth - leftMargin - rightMargin;
  const drawingHeight = chartHeight - topMargin - bottomMargin;
  const pointSpacing = drawingWidth / (xLabels.length - 1 || 1);

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: chartWidth,
        height: chartHeight,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {periods.map((period, i) => {
        const x = leftMargin + period.startIndex * pointSpacing;
        const width = (period.endIndex - period.startIndex) * pointSpacing;

        return (
          <rect
            key={i}
            x={x}
            y={topMargin}
            width={width}
            height={drawingHeight}
            fill={
              period.isDaytime
                ? "rgba(255, 235, 59, 0.15)"
                : "rgba(63, 81, 181, 0.1)"
            }
          />
        );
      })}
    </svg>
  );
};

// ------------------ NO2 ------------------
export const No2LineChart = ({ readings }) => {
  if (!readings || readings.length === 0) return <p>No NO₂ data available</p>;

  const margin = { right: 24, bottom: 100 };
  const chartWidth = 1000;
  const chartHeight = 500;
  const no2_we = readings.map((r) => r.no2_we);
  const xLabels = readings.map((r) => r.timestamp);
  const dayNightPeriods = getDayNightPeriods(xLabels);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        NO₂ Levels
      </Typography>
      <DayNightLegend />
      <Box sx={{ position: "relative" }}>
        <DayNightBackgrounds
          periods={dayNightPeriods}
          xLabels={xLabels}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          margin={margin}
        />
        <LineChart
          width={chartWidth}
          height={chartHeight}
          series={[{ data: no2_we, label: "NO₂ WE", showMark: false }]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              valueFormatter: (timestamp, context) => {
                const date = new Date(timestamp);
                const month = date.toLocaleString("en-US", { month: "short" });
                const day = date.getDate();
                const hours = date.getHours();
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;
                const displayMinutes = date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");

                return context.location === "tick"
                  ? `${month} ${day} \n${displayHours}:${displayMinutes}${ampm}`
                  : `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`;
              },
              height: 50,
              tickLabelStyle: {
                fontSize: "8px",
                textAnchor: "middle",
              },
            },
          ]}
          yAxis={[{ label: "NO₂ WE (ADC)", width: 60 }]}
          margin={margin}
          sx={{ position: "relative", zIndex: 1 }}
        />
      </Box>
    </Box>
  );
};

// ------------------ O3 ------------------
export const O3LineChart = ({ readings }) => {
  if (!readings || readings.length === 0) return <p>No O₃ data available</p>;

  const margin = { right: 24, bottom: 60 };
  const chartWidth = 1000;
  const chartHeight = 500;
  const ox_we = readings.map((r) => r.ox_we);
  const xLabels = readings.map((r) => r.timestamp);
  const dayNightPeriods = getDayNightPeriods(xLabels);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        O₃ Levels
      </Typography>
      <DayNightLegend />
      <Box sx={{ position: "relative" }}>
        <DayNightBackgrounds
          periods={dayNightPeriods}
          xLabels={xLabels}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          margin={margin}
        />
        <LineChart
          width={chartWidth}
          height={chartHeight}
          series={[{ data: ox_we, label: "O₃ WE", showMark: false }]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              valueFormatter: (timestamp, context) => {
                const date = new Date(timestamp);
                const month = date.toLocaleString("en-US", { month: "short" });
                const day = date.getDate();
                const hours = date.getHours();
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;
                const displayMinutes = date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");

                return context.location === "tick"
                  ? `${month} ${day} \n${displayHours}:${displayMinutes}${ampm}`
                  : `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`;
              },
              height: 50,
              tickLabelStyle: {
                fontSize: "8px",
                textAnchor: "middle",
              },
            },
          ]}
          yAxis={[{ label: "O₃ WE (ADC)", width: 60 }]}
          margin={margin}
          sx={{ position: "relative", zIndex: 1 }}
        />
      </Box>
    </Box>
  );
};

// ------------------ Voltage ------------------
export const VoltageLineChart = ({ readings }) => {
  if (!readings || readings.length === 0)
    return <p>No voltage data available</p>;

  const margin = { right: 24, bottom: 60 };
  const chartWidth = 1000;
  const chartHeight = 500;
  const batt_v = readings.map((r) => r.batt_v);
  const xLabels = readings.map((r) => r.timestamp);
  const dayNightPeriods = getDayNightPeriods(xLabels);

  const shouldShowLabel = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    return hours % 6 === 0;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Battery Voltage
      </Typography>
      <DayNightLegend />
      <Box sx={{ position: "relative" }}>
        <DayNightBackgrounds
          periods={dayNightPeriods}
          xLabels={xLabels}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          margin={margin}
        />
        <LineChart
          width={chartWidth}
          height={chartHeight}
          series={[{ data: batt_v, label: "Battery (V)", showMark: false }]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              valueFormatter: (timestamp, context) => {
                if (
                  context.location === "tick" &&
                  !shouldShowLabel(timestamp)
                ) {
                  return "";
                }

                const date = new Date(timestamp);
                const month = date.toLocaleString("en-US", { month: "short" });
                const day = date.getDate();
                const hours = date.getHours();
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;

                return context.location === "tick"
                  ? `${month} ${day} \n${displayHours}${ampm}`
                  : `${month} ${day}, ${displayHours}${ampm}`;
              },
              height: 50,
              tickLabelStyle: {
                fontSize: "9px",
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
          sx={{ position: "relative", zIndex: 1 }}
        />
      </Box>
    </Box>
  );
};

// ------------------ Battery Percentage ------------------
export const BatteryPercentChart = ({ readings }) => {
  if (!readings || readings.length === 0)
    return <p>No battery data available</p>;

  const margin = { right: 24, bottom: 60 };
  const chartWidth = 1000;
  const chartHeight = 500;
  const batt_soc = readings.map((r) => r.batt_soc);
  const xLabels = readings.map((r) => r.timestamp);
  const dayNightPeriods = getDayNightPeriods(xLabels);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Battery Percentage
      </Typography>
      <DayNightLegend />
      <Box sx={{ position: "relative" }}>
        <DayNightBackgrounds
          periods={dayNightPeriods}
          xLabels={xLabels}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          margin={margin}
        />
        <LineChart
          width={chartWidth}
          height={chartHeight}
          series={[{ data: batt_soc, label: "Battery (%)", showMark: false }]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              valueFormatter: (timestamp, context) => {
                const date = new Date(timestamp);
                const month = date.toLocaleString("en-US", { month: "short" });
                const day = date.getDate();
                const hours = date.getHours();
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;
                const displayMinutes = date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");

                return context.location === "tick"
                  ? `${month} ${day} \n${displayHours}:${displayMinutes}${ampm}`
                  : `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`;
              },
              height: 50,
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
          sx={{ position: "relative", zIndex: 1 }}
        />
      </Box>
    </Box>
  );
};

// ------------------ DHT (Temp + Humidity) ------------------
export const DHTChart = ({ readings }) => {
  if (!readings || readings.length === 0) return <p>No DHT data available</p>;

  const margin = { right: 56 };
  const chartWidth = 1000;
  const chartHeight = 500;
  const tempdata = readings.map((r) => r.temp);
  const humdata = readings.map((r) => r.hum);
  const xLabels = readings.map((r) => r.timestamp);
  const dayNightPeriods = getDayNightPeriods(xLabels);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Temperature & Humidity
      </Typography>
      <DayNightLegend />
      <Box sx={{ position: "relative" }}>
        <DayNightBackgrounds
          periods={dayNightPeriods}
          xLabels={xLabels}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          margin={margin}
        />
        <LineChart
          width={chartWidth}
          height={chartHeight}
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
              labelStyle: {
                fontSize: "11px",
                fontWeight: "600",
                paddingLeft: 8,
              },
            },
          ]}
          legend={{ position: "top" }}
          margin={margin}
          sx={{ position: "relative", zIndex: 1 }}
        />
      </Box>
    </Box>
  );
};
