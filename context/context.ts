import { createContext } from "react";

type User = {
    id: string;
    name: string;
    email: string;
}

const LOGIN = 'LOGIN';
const SINGOUT = 'SIGNOUT';

const login = () => {

}

const signout = () => {

}

export const authContextRedcuer = (action: string, payload: {[key: string]: any}) => {
    switch (action) {
        case LOGIN: 
            break;
        default:
            break;
    }
}

const user: Partial<User> = {}

export const AuthContext = createContext(user);