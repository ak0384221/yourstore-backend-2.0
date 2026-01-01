import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = e();
// app.use(cors({origin:,credentials:true})) cors setup
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(e.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.ts";

//routes declaration
app.use("/api/v1/auth", userRouter);

export { app };
