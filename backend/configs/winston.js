
import { Loggly } from 'winston-loggly-bulk'

const loggingLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
}

const logglyTransport = new Loggly({
    token: process.env.WINSTON_LOGGLY_ACCESS_TOKEN,
    subdomain: process.env.WINSTON_LOGGLY_SUBDOMAIN,
    tags: ["Winston-NodeJS"],
    json: true
})

const loggingLabels = {
    Input_Validation_Error: 'Input Validation Error',
    Async_Error: 'Async Error',
    Base_Error: 'Base Error',
    HTTP: 'HTTP Request',
}

export {
    loggingLevels,
    logglyTransport,
    loggingLabels,
}