import handleEditTripSubmit from "../handleTripSubmit";
import { FormSubmitType } from "../../constants/forms";

describe("handleEditTripSubmit", () => {
  describe("SAVE", () => {
    it("saves values in datastore and navigates to summary trip", () => {
      const datastore = { updateDocByPath: jest.fn() };
      const navigate = jest.fn();
      const initialValues = { a: "2", b: "2" };
      const values = { a: "1", b: "2" };

      handleEditTripSubmit(values, {
        tripId: "123",
        initialValues,
        submitType: FormSubmitType.SAVE,
        datastore,
        navigate,
      });

      expect(datastore.updateDocByPath).toHaveBeenCalledWith("trip/123", {
        a: "1",
      });

      expect(navigate).toHaveBeenCalledWith("/trips/123/view");
    });
  });
});
