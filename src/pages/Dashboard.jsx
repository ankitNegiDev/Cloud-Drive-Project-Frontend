import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Dashboard() {
    const {user}=useContext(AuthContext);
    console.log("user form context on dashbord page is : ",user);

    console.log("getting stored user from local storage : ",localStorage.getItem("user"));
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl font-bold text-teal-400">
                Welcome to your Dashboard!
            </h1>
        </div>
    );
}

export default Dashboard;
