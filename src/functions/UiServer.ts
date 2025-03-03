import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob"
import { StatusCodes, ReasonPhrases, getReasonPhrase } from "http-status-codes";

export async function uiServer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const client = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
    const containerClient = client.getContainerClient("tc-func-ui");

    let fileName = "index.html"
    if (request.params.file) {
        fileName = request.params.file;
    }

    context.log(`looking for blob with filename ${fileName}`)

    let blobClient = undefined;
    let contentType = "";
    let blobData = undefined;
    try {
        blobClient = containerClient.getBlobClient(fileName);
        contentType = (await blobClient.getProperties()).contentType;
        blobData = (await blobClient.downloadToBuffer()).toString();
    } catch (error) {
        context.log(`exception: ${JSON.stringify(error)}`)

        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

        if (error.name && error.name === "RestError") {
            statusCode = error.statusCode;
        }

        return {
            status: statusCode,
            body: getReasonPhrase(statusCode)
        }
    }

    return {
        headers: {
            'Content-Type': contentType
        },
        body: blobData
    }
};

app.http('UiServer', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: uiServer,
    route: '{*file}',
});
