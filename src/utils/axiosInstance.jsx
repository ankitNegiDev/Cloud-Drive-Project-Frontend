// axios instance

import axios from "axios";
import toast from "react-hot-toast";

// creating a axios instance

const api=axios.create({
    baseURL:'http://localhost:3000/api',
    // in hedars we sent what type of data will be sent by this request.
    headers: { "Content-Type": "application/json" } 
});

// request interceptor...
//todo => imp ---- axios.interceptors.request.use(onFulfilled, onRejected)  --- The axios.interceptors.request.use() takes two arguments -- onFulfilled and onRejected

/**
onFulfilled → runs when the request config is successfully created (your async function with try/catch).

onRejected → runs if there’s an error before the request is sent — for example:
    Network or axios config error
    Request cancellation
    Something that breaks before your onFulfilled runs
 */

api.interceptors.request.use(
    //(1) onfulfilled -- when config object is created.

    // here config is configurable object that is created by axios
    async function (config){
        // getting user from local storage. -- it reutrn the data in string format only when exist else return the null
        const storedUser=localStorage.getItem("user");
        let user=null;

        // now storing the stored user info in user only if exist else we will set null in user..
        try{
            // now parsing the stored user data.
            /*
            if(storedUser){
                user=JSON.parse(storedUser);
            }else{
                user=null;  
            }
            */
            user= storedUser ? JSON.parse(storedUser) : null;
        }catch(error){
            console.log("Error in parsing user from local storage and error is : ",error);
            throw error;
        }

        // if user exist and have token then we need to add it in request headers
        if(user && user.token){
            config.headers.Authorization = "Bearer " + user.token;
        }

        return config;
    },

    // (2) onRejected -- when some error comes before even the request is sent.
    async function (error) {
        // If something went wrong before request is sent
        return Promise.reject(error);
        // or we can direct write throw error -- it is same as throwing Promise.reject(error)..
    }
);

// now same for response interceptor..

api.interceptors.response.use(
    // onFulfilled
    async function (response) {
        // Just returing the response -- no modification in resposne.
        return response;
    },

    // onRejected

    async function (error) {
        // Checking if the error has a response from server
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                // Token expired or unauthorized
                toast.error("Session expired. Please log in again.");
                
                // removing the user from the localstorage -- if token is expired
                localStorage.removeItem("user");

                // redirecting user to login page once the token is expired..
                window.location.href = "/login";

            } else if (status >= 400 && status < 500) {
                // all client errors
                toast.error(error.response.data?.message || "Something went wrong!");
            } else if (status >= 500) {

                // all server errors.
                toast.error("Server error! Please try again later.");
            }
        } else {
            // Network error or request never reached server
            toast.error("Network error! Please check your connection.");
        }

        // now throwing error to component that request is never reached to server.
        return Promise.reject(error); 
    }
)
