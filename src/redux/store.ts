import { configureStore } from "@reduxjs/toolkit";
import filmReducer from "../pages/films/filmsSlide";

export const store = configureStore({
    reducer: {
        film: filmReducer
    },
    middleware: (getDefaultMiddle) => getDefaultMiddle({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;