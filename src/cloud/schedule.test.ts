import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { frequencyDescription, type ScheduleFrequency } from "./schedule.js";

describe("frequencyDescription", () => {
  it("returns correct description for daily", () => {
    const desc = frequencyDescription("daily");
    assert.ok(desc.includes("every day"));
    assert.ok(desc.includes("8:00 AM"));
  });

  it("returns correct description for weekly", () => {
    const desc = frequencyDescription("weekly");
    assert.ok(desc.includes("Monday"));
    assert.ok(desc.includes("8:00 AM"));
  });

  it("returns correct description for monthly", () => {
    const desc = frequencyDescription("monthly");
    assert.ok(desc.includes("1st"));
    assert.ok(desc.includes("8:00 AM"));
  });
});
