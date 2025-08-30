// here we will create the authProvider -- and it is kind of container where we will write all those things that we want to share and those component which this provider wrap will have access to these function / state that are written inside the authProvider

import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import AuthContext from "./AuthContext";
import { supabase } from "../config/supabaseClient";


// AuthProvider acts as a container and shares state & functions with all children

export function AuthProvider({ children }){
    // creating a state to store current logged-in user
    const [user,setUser]=useState(null);

    // creating a loding state
    const [loading,setLoading]=useState(true);

    // now when the app load then auth provider will mount and on mounting we need to check is user exist in local sotrage -- if yes then we need to set it in user state -- so that user don't have to do login again..
    //! what if the toekn is expired then user will still be loged in -- but we don't want that -- so for this we had the axios intercptor which will loged out user if he do any api call with that expired token -- secondly we can add a token validation here in auth provider that even if user is in localstorage and token is expired we will show user have to loged in toekn is expired.
    //todo => third thing -- if we didn't check toekn expiray here then -- what will happen is when user is in local storage with expired token -- the user still remians loged in and when user hit any protected routes like upload or delte files then automactically the backend throw the error that invalid token and our axios response intercptor will get 401 and it will loged out user and --- user will be like what just happend ?? ... so better to check toekn expiry here when app load so that we can ask user to loged in even before doing any api call..

    /*
    useEffect(function callback(){
        async function initializeUser(){
            const storedUser = localStorage.getItem("user");

            if (storedUser) {

                // now once we got the user from the local storage now we need to parse it so that we can check token expiry
                const parsedUser = JSON.parse(storedUser);
                console.log("parsed user from local storage in auth provider is : ",parsedUser);

                // now validating the token
                try {
                    // now calling getCurrent user
                    const response = await authService.getCurrentUser();

                    // now this will tell if token is valid we will get user info else user will be loged out by axios response interceptor
                    setUser(response);
            } catch (error) {
                    // Token expired or invalid
                    console.log("Token invalid/expired, logging out.and error is : ",error);
                    setUser(null);
                    localStorage.removeItem("user");
                }
            }
            setLoading(false);
        }

        // calling initializeUser function 
        initializeUser();
    },[]);
    */
    

    // this use effect will run when the component load for the first time-
    useEffect(function () {
        // this function will check two thing -- is user loged in user google login or custom login
        async function initializeUser() {
            try {
                // in google login we will chheck if Supabase already has an active session
                const { data, error } = await supabase.auth.getSession();

                // if not active seession then we wil lget error
                if (error) {
                    console.log("Error getting Supabase session:", error.message);
                }

                // if user has session then get that user update the frontend that user is loged in. by setting user in state...
                if (data && data.session && data.session.user) {
                    setUser(data.session.user);
                } else {
                    // If no Supabase session then check localStorage for a stored user may be user did loged in using custom.
                    const storedUser = localStorage.getItem("user");

                    if (storedUser) {
                        try {
                            // just for extra security validating the token with backend..
                            const response = await authService.getCurrentUser();
                            setUser(response);
                        } catch (error) {
                            // if token is invalid/expired then we need to clear user from local storage and ask for re-loging
                            console.log("Local storage user invalid:", error.message);
                            setUser(null);
                            localStorage.removeItem("user");
                        }
                    }
                }
            } catch (error) {
                console.log("Error in initializeUser:", error.message);
            } finally {
                // marking loading as false once initialization finishes
                setLoading(false);
            }
        }

        // calling the function.
        initializeUser();

        // Listening for Supabase auth state changes lik login/logout from another tab
        const { data: listener } = supabase.auth.onAuthStateChange(function (_event, session) {
            if (session && session.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        // Cleanup subscription when component unmounts --
        /**
         * n AuthProvider, you usually want the listener to exist as long as the provider itself is mounted (which is usually the whole app lifetime).
         * But React still requires you to clean it up properly, in case the provider is ever unmounted/remounted (like in tests, or during hot reload, or if you restructure your app).
         */
        return function cleanup() {
            listener.subscription.unsubscribe();
        };
    }, []);

    // now creating all functions that we want to share with those component which is wrapped by this provider.

    // (1)  signup user

    async function signup(userData){
        try{
            // calling our auth service for signup -- see in signup no token is generated so there is no need to save user info right now -- we will save user info in local storage and state once the user is loged in.
            const response=await authService.signup(userData);
            console.log("response in auth provider after user signup is : ",response);

            return response;
        }catch(error){
            console.log("error occured in signup auth provider and error is : ",error);
            
            // throwing error back
            throw error;
        }
    }


    //(2) login user

    async function login(credentials){
        try{
            // calling our auth service login function
            const response=await authService.login(credentials);
            console.log("repsonse after login in auth provider is : ",response);

            // setting the user info in state
            setUser(response);

            // setting user info in local storage..
            localStorage.setItem("user",JSON.stringify(response));
            console.log("getting the item user from local storage : ",localStorage.getItem("user"));

            return response;
        }catch(error){
            console.log("error in authservice login function and error is : ",error);

            // throwing error back
            throw error;
        }
    }

    // (3) logout --
    async function logout(){
        try{
            // calling our auth service 
            await authService.logout();

            // setting null in state - once user is loged out.
            setUser(null);

            // removing the user info from the localstorage..
            localStorage.removeItem("user");
            // removing the user infor from localstorage -- if user was loged in using google
            localStorage.removeItem("sb-jwguvwltdasfoyecnlro-auth-token");
        }catch(error){
            console.log("error occured in logout auth provider and error is : ",error);

            // throwing error back
            throw error;
        }
    }

    // (4) google login -- auth service -- this was for acc to backend route but we are using supabse in frotnent to call google oath direclty
    /*
    async function googleLogin() {
        try {
            const response = await authService.googleLogin();
            return response;

        } catch (error) {
            console.log("eror in googlelogin in auth provider and erorr is : ",error);
            throw error;
        }
    }
    */

    // (4) Google login using Supabase OAuth
    async function googleLogin() {
        try {
            // calling supabase from frontend -- for google loged in
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth-callback`
                }
            });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.log("Error in google login:", error.message);
            throw error;
        }
    }
    

    // Get current user - optional function
    async function getCurrentUser() {
        try {
            const response = await authService.getCurrentUser();
            setUser(response);
            return response;
        } catch (error) {
            setUser(null);
            localStorage.removeItem("user");
            throw error;
        }
    }

    // Values provided by context means -- to which component this auth provider wrappes -- all those component can access these function using useContext.
    const contextValue = {
        user,
        loading,
        signup,
        login,
        logout,
        googleLogin,
        getCurrentUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
