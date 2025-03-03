1. Go into portal, create Azure Function App, make sure you pick Windows hosting platform
2. func init <function-app-name> --worker-runtime typescript --model V4
3. func new --template "Http Trigger" --name UiServer
4. func new --template "Http Trigger" --name ApiServer
5. az storage blob upload-batch -s ./dist -d '<ui-storage-container>' --account-name <storage-account-name>
6. func azure functionapp publish <function-app-name>
