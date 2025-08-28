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

* **now when the app load then auth provider will mount and on mounting we need to check is user exist in local sotrage -- if yes then we need to set it in user state -- so that user don't have to do login again..**

* *what if the toekn is expired then user will still be loged in -- but we don't want that -- so for this we had the axios intercptor which will loged out user if he do any api call with that expired token -- secondly we can add a token validation here in auth provider that even if user is in localstorage and token is expired we will show user have to loged in toekn is expired.*

* ***third thing -- if we didn't check toekn expiray here then -- what will happen is when user is in local storage with expired token -- the user still remians loged in and when user hit any protected routes like upload or delte files then automactically the backend throw the error that invalid token and our axios response intercptor will get 401 and it will loged out user and --- user will be like what just happend ?? ... so better to check toekn expiry here when app load so that we can ask user to loged in even before doing any api call..***

* now i guess we need to create multiple provider so we are going to create **Provider composer**

---

* the resonse we got after user signup successfully

```json
{success: true, message: 'User signedUp successfully', response: {…}}
message
: 
"User signedUp successfully"
response
: 
profile
: 
{avatarUrl: 'avatars/1756211403512_Sonal Gharti.jpg'}
user
: 
app_metadata
: 
{provider: 'email', providers: Array(1)}
aud
: 
"authenticated"
confirmation_sent_at
: 
"2025-08-26T13:31:52.611496301Z"
created_at
: 
"2025-08-26T13:31:52.542169Z"
email
: 
"bingolive9104@gmail.com"
id
: 
"433528a5-9bcd-485b-8417-90ea038bc989"
identities
: 
[{…}]
is_anonymous
: 
false
phone
: 
""
role
: 
"authenticated"
updated_at
: 
"2025-08-26T13:31:55.330126Z"
user_metadata
: 
{email: 'bingolive9104@gmail.com', email_verified: false, phone_verified: false, sub: '433528a5-9bcd-485b-8417-90ea038bc989'}
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object
success
: 
true
[[Prototype]]
: 
Object
```

* in post man

```json
{
    "success": true,
    "message": "User signedUp successfully",
    "response": {
        "user": {
            "id": "997e4cb6-1ba9-4b68-a35f-ef5c901b7d8a",
            "aud": "authenticated",
            "role": "authenticated",
            "email": "ankitnegi9104@gmail.com",
            "phone": "",
            "confirmation_sent_at": "2025-08-26T13:31:00.503920264Z",
            "app_metadata": {
                "provider": "email",
                "providers": [
                    "email"
                ]
            },
            "user_metadata": {
                "email": "ankitnegi9104@gmail.com",
                "email_verified": false,
                "phone_verified": false,
                "sub": "997e4cb6-1ba9-4b68-a35f-ef5c901b7d8a"
            },
            "identities": [
                {
                    "identity_id": "6a1c3a8b-0320-42e4-a01f-d514f4e88ca0",
                    "id": "997e4cb6-1ba9-4b68-a35f-ef5c901b7d8a",
                    "user_id": "997e4cb6-1ba9-4b68-a35f-ef5c901b7d8a",
                    "identity_data": {
                        "email": "ankitnegi9104@gmail.com",
                        "email_verified": false,
                        "phone_verified": false,
                        "sub": "997e4cb6-1ba9-4b68-a35f-ef5c901b7d8a"
                    },
                    "provider": "email",
                    "last_sign_in_at": "2025-08-26T13:31:00.476131135Z",
                    "created_at": "2025-08-26T13:31:00.476197Z",
                    "updated_at": "2025-08-26T13:31:00.476197Z",
                    "email": "ankitnegi9104@gmail.com"
                }
            ],
            "created_at": "2025-08-26T13:31:00.439599Z",
            "updated_at": "2025-08-26T13:31:02.957576Z",
            "is_anonymous": false
        },
        "profile": {
            "fullName": "bingopari",
            "avatarUrl": "https://res.cloudinary.com/dyg3mh5wg/image/upload/v1755585491/main-sample.png"
        }
    }
}
```

* ## Email verification flow

* see when user signup successfully we redirect user to plse verifiy email page -- then supabase send a mail where -- /email-verifed route -- this route need to be created in frontned -- and when user open it -- we will re-direct user on /email-verifed to -- /login only when email is verified if not we will re-direct user to verify email page -- keep in mind for this we need the supabase client in frontend also -- we can do it in backend -- by creating a simple route for email-verification and we call this api
* we just need to figure out -- how i can change the template and set the confirmation email open on the **email-verified route** we just need to fix this means when user open the email confirmation mail and open the link this link should land on this route and our setup is done. for eamil verification and we can focus on login page.

