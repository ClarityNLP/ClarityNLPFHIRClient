## ClarityNLPFHIRClient

### To run standalone
1. Copy `.env.example` to `.env`, and edit with your properties.
2. Making sure `npm` is installed, run
```javascript
npm install
```
and 
```javascript
npm start
```
3. The application runs by default [here](http://localhost:7200).

### Running Docker standalone
1. Build image
```
docker build -t claritynlp-fhir-client-app .
```
2. Run the image
```
docker run -it -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules -p 7200:7200 --rm claritynlp-fhir-client-app
```
3. The application runs by default [here](http://localhost:7200).
