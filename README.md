# Receipt Expense Tracker

A mobile-first, full-stack expense tracking application built with React, TypeScript, C#, ASP.NET Core, and Microsoft SQL Server.

---

## 🎯 Problem

I started this project after repeatedly finding receipts that I had forgotten to record. After making several purchases throughout the day, receipts can easily go untracked, and manually entering those expenses a day or two later becomes tedious and time-consuming.

---

## 💡 Solution

Receipt Expense Tracker addresses this everyday problem by using optical character recognition (OCR) to extract totals from receipt images. The application also selects a default expense category based on the selected store, while allowing users to review and edit the information before saving it.

---

## 🛠 Tech Stack

- Frontend: TypeScript, React
- Backend: C#, ASP.NET Core Web API
- Database: Microsoft SQL Server
- ORM: Entity Framework Core
- OCR: Azure AI Vision
- Testing: xUnit, Vitest

---

## 🧩 Implemented Features

- User sign-up, sign-in, and sign-out
- Secure session handling with JWT and HttpOnly cookies
- Form validation and duplicate email handling
- Receipt image upload and mobile camera capture
- Receipt total extraction using Azure AI Vision OCR
- Automatic category selection based on the selected store, with manual override
- Receipt and expense saving through a JWT-protected REST API
- Server-side validation of stores, categories, and expense totals

---

## 🔬 Testing

- Wrote 26 unit tests for authentication, text extraction, and automatic default category selection
- Covered input validation, password hashing, successful/failed sign-in and sign-up scenarios, receipt-total extraction, and automatic category selection

---

## 🚧 Features in Progress

- Expense list and detail views
- Updating and deleting saved expense records

---

## 👤 Author

- Chloe Jo
- GitHub: [chloejo-dev](https://github.com/chloejo-dev)