* what i am thinking is -- since when user signup -- successfully -- we will re-direct user to verify-email route and here  we will request user to open the mail and click on verification link -- right
then --- once the user click on the verification link sent by supabase on successful signup we can set this link point to user on /email-verified route --- and when user reach this page -- after 2-5 sec a count down kind of thing to re-direct user to /login page-

---

* `Email verification flow` - **first on successfuly signup we will re-direct user to verify-email page and here we will show some message like plse verify ur email etc and then user open their mail and click the confiramation link that is sent by supabase and that link will be re-direct to /email-verified page and here we will show a message that email is verifed and after 1-2sec we re-direct user to /login page**
* now there might be a question how email-verifed page know that email is verified so for this we don't have to bother since when user click on the link that is sent by suapbase -- the supabas will automatically mark the email as verified and we can use it to conform that email is verified -- second if we want to see is actually the email is verifed or not then we can setup the suapbase in frontend and get the user by this `const { data: { user } } = await supabase.auth.getUser();` and check here is email is verified or not but since we know that supabse will mark email as verified once the user click the link then only we are re-directing user to login page so we can skip this
* So yes we don't need to “manually” verify again unless we want an extra safety check. Supabase handles the verification when the user clicks the link.
* **imp thing is where the user will be re-directed that will be defined by redirectTo in backend signup service**

```js
export async function signupService(email,password,fullName,avatarUrl){
    try{

        console.log("email : ",email);
        console.log("password : ",password);
        console.log("fullname : ",fullName);
        console.log("avatar url : ",avatarUrl);

        // console.log("supabase is : ",supabase);

        // calling supabase internal function for signup.
        // const {data:authData,error:authError}=await supabase.auth.signUp({email,password}); 

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // no need of this -- we had profiles table.
                // data: {
                //     full_name: fullName,
                //     avatar_url: avatarUrl,
                // },
                emailRedirectTo: "http://localhost:5173/email-verified", // added this route so that 
            },
        });

        console.log("auth data in signup is : ",authData);
        console.log("auth erorr is : ",authError);

        // in case if error occur
        if(authError){
            const err=new Error("sorry there is some issue with supabase.auth.singUp");
            err.status=404;
            err.message=authError.message;
            throw err;
        }

        const user=authData.user;
        console.log("user in signup service is : ",user);

        // inserting row into profile table.
        const {error:profileError}=await supabase.from("profiles").insert({
            id:user.id,
            full_name:fullName || null, // fallback
            avatar_url:avatarUrl || null
        });

        // if any error occur in while creating the row in profile table.
        if(profileError){
            console.log("profile error : ");
            const err=new Error("failed to create profile in signup service");
            err.message=profileError.message;
            err.status=400;
            throw err;
        }

        // if user is created in supabase and a row in profile table also created successfully then return data.
        /** we can add here if we need more data later like subsribed user or not etc.. */
        return {
            user,
            profile:{
                fullName,
                avatarUrl
            }
        }
    }catch(error){
        console.log("erorr occured in the singup service layer and error is : ",error);
        // throwing error back to controller.
        throw error; 
    }
}

```

---

* now to get the profile -- after the user is loged in -- we can't get a public link from supabase if our stroage is private- so we need to generate the signed url with expirary.

* now -- the login and singup is done --- but i had a question -- may be this is advance one -- but see suppose user do signup with laptop and then a conformation email comes on his phone -- then he click it -- and open the login page in his phone  and he move to dashbord page -- now my question when user will referesh the website on the laptop -from home page will he also be loged in on laptop also

---

* now for google login -- we can go with backend route -- but instead of it we can directly call `supabase.auth.signInWithOAuth()` that automatically redirects the user to Google's OAuth page in the browser.
* so for this we need to setup the supabase client in frontend.
* the setup will be same -- we need to install .env and put supbase url , anon key in the .env and then setup the supabase client and then use it-

---

## Setting up supabase in frontend

* first we need to install supabase

    ```bash
    npm i @supabase/supabase-js
    ```

* then we need to add the supabase url and anon key or public key in .env

    ```env
    VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
    VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY

    ```

* then we need to create a client

