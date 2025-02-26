# FC Todo Backend

## Description

This repository contains the backend part of the **Task Management** application, built using **Node.js**. The frontend is available at: [https://github.com/Khors/fc-todo-front](https://github.com/Khors/fc-todo-front)

## Requirements

- **MySQL** for the database.
- **Node.js** for running the server.

## Installation Instructions

1. Clone the repository:

   ```
   git clone git@github.com:Khors/fc-todo-back.git
   ```

2. Navigate to the repository folder:

   ```
   cd fc-todo-back
   ```

3. Rename `.example.env` to `.env`:

   ```
   mv .example.env .env
   ```

4. Enter your credentials in the `.env` file.

5. Install dependencies:

   ```
   npm install
   ```

## Run Commands

- Start in development mode:
  ```
  npm run start:dev
  ```
- Start in production mode:
  ```
  npm run start:prod
  ```

## API Endpoints

- **GET /tasks** - Retrieve a list of all tasks.
- **POST /tasks** - Create a new task.
- **PATCH /tasks/:id/status** - Change task status.
- **POST /tasks/:taskId/assign/:userId** - Assign a user to a task.
- **DELETE /tasks/:taskId/assign/:userId** - Remove a user from a task.
- **DELETE /tasks/:id** - Delete a task.

## Technical Information

- **Node.js version:** Ensure you have Node.js installed (minimum version 14.x).
- **Database:** MySQL.
- **Configuration file:** `.env` is used for setting parameters.

## Author

Dmytro Burkovskyi
