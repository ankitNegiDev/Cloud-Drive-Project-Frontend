// auth service -- that will have re-usable function for signup , login , logout, and getting the details of current user.

// (1) signup user
// here userData will be sent by the caller and it will generaly contain name , email , pass , avatar url etc.

import api from '../utils/axiosInstance.jsx';
async function signup (userData){
    try{
        // calling the api for signup
        const response=await api.post('/auth/signup',userData);
        
        // now returning the repsosne back from where it is called (context/component)
        return response.data;
    }catch(error){
        console.log("error occured in singup api calling -- check auth service");
        
        // now throwing error back from where it is called (context/component)
        throw error;
    }
}


