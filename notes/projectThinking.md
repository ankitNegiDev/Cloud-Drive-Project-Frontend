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

* now so far a basic home page is done -- and now we can focus on functionality part...

---

## creating a axios instance

* now we will create axios instance because to centeralized the api calling and sending token we want to avoid send token every time and writing the base url every time.
* now Axios is a promise-based HTTP client for JavaScript (works in browser + Node.js). that lets us to make requests like GET, POST, PUT, DELETE to a backend API.
* a simple example --

    ```js
    import axios from "axios";

    // Simple GET request
    const response = await axios.get("http://localhost:3000/api/users");
    console.log(response.data);

    // Simple POST request
    const response2 = await axios.post("http://localhost:3000/api/login", {
    email: "test@example.com",
    password: "123456"
    });
    console.log(response2.data);

    ```

* now we will use interceptors so these are nothing but the middleware that axios provide us one is `Request Interceptors` and another is `Response Interceptors`
* now the request interceptor will run before the request is sent and it add like **Authorization token to headers , Log/debug requests and Modify request body and etc**

* example how we are attaching token if it exist in local storage

    ```js
    api.interceptors.request.use(function (config) {
        console.log("Outgoing Request:", config);

        // Example: Add token if available
        const user = JSON.parse(localStorage.getItem("authUser"));
        if (user?.token) {
            config.headers.Authorization = "Bearer " + user.token;
        }

        return config; // Must return config
    });

    ```

* `Response Interceptors` as the name suggest this middleware runs once the response is recived and we can do something like **Handling errors globally (401 → logout) , Transforming response data and Retrying failed requests and so on**

* handing a error that user is loged out or not

    ```js
    api.interceptors.response.use(
        function (response) {
            console.log("Response received:", response);
            return response; // Must return response
        },
        function (error) {
            if (error.response?.status === 401) {
                console.warn("Unauthorized → Redirect to login");
                localStorage.removeItem("authUser");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );

    ```

* now the flow is `Request Interceptor runs (attach token, modify config) ==> Request is sent to server ==> Server responds ==> Response Interceptor runs (check errors, transform data) ==> our code gets the final response.data`

* axios.interceptors.request.use(onFulfilled, onRejected) so we need to pass these two function here.

---

* now for showing toast we are using react-hot-toast

    ```bash
    npm install react-hot-toast
    ```

---

## setting up auth service

* now we need to create a service layer or a file where our re-usable function for login , singup , logout, getting current user etc will be written and these function will actually hit our backen api using the axios instance that we create like `api.post('/auth/sigup')` something like this. and offcos these function will return the request resposne which is then collected by there where these function are called so that we don't have to put api calling logic inside the component and by doing this we maintain the clean code and sepration of concern..
* but we need to add three routes in our backend auth router-- since we are not calling supabase directly from frontend i want the flow is like -- frotnend call my backend and my backnd call supabase.

---

## Auth context

* now we will setup the auth context with a provider so that we can have user info in a centeralized store and any component needed it -- they can access it directly..

---

## Setup for context

* first create a folder inside src -- as context and inside it -- create  a file authContext.jsx
* then wrap the app component with authprovider - since we are using the custom provider so we will wrap our app component with it -- but if we are not using any custom provider then we can use AuthContext.provider for wrapping our app component.
