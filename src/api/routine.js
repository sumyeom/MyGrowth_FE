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


export function findByIdRoutine(id, date) {
    return authAxios.get(`/routines/${id}`, {
        params:{date}
    });
}

export function routineCheckin(routineId, date){
    return authAxios.post(`/routines/${routineId}/checkin`, null,{
        params:{date}
    })
}

export function deleteRoutine(id){
    return authAxios.delete(`/routines/${id}`,null);
}

export function updateRoutine(id, deleteType, selectedDate, title, description, repeatType, daysOfWeek, dayOfMonth, dayOfYear, goalCount, isPublic, startDate, endDate){
    return authAxios.patch(`/routines/${id}`,{title, description, repeatType, daysOfWeek, dayOfMonth, dayOfYear, goalCount, isPublic, startDate, endDate},{
        params:{deleteType, selectedDate}
    });
}