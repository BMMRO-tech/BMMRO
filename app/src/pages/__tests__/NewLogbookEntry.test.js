import React from "react";
import { waitFor, render, screen, getByRole } from "@testing-library/react";
import NewLogbookEntry from "../NewLogbookEntry";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
describe("NewLogbookEntry", () => {
  // it('show logbook title', async () =>{
  //     const { getByText } = renderWithMockContexts(
  //           <NewLogbookEntry />
  //     );
  //
  //     await waitFor(() => expect(getByText("New Logbook Entry")).toBeInTheDocument());
  //   });
  //   it('show encounter and trips tabs', async () =>{
  //       renderWithMockContexts(
  //
  //           <NewLogbookEntry/>
  //       );
  //
  //       //await waitFor(() => expect(getByText('ENCOUNTERS', { selector: 'button' })).toBeInTheDocument());
  //       //console.log(screen.queryAllByRole('button'));
  //       //expect(screen.getByTestId("tripsTab")).toHaveTextContent('TRIPS');
  //       expect(screen.queryByTestId("tripsTab")?.textContent).toContain("TRIPS");
  //       // await waitFor(() => expect(screen.getByRole('button',{data-testid: 'ENCOUNTERS'})).toBeInTheDocument());
  //       //const submitButton = getByRole("button", { name: "ENCOUNTERS" });
  //   });
});
