import { atom, getDefaultStore } from "jotai";
import axios from "../axios";

export const loggedInUser = atom(null);
export const loggedInUserToken = atom((get) => {
  return get(loggedInUser)?.token;
});

async function recoverUser() {
  console.log("trying to recover user state...");
  const userToken = localStorage.getItem("user-token");
  if (userToken) {
    const store = getDefaultStore();

    try {
      const result = await axios.get("/user/info", {
        headers: {
          Authorization: `BEARER ${userToken}`
        }
      });

      console.log("received user data: ", result.data);

      store.set(loggedInUser, {
        ...result.data,
        token: userToken,
      });
    } catch (err) {
      // NOP?
      console.log("error in recover user", err);
      localStorage.removeItem("user-token");
    }
  } else {
    console.log("no user token found");
  }
}

await recoverUser();

export async function saveUser() {
  const store = getDefaultStore();
  const userToken = store.get(loggedInUserToken);
  if (userToken) {
    localStorage.setItem("user-token", userToken);
  }
}

export async function logOut() {
  const store = getDefaultStore();
  store.set(loggedInUser, null);
  localStorage.removeItem("user-token");
}
