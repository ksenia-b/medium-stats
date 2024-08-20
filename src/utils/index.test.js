import { describe, expect, it } from "vitest";

import { calculateEarnings } from ".";

describe("calculateEarnings", () => {
  it("should return 0 if data is falsy", () => {
    expect(calculateEarnings(null)).toBe(0);
  });

  it("should return earnings", () => {
    expect(calculateEarnings({ units: 1, nanos: 10000000 })).toBe(1.01);
  });
});
