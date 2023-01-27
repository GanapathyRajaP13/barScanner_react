
import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://CHEMSMESTEST01:5500'
    //baseURL: 'http://CHEWS10NB0008:5500'
});

instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';


export default instance;