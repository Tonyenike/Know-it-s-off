import Axios from 'axios';
const axiosBaseURL = Axios.create({
    // 3000 for react-scripts (yarn start-dev)
    // 5000 for /build (yarn start)
    // baseURL:'https://5ad442710518.ngrok.io/api/',
    // http://flip3.engr.oregonstate.edu:12324/api/
    baseURL:'http://flip3.engr.oregonstate.edu:12324/api/',
});
export default axiosBaseURL
