# Test Plan

This document outlines the testing approach for the Portfolio Dashboard application. Follow these steps to verify that the application meets all the acceptance criteria.

## Prerequisites

- Node.js 18+ and npm installed
- Internet connection (for API calls to Yahoo Finance and Google Finance)

## Setup for Testing

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Test Cases

### 1. Initial Load

- **Objective**: Verify that the application loads correctly with initial data
- **Steps**:
  1. Open the application in a browser
  2. Wait for the initial data to load
- **Expected Results**:
  - KPI Cards should display Total Investment, Present Value, and Net Gain/Loss
  - Portfolio Table should display all holdings grouped by sector
  - Sector Donut chart should display sector allocation
  - Success toast should appear briefly

### 2. Auto-refresh Functionality

- **Objective**: Verify that the data auto-refreshes every 15 seconds
- **Steps**:
  1. Open the application in a browser
  2. Note the "Last updated" timestamp
  3. Wait for 15 seconds
- **Expected Results**:
  - Data should refresh automatically
  - "Last updated" timestamp should update
  - Success toast should appear briefly

### 3. Manual Refresh

- **Objective**: Verify that the manual refresh button works
- **Steps**:
  1. Click the "Refresh" button in the header
- **Expected Results**:
  - Button should show "Refreshing..." while loading
  - Data should refresh
  - Success toast should appear briefly

### 4. Sector Grouping

- **Objective**: Verify that sector grouping works correctly
- **Steps**:
  1. Click on a sector header in the table
- **Expected Results**:
  - Sector should expand/collapse to show/hide individual holdings
  - Sector totals should be displayed correctly
  - Grand totals should be displayed at the bottom of the table

### 5. Responsive Design

- **Objective**: Verify that the application is responsive
- **Steps**:
  1. Resize the browser window to different sizes
  2. Open the application on a mobile device or use browser dev tools to simulate one
- **Expected Results**:
  - Layout should adapt to different screen sizes
  - On small screens, the sector donut should appear below the table
  - Table should be horizontally scrollable on small screens

### 6. Color Coding

- **Objective**: Verify that gain/loss values are color-coded correctly
- **Steps**:
  1. Observe the gain/loss values in the table
- **Expected Results**:
  - Positive values should be green
  - Negative values should be red
  - This applies to both the gain/loss amount and percentage

### 7. Error Handling

- **Objective**: Verify that the application handles errors gracefully
- **Steps**:
  1. Disconnect from the internet
  2. Wait for the next auto-refresh or click the refresh button
- **Expected Results**:
  - Error toast should appear
  - Application should continue to display the last successfully fetched data
  - Application should attempt to retry the fetch

### 8. API Functionality

- **Objective**: Verify that the API routes work correctly
- **Steps**:
  1. Open [http://localhost:3000/api/snapshot](http://localhost:3000/api/snapshot) in a browser
- **Expected Results**:
  - API should return a JSON response with portfolio data
  - Response should include holdings, sectorTotals, and summary

## Acceptance Criteria Verification

Verify that the application meets all the acceptance criteria:

- [ ] Table shows all columns (Sector, Particulars, Purchase Price, Quantity, Investment, Portfolio %, NSE/BSE, CMP, Present Value, Gain/Loss, P/E Ratio, Latest Earnings)
- [ ] Auto-refresh every 15 seconds works
- [ ] Sector grouping with correct subtotals works
- [ ] Grand totals are correct
- [ ] Red/green gain/loss coloring works
- [ ] P/E Ratio and Latest Earnings are visible (or "–" if missing)
- [ ] Three KPI cards are accurate
- [ ] Project runs cleanly with `npm i && npm run dev`

## Performance Testing

- **Page Load Time**: Should be under 2 seconds on a decent connection
- **Memory Usage**: Monitor browser memory usage during extended use
- **CPU Usage**: Should not cause significant CPU spikes during normal operation
- **Network Requests**: Monitor the frequency and size of network requests

## Browser Compatibility

Test the application on the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Reporting Issues

If you encounter any issues during testing, please report them with the following information:

1. Test case or scenario
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Browser and version
7. Operating system