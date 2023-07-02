import { configureStore } from "@reduxjs/toolkit";
import filmReducer from "../pages/films/filmsSlide";
import authReducer from "../redux/authSlice";
import statisticReducer from "../pages/statistic/statisticSlice";

export const store = configureStore({
    reducer: {
        film: filmReducer,
        authState: authReducer,
        statistic: statisticReducer,
    },
    middleware: (getDefaultMiddle) => getDefaultMiddle({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;