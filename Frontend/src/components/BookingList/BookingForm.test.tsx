import { describe, it, expect } from "vitest";
import { parseSeatToken, parseSeatsInput } from "./BookingForm";

describe("BookingForm seat parser", () => {
  it("parses alpha numeric seats", () => {
    expect(parseSeatToken("A1")).toEqual({ row: 1, column: 1 });
    expect(parseSeatToken("B-12")).toEqual({ row: 2, column: 12 });
  });

  it("parses numeric seats", () => {
    expect(parseSeatToken("1-2")).toEqual({ row: 1, column: 2 });
    expect(parseSeatToken("10:5")).toEqual({ row: 10, column: 5 });
  });

  it("detects invalid tokens and deduplicates seats", () => {
    const parsed = parseSeatsInput("A1, A1, ZZ, 2-3");
    expect(parsed.invalid).toEqual(["ZZ"]);
    expect(parsed.seats).toEqual([
      { row: 1, column: 1 },
      { row: 2, column: 3 },
    ]);
  });
});
