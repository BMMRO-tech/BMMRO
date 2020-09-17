import handleEditEncounterSubmit from "../handleEncounterSubmit";
import { FormSubmitType } from "../../constants/forms";

describe("handleEditEncounterSubmit", () => {
  describe("SAVE", () => {
    it("saves values in datastore and navigates to open encounter", () => {
      const datastore = { updateDocByPath: jest.fn() };
      const navigate = jest.fn();
      const initialValues = { a: "2", b: "2" };
      const values = { a: "1", b: "2" };

      handleEditEncounterSubmit(values, {
        encounterId: "123",
        initialValues,
        submitType: FormSubmitType.SAVE,
        datastore,
        navigate,
      });

      expect(datastore.updateDocByPath).toHaveBeenCalledWith("encounter/123", {
        a: "1",
      });

      expect(navigate).toHaveBeenCalledWith("/encounters/123/habitat-uses");
    });
  });
  describe("SAVE AND END", () => {
    beforeAll(() => {
      global.Date.now = jest.fn(() =>
        new Date("2020-01-05T11:30:00.000Z").getTime()
      );
    });

    it("saves encounter if under 72 hours, ends it and navigates to encounters", () => {
      const datastore = { updateDocByPath: jest.fn() };
      const navigate = jest.fn();
      const initialValues = { a: "2", b: "2" };
      const values = { a: "1", b: "2" };

      handleEditEncounterSubmit(values, {
        encounterId: "123",
        initialValues,
        submitType: FormSubmitType.SAVE_AND_END,
        datastore,
        navigate,
      });

      const expectedSaveValues = {
        a: "1",
        endTime: expect.anything(),
        endTimestamp: expect.anything(),
        hasEnded: true,
      };

      expect(datastore.updateDocByPath).toHaveBeenCalledWith(
        "encounter/123",
        expectedSaveValues
      );

      expect(navigate).toHaveBeenCalledWith("/encounters");
    });

    it("does not end encounter if longer than 72 hours and does not navigate", () => {
      const datastore = { updateDocByPath: jest.fn() };
      const navigate = jest.fn();
      const setAutofillEnd = jest.fn();
      const setShowDateModal = jest.fn();
      const initialValues = {};
      const values = {
        startTimestamp: new Date("2020-01-01T00:00:00.000Z"),
        startTime: "13:30",
      };

      handleEditEncounterSubmit(values, {
        encounterId: "123",
        initialValues,
        submitType: FormSubmitType.SAVE_AND_END,
        datastore,
        navigate,
        setAutofillEnd,
        setShowDateModal,
      });

      expect(setAutofillEnd).toHaveBeenCalledWith(true);
      expect(setShowDateModal).toHaveBeenCalledWith(true);

      expect(navigate).not.toHaveBeenCalled();
      expect(datastore.updateDocByPath).not.toHaveBeenCalled();
    });
  });
});
