# Application Tracker

A small browser-based tracker for Ausbildung applications.

When applications, links, deadlines and next actions are spread across tabs and notes, it becomes easy to lose control. This project turns that process into a simple table-based workflow.

## Features

- Add application entries with company, role, city, link, status and next action
- Edit or delete existing entries
- Filter entries by status
- Save data in `localStorage`
- Export the current list as JSON or CSV
- Seed demo data when the app is opened for the first time

## Tech Stack

- HTML
- CSS
- JavaScript
- Browser `localStorage`

No framework and no build step are required.

## How to Use

Open `index.html` in any browser.

1. Add a company and role.
2. Choose the application status.
3. Write the next concrete action.
4. Filter the list when the table grows.
5. Export the data when a backup is needed.

## What This Project Shows

- Basic form handling
- Table rendering from JavaScript state
- Local browser persistence
- Editing and deleting entries
- Simple status filtering
- JSON and CSV export
- Turning a real personal workflow into a small web tool

## Possible Improvements

- Deadline reminders
- Priority scoring
- CSV import
- German/English interface switch
- Search by company, city or role
