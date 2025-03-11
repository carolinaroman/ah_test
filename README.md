## Test

## Goal

Build a web app that matches new patients to available therapists based
on a number of criteria which will influence their fit.

## Main description

This monorepo contains a Vite React web, with a Node.js Express.js backend.

## How to run locally?

1. Get this monorepo and install all packages with `npm i`

2. The whole system uses an API key, generated in Node with 
    ```
    crypto.randomBytes(64).toString("hex")
    ```
3. In the `backend` directory:
   1. Create a `.env` file, and set the variable `ANISE_API_KEY` with the value calculated in the step above.

   2. Run `npm run backend`. This will start the Express API server in the port 5000 of your local machine.

4. In the `frontend` directory: 
   1. Create a `.env` file in  with the following content
       ```
       VITE_ANISE_API_KEY={{same value as in backend/.env}}
       VITE_VERCEL_URL="http://localhost:5000"
       ```
   2. Run `npm run frontend`. This will start the website in http://localhost:5173/

### Tech used

#### Frontend
- [Ky](https://github.com/sindresorhus/ky) is a lightweight no dependencies HTTP client based on the fetch API, that reduces the boilerplate code to make simple API requests.  
- [Tailwind CSS](https://tailwindcss.com/) a CSS framework for fast design and styling.
- [Formik](https://formik.org/) a form library for React that handles validation, state management.

#### Backend
- [Danfo.js](https://danfo.jsdata.org/) is a library to manipulate and process structured data. Danfo allows me to work with data in columns directly from the csv file, instead of a database backend (also, I normally work with an ORM, not in SQL directly)
- [Joi](https://joi.dev/) this is a schema validator for Javascript that allows not only to define what attributes are required in the request to the API, but I can also specify the type of data (for example, email).

### Notes
- I added the following columns to the mock data in the CSV
  - "State licensed" to filter immediately the providers licensed in the patient state.
  - "Insurance accepted", also to filter providers for a member who's not Self Pay. For Self-Pay members, no filter is applied. 
  - matchscore, a temporary numeric column (its changes are not saved) to calculate a score with Danfo and sort by it.
