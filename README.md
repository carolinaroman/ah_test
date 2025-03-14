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

### Logic

The mock data contains most of the information I needed. However, I added a couple of columns to help me filter. The first one is "State Licensed", which could different from Location. The second one is "Insurance Accepted": it does not follow that all providers work with all insurances.

The filter system contains different levels of importance for the parameters provided by the patient:

1. **Critical Filters** are related to unavoidable limitations for which provider the patient can see:
   - State: a provider cannot see a patient if they are nor licensed in the patient's state of residence
   - Insurance: patients with a given insurance want to work with providers in their network, or select Self Pay if this is not a limitation, in which case this filter is not applied.
   
2. **Essential Filters:** these are the actual problems or concerns the patient has when looking for help. I considered this more important than the therapeutic approach, since this is what the patient will know for sure. We cannot expect them to fully know the difference between different methodologies, and also providers use multiple approaches to treat patients.

    While examining the mock data, it turns out there were at least 32 different descriptions of different concerns. Providers often use their own language when describing the concerns they can work with. In order to avoid showing 32 options to the patient in the selection form, I gathered in broader categories, for example:
    ```
      "ADHD & Autism": [
        "ADHD",
        "Attention Deficit Hyperactivity Disorder (ADD/ADHD)",
        "Autism",
      ],
    ```
   This allows me to match strings like `Attention Deficit Hyperactivity Disorder (ADD/ADHD)` to find a provider in the mock data. I used the array to display tooltips to the patient, in case they need a bit of extra help to find their exact concern in the page.

3. **Significant Filters:** an important part of the therapeutic relationship is the trust created between the provider and the patient. Having a provider who understands our background can be a big help. Given the mock data, 4 essential filters were identified. _These filters are optional and have the same importance_, allowing for the patient to select "No preference" in which case the filter is skipped.
   - Ethnic Identity
   - Gender Identity
   - Language
   - Religious Background

4. **Flexible filters**. In this category I put Therapy Methodologies. If our patient knows what therapeutic approach they would like to get in their therapy, then can choose it. Otherwise, they are not forced to make a selection. This is another case where I found all possible methodologies in the mock data, and created broader categories. The different names are displayed to the patient, so if they are interested in "Family Systems Therapy", they are able to find it inside the category "Relationship & Family".

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
  - "State licensed"
  - "Insurance accepted"
  - matchscore, a temporary numeric column (its changes are not saved) to calculate a score with Danfo and sort by it.
- The csv with the mock data needed some sanitation. Its encoding was not UTF-8, and one of the rows had the data in the wrong order. Normally this would be done when saving into the database, so I simply changed the mock data instead of correcting it during runtime.
