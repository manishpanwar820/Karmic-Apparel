import axios from "axios";

const instance = axios.create({
    baseURL: 'https://us-central1-karmic-597af.cloudfunctions.net/api' //THe api (clound function) URL
});

export default instance;
