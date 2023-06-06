import { render, screen } from "@testing-library/react";
import i18n from "../i18n";
import LinearRegression_ModelReview from "../pages/playground/1_LinearRegression/LinearRegression_ModelReview";
import LinearRegression from "../pages/playground/1_LinearRegression/LinearRegression";

describe('LinearRegression', () => {

  beforeEach(async () => {
    await i18n.init();
  });

  test('renders LinearRegression Review', () => {
    render(<LinearRegression_ModelReview dataset="0" />)
    expect(screen.getAllByText(/LinearRegression Review/i)[0]).toBeInTheDocument()
  });

  test('renders LinearRegression Custom', () => {
    render(<LinearRegression dataset="0" />)
    expect(screen.getAllByText(/LinearRegression Custom/i)[0]).toBeInTheDocument()
  });

});
