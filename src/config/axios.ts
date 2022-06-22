import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from './logger';

interface AxiosRequestConfigWithMetadata extends AxiosRequestConfig {
    metadata: {
        startTime: number;
    };
}

export const requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    (config as AxiosRequestConfigWithMetadata).metadata = { startTime: new Date().getTime() };

    logger.info(config, `${config.method} ${config.url}`);

    return config;
};

export const responseInterceptor = (response?: AxiosResponse): AxiosResponse | void => {
    if (response) {
        const duration =
            new Date().getTime() -
            (response.config as AxiosRequestConfigWithMetadata).metadata.startTime;

        logger.info(
            {
                ...response,
                duration,
            },
            `${response.config.method} ${response.config.url} took ${duration}ms`,
        );

        return response;
    }
};

export const errorInterceptor = (error: AxiosError): never => {
    logger.error(
        error.response ?? error,
        `${error.config.method} ${error.config.url} - ${error.message}`,
    );

    throw error;
};
