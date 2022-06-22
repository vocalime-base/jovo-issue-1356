import { app } from './app';
import { JovoDebugger } from '@jovotech/plugin-debugger';

app.configure({
    plugins: [new JovoDebugger()],
});

export * from './server.express';
