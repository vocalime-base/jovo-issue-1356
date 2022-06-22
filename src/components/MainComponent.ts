import { BaseComponent, Component, Global } from '@jovotech/framework';
import { StandardOutput } from '../outputs/StandardOutput';

@Global()
@Component()
export class MainComponent extends BaseComponent {
    async START(): Promise<void> {
        return;
    }

    async LAUNCH(): Promise<void> {
        return this.$send(StandardOutput, {
            dialog: this.$t('launch_intent.welcome'),
        });
    }
}
