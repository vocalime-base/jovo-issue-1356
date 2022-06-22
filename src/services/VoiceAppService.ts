import {
    AnyObject,
    BaseComponent,
    ComponentConstructor,
    Jovo,
    PickWhere,
} from '@jovotech/framework';

export class VoiceAppService {
    public static isListenFalse(jovo: Jovo): boolean {
        return jovo.$output.some((outputTemplate) => outputTemplate.listen === false);
    }
}

// Checks if the user is authenticated and initialized, if mustBeInitialized=true
export function Authenticated<
    COMPONENT extends BaseComponent,
    // eslint-disable-next-line @typescript-eslint/ban-types
    HANDLER extends Exclude<keyof PickWhere<COMPONENT, Function>, keyof BaseComponent>,
>(constructor: ComponentConstructor<COMPONENT>, handler?: HANDLER): MethodDecorator {
    return function (
        target: AnyObject,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ) {
        const originalValue = descriptor.value;
        const fn = async function (this: Jovo, ...args: AnyObject[]) {
            if (!this.$user.accessToken) {
                return this.$redirect(constructor, handler);
            }

            return originalValue.apply(this, args);
        };
        descriptor.value = Object.defineProperty(fn, 'name', {
            value: originalValue.name,
            writable: false,
        });
    };
}
