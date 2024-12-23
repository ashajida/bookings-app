"use server";
import { createBlockedDate } from "../repository/blocked-days/blocked-date";
import { validateRequest } from "../validateRequest";

export const blockDateAction = async (date: Date) => {
    try {
        const { user } = await validateRequest();
        if(!user) return;

        if(!date) return;
        
        createBlockedDate({
        date,
        userId: user.id
        });
    } catch(error) {
        console.log(error);
    }
  }