// eslint-disable-next-line no-unused-vars 
import { authAxios } from "./axios";

export function createRoutine(title, description, repeatType, daysOfWeek, dayOfMonth, dayOfYear, goalCount, isPublic, startDate, endDate){
    return authAxios.post("/routines", {title, description, repeatType, daysOfWeek, dayOfMonth, dayOfYear, goalCount, isPublic, startDate, endDate});
}

export function findByDateRoutine(date) {
    return authAxios.get("/routines/by-date", {
        params: { date }  
    });
}

export function routineCheckin(routineId, date){
    return authAxios.post(`/routines/${routineId}/checkin`, null,{
        params:{date}
    })
}