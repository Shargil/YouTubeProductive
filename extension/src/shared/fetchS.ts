import { ServerURL } from "../constantsDemo";

export async function fetchS(method, route, params?, onError?) {
    try {
        const res = await fetch(ServerURL + route, {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: params ? JSON.stringify(params) : null
        })

        if (!res.ok) {
            console.error("fetchS() status code: ", res.status);
            throw new Error(res.status.toString());
        } else {
            return res.json();
        }

    } catch (err) {
        onError();
        console.error("fetchS() Error: ", err);
        throw new Error(err);
    }
}