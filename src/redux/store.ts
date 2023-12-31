import { configureStore } from "@reduxjs/toolkit";
import filmReducer from "../pages/films/filmsSlide";
import authReducer from "../redux/authSlice";
import statisticReducer from "../pages/statistic/statisticSlice";
import scheduleReducer from "../pages/schedule/schedulesSlide";
import ticketReducer from "../pages/ticket/ticketSlice";
import userReducer from "../pages/user/usersSlide";
import theaterReducer from "../pages/theater/theaterSlide";

export const store = configureStore({
    reducer: {
        film: filmReducer,
        authState: authReducer,
        statistic: statisticReducer,
        schedule: scheduleReducer,
        ticket: ticketReducer,
        user: userReducer,
        theater: theaterReducer,
    },
    middleware: (getDefaultMiddle) => getDefaultMiddle({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;