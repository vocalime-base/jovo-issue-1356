import { BaseComponent, Component, Global } from '@jovotech/framework';

@Global()
@Component()
export class MainComponent extends BaseComponent {
    async START(): Promise<void> {
        return;
    }

    async LAUNCH(): Promise<void> {
        return this.$send({
            message: 'Welcome',
            reprompt: 'Welcome again',
            card: {
                title: 'Test skill',
                content: 'Welcome screen',
            },
            platforms: {
                alexa: {
                    nativeResponse: {
                        response: {
                            directives: [
                                {
                                    type: 'Dialog.ElicitSlot',
                                    slotToElicit: 'business',
                                    updatedIntent: {
                                        name: 'SetDestinationIntent',
                                        confirmationStatus: 'NONE',
                                        slots: {
                                            business: {
                                                name: 'business',
                                                confirmationStatus: 'NONE',
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        });
    }
}
