// BatteryRateOfChangeChart.jsx
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";

const calculateRateOfChange = (readings) => {
  console.log("=== calculateRateOfChange DEBUG ===");
  console.log("Input length:", readings?.length);
  console.log("First reading:", readings?.[0]);
  console.log("Sample timestamp:", readings?.[0]?.timestamp);
  if (!readings || readings.length === 0) {
    return null;
  }

  // Parse timestamp helper (handles "Oct 15, 16:15" format from your addTimeStampToData)

  if (!readings || !Array.isArray(readings) || readings.length === 0) {
    console.log("❌ Failed: No valid readings");
    return null;
  }

  // Parse timestamp helper
  // Parse timestamp helper
  const parseTimestamp = (timestamp) => {
    const currentYear = new Date().getFullYear();
    // 💡 FIX: Re-order to "Month Day, Year HH:MM" for robust parsing.
    // E.g., change "Oct 12, 18:32, 2025" to "Oct 12, 2025 18:32"
    // The timestamp format is "Month Day, HH:MM"
    const [datePart, timePart] = timestamp.split(", ");
    const parsed = new Date(`${datePart}, ${currentYear} ${timePart}`);
    // console.log(`Parsing "${timestamp}" -> ${parsed}`);
    return parsed;
  };

  // Sort readings by timestamp
  const sortedReadings = [...readings].sort((a, b) => {
    return parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp);
  });

  console.log("✅ Sorted:", sortedReadings.length);

  // Filter to first 3 days
  const startTime = parseTimestamp(sortedReadings[0].timestamp).getTime();
  console.log("Start time:", new Date(startTime));
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

  const filteredReadings = sortedReadings.filter((r) => {
    const readingTime = parseTimestamp(r.timestamp).getTime();
    return readingTime - startTime <= threeDaysMs;
  });
  console.log("✅ Filtered (3 days):", filteredReadings.length);

  if (filteredReadings.length < 2) {
    console.log(
      "❌ Failed: Only",
      filteredReadings.length,
      "readings in 3 days"
    );

    return null;
  }

  // Calculate rate of change (% per hour)
  const ratesOfChange = [];
  const timestamps = [];

  for (let i = 1; i < filteredReadings.length; i++) {
    const current = filteredReadings[i];
    const previous = filteredReadings[i - 1];

    const currentTime = parseTimestamp(current.timestamp);
    const previousTime = parseTimestamp(previous.timestamp);
    const timeDiff = (currentTime - previousTime) / (1000 * 60 * 60);

    const socDiff = current.batt_soc - previous.batt_soc;
    const rate = timeDiff > 0 ? socDiff / timeDiff : 0;

    ratesOfChange.push(rate);
    timestamps.push(current.timestamp);
  }

  // Calculate sliding average
  const windowSize = 10;
  const slidingAverages = [];

  for (let i = 0; i < ratesOfChange.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(ratesOfChange.length, i + Math.ceil(windowSize / 2));

    const window = ratesOfChange.slice(start, end);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;

    slidingAverages.push(average);
  }

  // Calculate stats
  const avgRate = (
    slidingAverages.reduce((sum, val) => sum + val, 0) / slidingAverages.length
  ).toFixed(3);
  const totalChange = (
    filteredReadings[filteredReadings.length - 1].batt_soc -
    filteredReadings[0].batt_soc
  ).toFixed(1);
  const startSOC = filteredReadings[0].batt_soc.toFixed(1);
  const endSOC =
    filteredReadings[filteredReadings.length - 1].batt_soc.toFixed(1);
  const startVoltage = filteredReadings[0].batt_v.toFixed(3);
  const endVoltage =
    filteredReadings[filteredReadings.length - 1].batt_v.toFixed(3);

  return {
    ratesOfChange,
    slidingAverages,
    timestamps,
    stats: {
      avgRate,
      totalChange,
      startSOC,
      endSOC,
      startVoltage,
      endVoltage,
      dataPoints: filteredReadings.length,
      windowSize,
    },
  };
};

export const BatteryRateOfChangeChart = ({ readings }) => {
  if (!readings || readings.length === 0) {
    return <p>Loading rate of change data...</p>;
  }

  const data = calculateRateOfChange(readings);
  console.log(data);

  if (!data) {
    return <p>Coming soon</p>;
  }

  const { ratesOfChange, slidingAverages, timestamps, stats } = data;
  const margin = { top: 20, right: 24, bottom: 60, left: 60 };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Battery Rate of Change (First 3 Days)
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Window size: {stats.windowSize} readings | Data points:{" "}
        {stats.dataPoints}
      </Typography>

      <LineChart
        width={1000}
        height={500}
        series={[
          {
            data: ratesOfChange,
            label: "Rate of Change (%/hr)",
            showMark: false,
            color: "#ff6b6b",
          },
          {
            data: slidingAverages,
            label: `Sliding Average (n=${stats.windowSize})`,
            showMark: false,
            color: "#4ecdc4",
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: timestamps,
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
            label: "Rate of Change (% per hour)",
            tickLabelStyle: { fontSize: "10px" },
          },
        ]}
        margin={margin}
        grid={{ horizontal: true }}
      />

      <Box mt={2}>
        <Typography variant="body2">
          <strong>Average discharge rate (3 days):</strong> {stats.avgRate} %/hr
        </Typography>
        <Typography variant="body2">
          <strong>Total change:</strong> {stats.totalChange}% (from{" "}
          {stats.startSOC}% to {stats.endSOC}%)
        </Typography>
        <Typography variant="body2">
          <strong>Start voltage:</strong> {stats.startVoltage}V
        </Typography>
        <Typography variant="body2">
          <strong>End voltage:</strong> {stats.endVoltage}V
        </Typography>
      </Box>
    </Box>
  );
};
