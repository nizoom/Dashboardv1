import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts";

const RecordDropChart = ({ readings }) => {
  console.log("Raw readings:", readings);

  // Better guard clauses
  //   if (!readings) {
  //     return <p>Loading...</p>;
  //   }

  const readingArray = Array.isArray(readings)
    ? readings
    : readings?.data || [];

  if (readingArray.length === 0) {
    return <p>No data available</p>;
  }

  //   console.log("Processing", readingArray.length, "readings");
  console.log("Sample timestamp:", readingArray[0]?.timestamp);
  console.log("Type:", typeof readingArray[0]?.timestamp);

  const chartWidth = 1000;
  const chartHeight = 400;
  const margin = { right: 24, bottom: 80 };

  const readingsWithDrops = findDrops(readingArray);

  // Filter only the readings where a gap occurred
  const dropsOnly = readingsWithDrops.filter((r) => r.gap);

  console.log("Found", dropsOnly.length, "gaps");

  if (dropsOnly.length === 0) {
    return <p>No gaps found in data - all readings are continuous!</p>;
  }

  // Filter out large gaps (sensor restarts, etc.)
  const realGaps = dropsOnly.filter((d) => d.numOfMissingRecords < 500);
  if (realGaps.length === 0) {
    return <p>No significant gaps found in data!</p>;
  }

  // Prepare data for MUI BarChart using the filtered data
  const xLabels = realGaps.map((d) => d.gapStart || d.timestamp);
  const missingCounts = realGaps.map((d) => d.numOfMissingRecords);

  return (
    <Box>
      <BarChart
        width={chartWidth}
        height={chartHeight}
        series={[
          {
            data: missingCounts,
            label: "Missing Records",
            color: "#ff6b6b",
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: xLabels,
            valueFormatter: (timestamp) => {
              const date = new Date(timestamp);
              const month = date.toLocaleString("en-US", { month: "short" });
              const day = date.getDate();
              const hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, "0");
              const ampm = hours >= 12 ? "PM" : "AM";
              const displayHours = hours % 12 || 12;

              return `${month} ${day}\n${displayHours}:${minutes}${ampm}`;
            },
            height: 50,
            tickLabelStyle: {
              fontSize: "9px",
              textAnchor: "middle",
            },
            label: "Time of Gap",
          },
        ]}
        yAxis={[{ label: "Number of Missing Records" }]}
        margin={margin}
        sx={{
          "& .MuiChartsAxis-tickLabel": {
            fill: "#555",
          },
        }}
      />
    </Box>
  );
};

export default RecordDropChart;

const findDrops = (readings) => {
  return readings.map((reading, index) => {
    if (index === 0) {
      return { ...reading, gap: false };
    }

    const curr = parseTimestamp(reading.timestamp);
    const prev = parseTimestamp(readings[index - 1].timestamp);

    const diffMinutes = (curr - prev) / (1000 * 60);

    if (diffMinutes > 6) {
      return {
        ...reading,
        gap: true,
        gapMinutes: diffMinutes,
        numOfMissingRecords: Math.floor(diffMinutes / 5),
        gapStart: readings[index - 1].timestamp,
      };
    }

    return { ...reading, gap: false };
  });
};

const parseTimestamp = (ts) => {
  // ts is like "Oct 7, 15:55"
  const currentYear = new Date().getFullYear();

  // Remove the comma and rearrange to "Oct 7 2025 15:55"
  const withoutComma = ts.replace(",", "");
  const fullTimestamp = `${withoutComma} ${currentYear}`;
  const parsed = new Date(fullTimestamp);

  //   console.log("Input:", ts, "→ Full:", fullTimestamp, "→ Parsed:", parsed);

  if (isNaN(parsed.getTime())) {
    console.error("Invalid timestamp:", ts);
  }

  return parsed;
};
