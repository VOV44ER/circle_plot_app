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

export default function CirclePlot() {
  const { control, handleSubmit } = useForm();
  const [svgImage, setSvgImage] = useState(null);

  useEffect(() => {
    drawCirclePlot(""); // Initial render without lines
  }, []);

  const drawCirclePlot = (order) => {
    const r = 150; // Radius
    const theta = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map(
      (deg) => (2 * Math.PI * deg) / 360
    ); // Convert degrees to radians

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">`;
    // Plot circle
    svgContent += `<circle cx="200" cy="200" r="${r}" fill="none" stroke="black" stroke-width="2"/>`;

    // Plot lines between numbers based on the provided order
    let prevIndex = -1;
    for (let i = 0; i < order.length; i++) {
      const currentIndex = parseInt(order[i]);
      if (currentIndex === parseInt(order[i - 1])) {
        continue;
      }
      if (currentIndex === 0) {
        // Draw line from previous point to center
        svgContent += `<line x1="${200 + r * Math.sin(theta[prevIndex])}" y1="${
          200 - r * Math.cos(theta[prevIndex])
        }" x2="${200}" y2="${200}" stroke="black" stroke-width="2"/>`;
      } else if (prevIndex !== -1 && prevIndex === 0) {
        svgContent += `<line x1="${200}" y1="${200}" x2="${
          200 + r * Math.sin(theta[currentIndex])
        }" y2="${
          200 - r * Math.cos(theta[currentIndex])
        }" stroke="black" stroke-width="2"/>`;
      } else if (prevIndex !== -1) {
        svgContent += `<line x1="${200 + r * Math.sin(theta[prevIndex])}" y1="${
          200 - r * Math.cos(theta[prevIndex])
        }" x2="${200 + r * Math.sin(theta[currentIndex])}" y2="${
          200 - r * Math.cos(theta[currentIndex])
        }" stroke="black" stroke-width="2"/>`;
      }
      prevIndex = currentIndex;
    }

    svgContent += `</svg>`;
    setSvgImage(`data:image/svg+xml;base64,${btoa(svgContent)}`);
  };

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

  return (
    <main className="flex flex-col w-screen px-5 h-screen justify-center items-center">
      <h1 className="text-3xl mb-5">Circle Plot</h1>
      <Button
        onClick={() => {
          const link = document.createElement("a");
          link.download = "circle_plot.svg";
          link.href = svgImage;
          link.click();
        }}
        className="text-white font-medium hover:bg-green-600 bg-green-500"
        size="large"
        variant="contained"
        disabled={!svgImage}
      >
        Download
      </Button>
      <div>{svgImage && <img src={svgImage} alt="Circle Plot" />}</div>
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
