import { app } from '../src/app';
import { TestSuite } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import AlexaLaunchRequest from './AlexaLaunchRequest.json';

const testSuite = new TestSuite({ app, platform: AlexaPlatform });

test('checks both directives are generated', async () => {
    // @ts-ignore
    const result = await testSuite.run(AlexaLaunchRequest);
    // I expect an APL render document and a Dialog directive, but I get only the second one
    expect(result.response.response.directives).toHaveLength(2);
});
