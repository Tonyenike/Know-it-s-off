import Axios from 'axios';
const axiosBaseURL = Axios.create({
    //Changed baseurl from 5000 to 3000
    //Hess says that there are issues with the cookies
    //as the urls are not lined up correcty.
    baseURL:'http://localhost:3000/api',
});
export default axiosBaseURL