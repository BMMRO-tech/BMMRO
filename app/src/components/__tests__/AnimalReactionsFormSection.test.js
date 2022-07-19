import React from "react";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { configure } from "@testing-library/dom";
import renderWithinFormik from "../../utils/test/renderWithinFormik";
import { getPosition } from "../formFields/PositionInput/getPosition.js";
import animalReactions from "../../constants/formOptions/animalReactions";
import AnimalReactionFormSection from "../AnimalReactionFormSection";
import { fireEvent } from "@testing-library/react";

describe("AnimalReactionFormSection", () => {
    it.skip("has a list of animal behvaiour checkboxes present", async () => {
        const { getByRole, getFormValues, getByTestId, getByLabelText } = renderWithinFormik(
            <AnimalReactionFormSection isViewOnly={false} title="Behaviour"/>,
          );

        // for (const reaction of animalReactions){
            const checkboxInput = getByRole("checkbox", { name: "Shake" });
        // }

        // for (const reaction of animalReactions){
            await waitFor(async () => {
                expect(getFormValues.hasOwnProperty("Shake")).toEqual(false);
                expect(getFormValues.shake).toEqual(false);
            });
        // }
    });  
})