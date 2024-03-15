import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";

const convertToNumbers = (name) => {
  const mapping = {
    A: "1",
    I: "1",
    J: "1",
    Q: "1",
    Y: "1",
    B: "2",
    K: "2",
    R: "2",
    C: "3",
    G: "3",
    L: "3",
    S: "3",
    D: "4",
    M: "4",
    T: "4",
    E: "5",
    H: "5",
    N: "5",
    X: "5",
    U: "6",
    V: "6",
    W: "6",
    O: "7",
    Z: "7",
    F: "8",
    P: "8",
  };

  const numbers = name
    .split("")
    .map((char) => mapping[char.toUpperCase()] || char)
    .join("")
    .replace(/\s/g, "");
  return numbers;
};

export default function Home() {
  const { control, handleSubmit } = useForm();
  const [canvasImageUrl, setCanvasImageUrl] = useState(null);

  function drawCirclePilot() {
    clearCanvas();

    const r = 150; // Radius
    const degs = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360]; // Degrees for labeling
    const theta = degs.map((deg) => (2 * Math.PI * deg) / 360); // Convert degrees to radians

    // Plot circle
    drawCircle(r);
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "circle_plot.png";
    link.href = canvasImageUrl;
    link.click();
  };

  useEffect(() => {
    drawCirclePilot();
  }, []);

  function clearCanvas() {
    const canvas = document.getElementById("circleCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawCircle(radius) {
    const canvas = document.getElementById("circleCanvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }

  function plotPoints(x, y) {
    const canvas = document.getElementById("circleCanvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + x, canvas.height / 2 - y, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  function connectPoints(x1, y1, x2, y2) {
    const canvas = document.getElementById("circleCanvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + x1, canvas.height / 2 - y1);
    ctx.lineTo(canvas.width / 2 + x2, canvas.height / 2 - y2);
    ctx.stroke();
  }

  const onSubmit = (data) => {
    if (!data?.dateOfBirth || data?.fullName.trim()?.length <= 0) {
      toast.error(
        `Please enter both your full name and date of birth in the respective fields.`
      );
      return;
    }
    const dateOfBirth = new Date(data.dateOfBirth);
    const year = dateOfBirth.getFullYear();
    const month = dateOfBirth.getMonth() + 1;
    const day = dateOfBirth.getDate();
    const simpleDateOfBirth = `${day}${month}${year}`;
    const name = convertToNumbers(data.fullName);
    drawCirclePlot(name + simpleDateOfBirth);
  };

  function drawCirclePlot(order) {
    clearCanvas();

    const r = 150; // Radius
    const degs = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360]; // Degrees for labeling
    const theta = degs.map((deg) => (2 * Math.PI * deg) / 360); // Convert degrees to radians

    // Plot circle
    drawCircle(r);

    // Plot lines between numbers based on the provided order
    let prevIndex = -1;
    for (let i = 0; i < order.length; i++) {
      const currentIndex = parseInt(order[i]);
      if (currentIndex === parseInt(order[i - 1])) {
        continue;
      }
      if (currentIndex === 0) {
        // Draw line from previous point to center
        connectPoints(
          r * Math.sin(theta[prevIndex]),
          r * Math.cos(theta[prevIndex]),
          0,
          0
        );
      } else if (prevIndex !== -1 && prevIndex === 0) {
        connectPoints(
          0,
          0,
          r * Math.sin(theta[currentIndex]),
          r * Math.cos(theta[currentIndex])
        );
      } else if (prevIndex !== -1) {
        connectPoints(
          r * Math.sin(theta[prevIndex]),
          r * Math.cos(theta[prevIndex]),
          r * Math.sin(theta[currentIndex]),
          r * Math.cos(theta[currentIndex])
        );
      }
      prevIndex = currentIndex;
    }

    const canvas = document.getElementById("circleCanvas");
    const canvasImageUrl = canvas.toDataURL();
    setCanvasImageUrl(canvasImageUrl);
  }

  return (
    <main className="flex flex-col w-screen px-5 h-screen justify-center items-center">
      <h1 className="text-3xl mb-5">Circle Plot</h1>
      <Button
        onClick={handleDownload}
        className="text-white font-medium hover:bg-green-600 bg-green-500"
        size="large"
        variant="contained"
        disabled={!canvasImageUrl}
      >
        Download
      </Button>
      <div>
        <canvas id="circleCanvas" width="400" height="400"></canvas>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 justify-center items-center"
      >
        <div className="flex gap-3 justify-center items-center">
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                className="flex-1"
                id="outlined-basic"
                label="Full name"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <DatePicker
                {...field}
                className="flex-1"
                label="Date of Birth"
                clearable
                inputFormat="dd/MM/yyyy"
              />
            )}
          />
        </div>
        <Button
          type="submit"
          className="text-white font-medium hover:bg-green-600 bg-green-500"
          size="large"
          variant="contained"
        >
          Create circle plot
        </Button>
      </form>
    </main>
  );
}
