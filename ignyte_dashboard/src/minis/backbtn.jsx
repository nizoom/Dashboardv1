// HomeButton.jsx
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/")}
      sx={{ borderRadius: 2, margin: 2, width: "10%" }}
    >
      ⬅️ Home
    </Button>
  );
}
