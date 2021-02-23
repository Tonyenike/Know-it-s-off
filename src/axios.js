import Axios from 'axios';
const axiosBaseURL = Axios.create({
    // 3000 for react-scripts (yarn start-dev)
    // 5000 for /build (yarn start)
    baseURL:'https://281e5e921351.ngrok.io/api/',
    //baseURL:'http://localhost:5000/api',
});
export default axiosBaseURL
