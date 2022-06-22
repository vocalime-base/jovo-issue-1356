import pino from 'pino';

export const logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    formatters: {
        level(label: string) {
            return { severity: label.toUpperCase() };
        },
    },
    base: undefined,
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    nestedKey: 'payload',
});
