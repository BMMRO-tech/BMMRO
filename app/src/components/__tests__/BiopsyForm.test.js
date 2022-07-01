import React from "react";
import { act, render } from "@testing-library/react";
import BiopsyForm from "../BiopsyForm";
import { it } from "date-fns/locale";

describe.skip("BiopsyForm", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

  // it("submits the form with correct values if all fields are completed", async () => {
  //   const realGeolocation = global.navigator.geolocation;

  //   global.navigator.geolocation = {
  //     getCurrentPosition: jest.fn().mockImplementation((success) =>
  //       success({
  //         coords: {
  //           latitude: 1.123456,
  //           longitude: 1.123456,
  //         },
  //       })
  //     ),
  //   };

  //   let formValues;
  //   const mockHandleSubmit = (values) => {
  //     formValues = values;
  //   };

  //   const handleSubmit = jest.fn()
  //   const { getByRole } = render(
  //     <BiopsyForm handleSubmit={mockHandleSubmit} />
  //   );

  //   await act(async () => {
  //     const speciesInput = getByRole("combobox", { name: "Species *" });
  //     const latitudeInput = getByRole("spinbutton", { name: "Lat" });
  //     const longitudeInput = getByRole("spinbutton", { name: "Long" });
  //     const samplerNameInput = getByRole("textbox", { name: "Sampler Name" });
  //     const attemptInput = getByRole("textbox", { name: "Attempt" });
  //     const gpsMarkInput = getByRole("textbox", { name: "GPS Mark" });
  //     const totalSpecimensInput = getByRole("textbox", {
  //       name: "Total specimens",
  //     });

  //     const submitButton = getByRole("button", { name: "Save" });

  //     userEvent.selectOptions(speciesInput, "Fin whale");
  //     userEvent.clear(latitudeInput);
  //     await userEvent.type(latitudeInput, "15.123456");
  //     userEvent.clear(longitudeInput);
  //     await userEvent.type(longitudeInput, "10.101010");
  //     await userEvent.type(attemptInput, "1");
  //     await userEvent.type(samplerNameInput, "T.U.");
  //     await userEvent.type(gpsMarkInput, "123");
  //     await userEvent.type(totalSpecimensInput, "5");
  //     userEvent.click(submitButton);
  //   });

  //   expect(formValues.species).toEqual("Fin whale");
  //   expect(formValues.latitude).toEqual("15.123456");
  //   expect(formValues.longitude).toEqual("10.101010");
  //   expect(formValues.gpsMark).toEqual("123");
  //   expect(formValues.startTime).toEqual("11:30:12");
  //   expect(formValues.longitude).toEqual("10.101010");
  //   expect(formValues.startTime).toEqual("11:30:12");
  //   expect(formValues.Date).toEqual("2020-05-04");
  //   expect(formValues.endTime).toEqual("");
  //   expect(formValues.attempt).toEqual("1");
  //   expect(formValues.samplerName).toEqual("T.U.");

  //   global.navigator.geolocation = realGeolocation;
  // });

  it.skip('rendering and submitting a basic Formik form', async () => {
    const handleSubmit = jest.fn()
    render(<BiopsyForm handleSubmit={handleSubmit} />)
    const user = userEvent.setup()
  
    await act(async () => {
     user.type(screen.getByRole("textbox", { name: "Sampler Name" }), "R");
    },
    
    
    expect(handleSubmit).toHaveBeenCalledWith({
        samplerName: 'R'
    }))
  })

  it("contains cancel button", () => {
    const { queryByRole } = render(<BiopsyForm />);

    expect(queryByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
