import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";

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

  const onSubmit = (data) => {
    const dateOfBirth = new Date(data.dateOfBirth);

    const year = dateOfBirth.getFullYear();
    const month = dateOfBirth.getMonth() + 1;
    const day = dateOfBirth.getDate();

    const simpleDateOfBirth = `${day}${month}${year}`;

    const name = convertToNumbers(data.fullName);

    console.log(name + simpleDateOfBirth);
  };

  return (
    <main className="flex flex-col w-screen px-5 h-screen justify-center items-center">
      <h1 className="text-3xl mb-5">Circle Plot</h1>
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
