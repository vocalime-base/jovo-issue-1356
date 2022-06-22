import { App, Jovo } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { GoogleAssistantPlatform } from '@jovotech/platform-googleassistant';
import { StandardEventsPlugin } from '@vocalime/jovo-standard-events-plugin';
import { MainComponent } from './components/MainComponent';
import { logger } from './config/logger';
import * as languageResources from './resources/i18n/language-resources';

declare module '@jovotech/framework/dist/types/interfaces' {
    interface RequestData {}

    interface SessionData {}

    interface UserData {}
}

declare module '@jovotech/framework/dist/types/I18Next' {
    interface I18NextResources {
        en: typeof languageResources.en;
    }
}

/**
 * Jovo App initialization.
 */
export const app = new App({
    components: [MainComponent],
    plugins: [
        new AlexaPlatform({
            output: {
                genericOutputToApl: true,
            },
            intentMap: {
                'AMAZON.YesIntent': 'YesIntent',
                'AMAZON.NoIntent': 'NoIntent',
                'AMAZON.RepeatIntent': 'RepeatIntent',
                'AMAZON.HelpIntent': 'HelpIntent',
                'AMAZON.FallbackIntent': 'UNHANDLED',
                'AMAZON.StopIntent': 'END',
                'AMAZON.CancelIntent': 'CancelIntent',
            },
        }),
        new GoogleAssistantPlatform({
            intentMap: {
                'actions.intent.NO_MATCH_1': 'UNHANDLED',
                'actions.intent.NO_MATCH_2': 'UNHANDLED',
                'actions.intent.NO_MATCH_FINAL': 'UNHANDLED',
                'actions.intent.CANCEL': 'CancelIntent',
                'StopIntent': 'END',
                'actions.intent.YES': 'YesIntent',
                'actions.intent.NO': 'NoIntent',
                'actions.intent.REPEAT': 'RepeatIntent',
            },
        }),
        new StandardEventsPlugin({
            newSessionHandlers: [],
            onRequestHandlers: [],
            onResponseHandlers: [],
        }),
    ],
    routing: {
        intentsToSkipUnhandled: ['END'],
    },
    i18n: {
        resources: languageResources,
        returnObjects: true,
    },
    logging: false,
});

// @ts-ignore Remove Jovo error handler because it has useless styles
app.errorListeners.splice(0, 1);

app.addErrorListener((error) => {
    logger.error(error);
});

app.hook('request.start', (jovo: Jovo) => {
    jovo.$data._BASIC_LOGGING_START = new Date().getTime();
});

app.hook('interpretation.end', (jovo: Jovo) => {
    return logger.info(
        jovo.$request,
        `Request - ${jovo.$input.getIntentName() ?? jovo.$input.type}`,
    );
});

app.hook('response.end', (jovo: Jovo) => {
    const basicLoggingEnd = new Date().getTime();
    const duration = jovo.$data._BASIC_LOGGING_START
        ? basicLoggingEnd - jovo.$data._BASIC_LOGGING_START
        : 0;

    return logger.info(jovo.$response, `Response - ${duration}ms`);
});
