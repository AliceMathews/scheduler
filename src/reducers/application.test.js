import reducer from "reducers/application";

import React from "react";

import { render, cleanup } from "@testing-library/react";

afterEach(cleanup);

describe("Reducer", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});
