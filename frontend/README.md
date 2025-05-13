This file is from Assignment 1, and currently contains minor changes to be up to date with Assignment 2

# s4084578-s4094187-a1
Full Stack Development Assignment 1 (Ryan Favaloro (s4084578) and Aaron Tran (s4094187))
https://github.com/rmit-fsd-2025-s1/s4084578-s4094187-a1
Please note that the above repository is for Assignment 1. The Assignment 2 repository can be found in the readme of the main folder.



Upon a successful login, the localstorage value "login" will be updated with "lecturer" or "tutor", based on whether the account is associated with a lecturer or tutor. Only lecturers can access the lecturer page, with the validation being done by checking the localstorage value (tutor page has a similar feature). This can be bypassed by manually setting the localstorage value for "login" to "admin", allowing access to both pages. This override will need to be applied every time there is a new login.

Sample logins include:
    Email: Admin@rmit.edu.au
    Password: password
    #This login gives access to both lecturer and tutor pages. Dummy tutor details will be displayed in the tutor page but not lecturer

    Email: Lecturer@rmit.edu.au
    Password: password
    #This login gives access to only lecturer page
    
    Email: JohnDoe@rmit.edu.au
    Password: password
    #This login gives access to sample character John Doe's tutor page

    Other tutor logins can be found in the _app.tsx file starting at line 13 in the array. 
    The login details will be the first 2 elements of each account and give access to their unique information.

Some unit tests have been set up using Jest. Run "npm test" in terminal from the project's root directory to run the tests.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
