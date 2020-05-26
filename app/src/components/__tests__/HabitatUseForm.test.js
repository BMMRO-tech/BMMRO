import React from "react";
import { render, wait, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import HabitatUseForm from "../HabitatUseForm";
import { DatastoreContext } from "../../App";

describe("Habitat Use Validation", () => {
  describe("numberOfAnimals", () => {
    it("should output no error when input is valid", async () => {
      const { queryByTestId } = render(
        <DatastoreContext.Provider value={{}}>
          <HabitatUseForm />
        </DatastoreContext.Provider>
      );

      const input = queryByTestId("numberOfAnimals");

      await wait(async () => {
        user.click(input);
        await user.type(input, "10");
        user.tab();
      });
      const error = queryByTestId("error-numberOfAnimals");

      expect(error).not.toBeInTheDocument();
      expect(input.value).toBe("10");
    });
    it("should display an error when input is empty", async () => {
      const { queryByTestId } = render(
        <DatastoreContext.Provider value={{}}>
          <HabitatUseForm />
        </DatastoreContext.Provider>
      );

      const input = queryByTestId("numberOfAnimals");

      await wait(async () => {
        user.click(input);
        user.tab();
      });
      const error = queryByTestId("error-numberOfAnimals");

      expect(error).toBeInTheDocument();
    });
  });
});
