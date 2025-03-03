import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function apiServer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    if (request.params.endpoint === 'hello') {
        return {
            body: "Hello World!"
        }
    }

    const url = new URL(request.url);
    return {
        body: url.pathname
    }
};

app.http('ApiServer', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: apiServer,
    route: 'api/{endpoint}',
});
