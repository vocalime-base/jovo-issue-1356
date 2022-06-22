import { Duration, DurationObjectUnits } from 'luxon';

export const normalizeDuration = (duration: Duration): Duration => {
    const durationObject = duration
        .shiftTo('years', 'months', 'days', 'hours', 'minutes')
        .toObject();

    const resultObject = Object.keys(durationObject).reduce((result, key) => {
        const value = durationObject[key as keyof DurationObjectUnits];
        return value ? { ...result, [key]: value } : result;
    }, {});

    return Duration.fromObject(resultObject);
};

export * from 'luxon';
