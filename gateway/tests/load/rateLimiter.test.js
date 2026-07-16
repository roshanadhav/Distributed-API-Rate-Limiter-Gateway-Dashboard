import axios from "axios";

const URL = "http://localhost:3000/users";

const TOTAL_REQUESTS = 100;

async function test() {
    const requests = [];

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        requests.push(
            axios.get(URL)
                .then((res) => ({
                    status: res.status
                }))
                .catch((err) => ({
                    status: err.response?.status
                }))
        );
    }

    const results = await Promise.all(requests);
    console.log(results)  ; 
    const summary = {};

    for (const r of results) {
        summary[r.status] = (summary[r.status] || 0) + 1;
    }

    console.log(summary);
}

test();