# Project thinking of cloud drive project inspired from google drive and dropbox

* first we need to setup the basic react project- using vite..
* then we need to setup the tailwind.

## (1) Tailwind setup using vite

* now to setup the tailwind follow these steps

* ### step 1 => Create your project

  * this is either done when we creata a simple react project using vite.

    ```bash
    npm create vite@latest my-project
    cd my-project
    ```

* ### step 2 => Install Tailwind CSS

  * after this we need to install tailwind css

    ```bash
    npm install tailwindcss @tailwindcss/vite
    ```

* ### step 3 => Configure the Vite plugin

  * after this we need to configure the vite pulugin.js/ts file

    ```js
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    import tailwindcss from '@tailwindcss/vite' // importing tainwindcss

    // https://vite.dev/config/
    export default defineConfig({
        plugins: [
            react(),
            tailwindcss(), // set the tailwind plugin
        ],
    })
    ```

* ### step 4 => Import Tailwind CSS

  * import tailwind in the index.css file

    ```js
    @import "tailwindcss";
    ```

* ### step 5 => Start using Tailwind

  * now we can use the tailwind css.

    ```jsx

    import './App.css'
    function App() {
        return (
            <>
                <h1 className='bg-amber-300 m-10 text-center text-xl'>this is setup to test the tailwind</h1>
            </>
        )
    }
    export default App
    ```

---

## Strarting the frontend of cloud drive

* first we will see how many pages we need then - how many components and so on.
* also we need t odo beardcrum navigation so we will see how we can handel it..

* first we will need auth page - or login or signup (create account)
* then we need a dashboard page.
* then we need a upload modal kind of thing.
* may be a preview kind of thing
* then a sharing modal.
* then a trash page and a profile page for edit delete etc.

---

* some how it will look like this

```text
src/
 ├─ pages/
 │   ├─ Auth/
 │   │   ├─ Login.jsx
 │   │   ├─ Signup.jsx
 │   │   └─ ForgotPassword.jsx
 │   ├─ Dashboard.jsx
 │   ├─ Shared.jsx
 │   ├─ Trash.jsx
 │   ├─ Profile.jsx
 │   └─ FileView.jsx  (for viewing/opening a file)
 │
 ├─ components/
 │   ├─ Navbar.jsx
 │   ├─ Sidebar.jsx
 │   ├─ Breadcrumbs.jsx
 │   ├─ FileCard.jsx
 │   ├─ UploadModal.jsx
 │   └─ ShareModal.jsx
 │
 ├─ utils/
 │   ├─ api.js   (axios instance with interceptors)
 │   └─ auth.js  (helper functions: getUser, logout, etc.)
 │
 ├─ App.jsx      (main router + layout wrapper)
 └─ index.jsx    (entry point)

```

* ## (1) Home page

  * see on the home page we will show a nav bar -- dar and light theme we will see --
  * then a profile section on the right corner- and then a hero section with some description and CTA button for login and signup etc.

  * ### (1) Navbar

  * the navbar we will do something like this --

    ```text
    ------------------------------------------------------------
    | [Logo + Brand]   [Links: Home | Features | Pricing]   [ThemeToggle | Auth/Profile] |
    ------------------------------------------------------------

    ```

  * for icons we are using lucide react.
  * `<Outlet />` is like a placeholder that tells React Router “render the child route’s component here.”
  * we created layout componet for only a centered layout. and where using outlet we render component/pages dynamically based on where we are -- if we are on home page then render homepage and etc.

---

* ### Routes in React

  * now if we want to use routes in react then we need to install react-router-dom library.

    ```bash
    npm install react-router-dom

    ```

  * Then we need to wrap our entire app in `<BrowserRouter>` (usually in main.jsx or index.jsx). now it makes routing work everywhere inside our app.
  * then we can define routes in our app.jsx using `<Routes> <Routes/>` and `<Route>`

---

* now in home page we will add a hero component that will be the main page of our website.
