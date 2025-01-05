# Reap Challenge Frontend

## Description

This is the frontend of the Reap Challenge project, developed using **Next.js** and **Tailwind CSS**. It provides an admin interface to manage organizations and users, allowing for the creation and update of organizations' PCC configurations.

## Features

- List all organizations and view their details.
- Create and update an organization's PCC configuration.
- Manage users and their access to facilities.

## Installation

### Prerequisites

Ensure the backend is running and reachable at the URL specified in the `.env` file.

1. Clone the repository:

    `git clone https://github.com/nico98gon/reap-challenge-front`
    `cd reap-challenge-front`
    
2. Install dependencies:

    `npm install`

3. Set up the `.env` file with the following variables:

    `NEXT_PUBLIC_API_URL=http://localhost:4000`

4. Start the development server:

    `npm run dev`

    The application will be available at [http://localhost:3000](http://localhost:3000).


## Project Structure

The project follows a modular folder structure:

- **/app**: Main application directory using the App Router in Next.js.
    
    - **/organization**: Contains pages and components for managing organizations.
        - **/[id]**: Dynamic route for viewing a specific organization.
        - **/components**: Reusable components for the organization pages, such as:
            - `CreateOrganizationDialog.tsx`
            - `OrganizationCard.tsx`
            - `OrganizationList.tsx`
    - **/users**: Contains pages and components for managing users.
        - **/[id]**: Dynamic route for viewing a specific user.
        - **/components**: Reusable components for user-related pages, such as:
            - `CreateUserDialog.tsx`
            - `UserCard.tsx`
            - `UserList.tsx`
- **/components**: Global shared components used across the application.
    
    - `Pagination.tsx`, `ThemeProvider.tsx`, `ThemeToggle.tsx`
    - **/ui**: UI primitives (e.g., `button.tsx`, `dialog.tsx`, `input.tsx`).
- **/lib**: Utility functions and shared logic.
    
    - `utils.ts`
- **/styles**: Global styles and Tailwind CSS configuration.
    

## Development Commands

- Start the development server:

    `npm run dev`

- Lint the code:

    `npm run lint`

- Build the application for production:

    `npm run build`

- Serve the production build locally:

    `npm run start`


## Deployment

The application can be easily deployed to platforms like **Vercel**. Follow these steps:

1. Push your repository to a remote platform (e.g., GitHub).
2. Connect your repository to Vercel via their dashboard.
3. Set up the environment variables in the Vercel project settings:
    - `NEXT_PUBLIC_API_URL` (pointing to your backend URL).
4. Deploy the project.

For more details on deployment, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## API Integration

The frontend interacts with the backend through RESTful APIs. Ensure the backend server is running and accessible.

Key endpoints used:

- **GET /organizations**: Fetch all organizations.
- **GET /organizations/:id**: Fetch details of a specific organization.
- **POST /organizations/:id/pcc-configuration**: Create or update an organization's PCC configuration.

## Learn More

To learn more about the technologies used in this project, refer to the following:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- TypeScript Documentation

## Useful Links

- Backend Repository: [Reap Challenge Backend](https://github.com/nico98gon/reap-challenge/tree/develop)
- Postman Team Workspace: [Postman Link](https://app.getpostman.com/join-team?invite_code=0389ba1a43d2d0e65ee37582f0952a7a82fe604f17aa487839a8647ecba08845)