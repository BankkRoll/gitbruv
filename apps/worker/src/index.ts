import { Hono } from "hono";
import { type AppEnv } from "./types";
import { registerHealthRoutes } from "./routes/health";
import { registerGitRoutes } from "./routes/git";
import { registerFileRoutes } from "./routes/file";
import { registerAvatarRoutes } from "./routes/avatar";
import { registerR2Routes } from "./routes/r2";
import { registerRepositoryRoutes } from "./routes/repositories";
import { registerSettingsRoutes } from "./routes/settings";

const app = new Hono<AppEnv>();

registerHealthRoutes(app);
registerAvatarRoutes(app);
registerR2Routes(app);
registerRepositoryRoutes(app);
registerSettingsRoutes(app);
registerGitRoutes(app);
registerFileRoutes(app);

app.notFound((c) => c.text("Not found", 404));

export default app;
