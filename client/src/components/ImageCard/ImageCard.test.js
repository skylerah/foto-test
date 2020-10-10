import React from "react";
import ReactDOM from "react-dom";
import ImageCard from "./ImageCard";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import logo from "../../assets/images/logo.png";

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
  expect(getByTestId("tag0")).toHaveTextContent("puppy");
  expect(getByTestId("tag1")).toHaveTextContent("animal");
});

it("doesn't display delete button for images not owned by current user", () => {
  const tags = [];
  const { queryByTestId } = render(
    <ImageCard
      tags={tags}
      caption=""
      src=""
      ownerName=""
      photoID=""
      ownerID="00"
      userID="01"
    />
  );
  expect(queryByTestId("deleteBtn")).toBeNull();
});

it("displays delete button for images owned by current user", () => {
  const tags = [];
  const { queryByTestId } = render(
    <ImageCard
      tags={tags}
      caption=""
      src=""
      ownerName=""
      photoID=""
      ownerID="00"
      userID="00"
    />
  );
  expect(queryByTestId("deleteBtn")).toBeTruthy();
});

it("displays correct owner name", () => {
  const tags = [];
  const { getByTestId } = render(
    <ImageCard tags={tags} caption="" src="" ownerName="Mary" photoID="" />
  );
  expect(getByTestId("ownerName")).toHaveTextContent("Mary");
});

it("renders correct image", () => {
  const tags = [];
  const { getByTestId } = render(
    <ImageCard tags={tags} caption="" src={logo} ownerName="" photoID="" />
  );
  expect(getByTestId("image")).toHaveAttribute("src", logo);
});
