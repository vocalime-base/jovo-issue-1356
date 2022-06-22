import { app } from '../src/app';

test('checks if Jovo initialization succeeds', async () => {
    app.onError(() => {
        throw new Error('Jovo initialization fails');
    });

    await app.initialize();
});
