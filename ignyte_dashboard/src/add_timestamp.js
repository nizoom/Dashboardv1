export const addTimeStampToData = (firebase_id) => {
  const PUSH_CHARS =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
  let timestampInMilli = 0;

  // Decode the first 8 characters
  for (let i = 0; i < 8; i++) {
    timestampInMilli =
      timestampInMilli * 64 + PUSH_CHARS.indexOf(firebase_id.charAt(i));
  }

  return convertUnixToDate(timestampInMilli);
};

const convertUnixToDate = (timestampInMilli) => {
  const dateObject = new Date(timestampInMilli);
  return dateObject.toLocaleString("en-US", {
    month: "short", // e.g., "Oct"
    day: "numeric", // e.g., "10"
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // optional: remove AM/PM
  });
};
