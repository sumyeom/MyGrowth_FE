// eslint-disable-next-line no-unused-vars 
import { authAxios } from "./axios";

export function getProfile() {
    return authAxios.get("/users/profile"); 
}

export function updateProfile(name, nickname, selfIntroduction) {
    return authAxios.patch("/users/profile", {name,nickname,selfIntroduction});
}