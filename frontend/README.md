# Receipt Expense Tracker (In Progress)

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
- Testing: xUnit

---

## 🧩 Implemented Features

- User sign-up, sign-in, and sign-out
- Secure session handling with JWT and HttpOnly cookies
- Form validation and duplicate email handling
- Receipt image upload and mobile camera capture
- Receipt total extraction using Azure AI Vision OCR

---

## 🔬 Testing

- Wrote 19 xUnit tests for authentication logic
- Covered input validation, password hashing, duplicate emails, invalid credentials, and successful sign-up and sign-in flows

---

## 🚧 Features in Progress

- Automatic category selection based on the selected store
- Expense review, editing, and saving

---

## 👤 Author

- Chloe Jo
- GitHub: [chloejo-dev](https://github.com/chloejo-dev)
