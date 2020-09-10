import React from "react";
import ReactDOM from "react-dom";
import ImageCard from "./ImageCard";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

it("renders without crashing", () => {
  const div = document.createElement("div");
  const tags = [];
  ReactDOM.render(
    <ImageCard tags={tags} caption="" src="" ownerName="" photoID="" />,
    div
  );
});

it("renders caption correctly", () => {
  const tags = [];
  const { getByTestId } = render(
    <ImageCard
      tags={tags}
      caption="SAMPLE CAPTION"
      src=""
      ownerName=""
      photoID=""
    />
  );
  expect(getByTestId("caption")).toHaveTextContent("SAMPLE CAPTION");
});

it("renders 'shared by' section correctly", () => {
  const tags = [];
  const { getByTestId } = render(
    <ImageCard tags={tags} caption="" src="" ownerName="" photoID="" />
  );
  expect(getByTestId("shared")).toHaveTextContent("shared by");
});

it("renders owner name correctly", () => {
  const tags = [];
  const { getByTestId } = render(
    <ImageCard
      tags={tags}
      caption=""
      src=""
      ownerName="Jack Daniels"
      photoID=""
    />
  );
  expect(getByTestId("ownerName")).toHaveTextContent("Jack Daniels");
});

it("renders tags correctly", () => {
  const tags = ["puppy", "animal"];
  const { getByTestId } = render(
    <ImageCard tags={tags} caption="" src="" ownerName="" photoID="" />
  );
  expect(getByTestId("puppy0")).toHaveTextContent("puppy");
  expect(getByTestId("animal1")).toHaveTextContent("animal");
});
