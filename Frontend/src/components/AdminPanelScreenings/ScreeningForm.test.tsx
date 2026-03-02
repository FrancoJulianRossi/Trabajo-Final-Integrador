import { render, screen, fireEvent } from "@testing-library/react";
import ScreeningForm from "./ScreeningForm";
// note: React import unnecessary with JSX transform

describe("ScreeningForm", () => {
  const movies = [{ idMovie: 1, name: "Movie", length: 90 }];
  const rooms = [{ idRoom: 1, name: "Room 1", type: "Standard", capacity: 50 }];

  it("displays validation error when start time is in the past", () => {
    // @ts-ignore jest global
    const onSave = jest.fn();
    // @ts-ignore jest global
    const onCancel = jest.fn();

    render(
      <ScreeningForm
        movies={movies as any}
        rooms={rooms as any}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );

    // set date to yesterday and time to 00:00
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dateString = yesterday.toISOString().slice(0, 10);
    const timeString = "00:00";

    const dateInput = screen.getByLabelText(/Fecha/i) as HTMLInputElement;
    const timeInput = screen.getByLabelText(/Hora Inicio/i) as HTMLInputElement;
    const submit = screen.getByRole("button", { name: /Crear/i });

    fireEvent.change(dateInput, { target: { value: dateString } });
    fireEvent.change(timeInput, { target: { value: timeString } });
    fireEvent.click(submit);

    expect(screen.getByText(/pasado/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave when data is valid", () => {
    // @ts-ignore jest global
    const onSave = jest.fn();
    // @ts-ignore jest global
    const onCancel = jest.fn();

    render(
      <ScreeningForm
        movies={movies as any}
        rooms={rooms as any}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );

    const today = new Date();
    const dateString = today.toISOString().slice(0, 10);
    const timeString = "23:00";

    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: dateString },
    });
    fireEvent.change(screen.getByLabelText(/Hora Inicio/i), {
      target: { value: timeString },
    });

    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    expect(onSave).toHaveBeenCalled();
  });
});