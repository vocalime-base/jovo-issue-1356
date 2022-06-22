import { App } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { MainComponent } from './components/MainComponent';

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
        }),
    ],
});
