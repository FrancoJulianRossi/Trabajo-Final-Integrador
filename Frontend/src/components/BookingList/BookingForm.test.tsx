import { render, screen, fireEvent } from "@testing-library/react";
import BookingForm from "./BookingForm";

describe("BookingForm", () => {
  const baseReservation = {
    idReservation: 0,
    userId: 0,
    screeningId: 0,
    reservationDate: "",
    status: "Pending",
    total: 0,
    reservationSeats: [],
    screening: { idScreening: 0, movieId: 0, roomId: 0, date: "", start: "", end: "", ticketPrice: 0 },
  } as any;

  it("renders inputs and calls onSave with updated fields", () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    render(
      <BookingForm
        reservation={baseReservation}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );

    // set user id and screening id
    fireEvent.change(screen.getByLabelText(/ID Usuario/i), { target: { value: "42" } });
    fireEvent.change(screen.getByLabelText(/ID Función/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/Fecha/i), { target: { value: "2024-01-01" } });
    fireEvent.change(screen.getByLabelText(/Inicio/i), { target: { value: "10:00" } });
    fireEvent.change(screen.getByLabelText(/Asientos/i), { target: { value: "1-1, 1-2" } });

    fireEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    expect(onSave).toHaveBeenCalled();
    const saved = onSave.mock.calls[0][0];
    expect(saved.userId).toBe(42);
    expect(saved.screeningId).toBe(123);
    expect(saved.screening.idScreening).toBe(123);
    expect(saved.screening.date).toBe("2024-01-01");
    expect(saved.reservationSeats.length).toBe(0); // parsing only keeps existing seats
  });
});
