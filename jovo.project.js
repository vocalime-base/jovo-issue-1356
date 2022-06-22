require('dotenv').config();
const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');
const { GoogleAssistantCli } = require('@jovotech/platform-googleassistant');

const project = new ProjectConfig({
    defaultStage: 'dev',
    stages: {
        dev: {
            endpoint: process.env.DEV_WEBHOOK_URL,
            plugins: [
                new AlexaCli({
                    skillId: process.env.DEV_SKILL_ID,
                    askProfile: 'default',
                    locales: {
                        en: ['en-US'],
                    },
                }),
                new GoogleAssistantCli({
                    projectId: process.env.DEV_PROJECT_ID,
                }),
            ],
        },
        prod: {
            endpoint: process.env.PROD_WEBHOOK_URL,
            plugins: [
                new AlexaCli({
                    skillId: process.env.PROD_SKILL_ID,
                    askProfile: 'default',
                    locales: {
                        en: ['en-US'],
                    },
                }),
                new GoogleAssistantCli({
                    projectId: process.env.PROD_PROJECT_ID,
                }),
            ],
        },
    },
});

module.exports = project;
