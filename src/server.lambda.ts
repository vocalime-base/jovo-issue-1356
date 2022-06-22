import { APIGatewayEvent, Callback, Context, Lambda } from '@jovotech/server-lambda';
import { app } from './app';

export const handler = async (
    event: APIGatewayEvent,
    context: Context,
    callback: Callback,
): Promise<void> => {
    await app.initialize();
    await app.handle(new Lambda(event, context, callback));
};
