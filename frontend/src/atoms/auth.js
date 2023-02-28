import { atom } from "jotai";

export const loggedInUser = atom(null);
export const loggedInUserToken = atom((get) => {
    return get(loggedInUser).token;
});
