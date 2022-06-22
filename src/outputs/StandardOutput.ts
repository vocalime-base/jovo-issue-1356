import { BaseOutput, Card, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { removeSSML } from '@jovotech/output';
import omit from 'lodash/omit';

type ResponseDialog =
    | string
    | {
          message: string | ResponseContent;
          reprompt?: string | ResponseContent;
      };

interface ResponseContent {
    speech: string;
    text: string;
}

export interface Suggestion {
    text: string;
    intent: string;
}

interface StandardOutputOptions extends OutputOptions {
    dialog: ResponseDialog | ResponseDialog[];
    suggestions?: Suggestion[];
    skipApl?: boolean;
    skipReprompt?: boolean;
}

@Output()
export class StandardOutput extends BaseOutput<StandardOutputOptions> {
    build(): OutputTemplate {
        const response: OutputTemplate = omit(this.options, [
            'dialog',
            'suggestions',
            'skipApl',
            'skipReprompt',
        ]);

        const { dialog, suggestions, skipApl, skipReprompt, listen = true } = this.options;

        let responseDialog: ResponseDialog;
        if (Array.isArray(dialog)) {
            responseDialog = dialog[Math.floor(Math.random() * dialog.length)];
        } else {
            responseDialog = dialog;
        }

        if (typeof responseDialog === 'string') {
            const escapedDialog = this.escapeXmlCharacters(responseDialog);
            if (this.$alexa) {
                response.message = escapedDialog;

                if (!skipApl) {
                    response.card = this.buildCard(responseDialog);
                }
            } else {
                response.message = {
                    speech: escapedDialog,
                    text: !skipApl ? escapedDialog : '',
                };
            }

            if (listen && !skipReprompt) {
                response.reprompt = escapedDialog;
            }
        } else {
            if (this.$alexa) {
                if (typeof responseDialog.message === 'string') {
                    response.message = this.escapeXmlCharacters(responseDialog.message);
                    if (!skipApl) response.card = this.buildCard(responseDialog.message);
                } else {
                    response.message = this.escapeXmlCharacters(responseDialog.message.speech);
                    if (!skipApl)
                        response.card = this.buildCard(
                            this.escapeXmlCharacters(responseDialog.message.text),
                            true,
                        );
                }

                if (listen && !skipReprompt) {
                    if (responseDialog.reprompt) {
                        if (typeof responseDialog.reprompt === 'string') {
                            response.reprompt = this.escapeXmlCharacters(responseDialog.reprompt);
                        } else {
                            response.reprompt = this.escapeXmlCharacters(
                                responseDialog.reprompt.speech,
                            );
                        }
                    } else {
                        if (typeof responseDialog.message === 'string') {
                            response.reprompt = this.escapeXmlCharacters(responseDialog.message);
                        } else {
                            response.reprompt = this.escapeXmlCharacters(
                                responseDialog.message.speech,
                            );
                        }
                    }
                }
            } else {
                response.message =
                    typeof responseDialog.message === 'string'
                        ? {
                              speech: this.escapeXmlCharacters(responseDialog.message),
                              text: !skipApl
                                  ? this.escapeXmlCharacters(responseDialog.message)
                                  : '',
                          }
                        : {
                              speech: this.escapeXmlCharacters(responseDialog.message.speech),
                              text: !skipApl
                                  ? this.escapeXmlCharacters(responseDialog.message.text)
                                  : '',
                          };

                if (listen && !skipReprompt) {
                    if (responseDialog.reprompt) {
                        if (typeof responseDialog.reprompt === 'string') {
                            response.reprompt = {
                                speech: this.escapeXmlCharacters(responseDialog.reprompt),
                                text: !skipApl
                                    ? this.escapeXmlCharacters(responseDialog.reprompt)
                                    : '',
                            };
                        } else {
                            response.reprompt = {
                                speech: this.escapeXmlCharacters(responseDialog.reprompt.speech),
                                text: !skipApl
                                    ? this.escapeXmlCharacters(responseDialog.reprompt.text)
                                    : '',
                            };
                        }
                    } else {
                        if (typeof responseDialog.message === 'string') {
                            response.reprompt = {
                                speech: this.escapeXmlCharacters(responseDialog.message),
                                text: !skipApl
                                    ? this.escapeXmlCharacters(responseDialog.message)
                                    : '',
                            };
                        } else {
                            response.reprompt = {
                                speech: this.escapeXmlCharacters(responseDialog.message.speech),
                                text: !skipApl
                                    ? this.escapeXmlCharacters(responseDialog.message.text)
                                    : '',
                            };
                        }
                    }
                }
            }
        }

        if (suggestions) {
            response.quickReplies = suggestions;
        }

        return response;
    }

    private buildCard(content: string, isText = false): Card {
        const prevContent = this.$output.at(-1)?.card?.content;

        if (!isText) {
            content = removeSSML(content);
        }

        if (this.$alexa && !this.$alexa.$request.isAplSupported()) {
            content = content.replace(/<br>/g, '\n');
        }

        return {
            title: 'MotorMouth',
            content: prevContent
                ? prevContent.endsWith('\n') || prevContent.endsWith('<br>')
                    ? `${prevContent}${content}`
                    : `${prevContent} ${content}`
                : content,
        };
    }

    private escapeXmlCharacters(text: string) {
        const invalidXmlCharactersMapping: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;',
        };

        const invalidXmlCharactersMappingReverse = Object.keys(invalidXmlCharactersMapping).reduce(
            (obj: Record<string, string>, key: string) => {
                obj[invalidXmlCharactersMapping[key]] = key;

                return obj;
            },
            {},
        ) as Record<string, string>;

        // sanitize any already escaped character to ensure they are not escaped more than once
        const sanitizedInput = text.replace(
            /(&amp;)(?![^<]*>|[^<>]*<\/)/g,
            (c) => invalidXmlCharactersMappingReverse[c],
        );

        if (this.$alexa) {
            return sanitizedInput.replace(
                /([&])(?![^<]*>|[^<>]*<\/)/g,
                (c) => invalidXmlCharactersMapping[c],
            );
        } else {
            return sanitizedInput;
        }
    }
}
