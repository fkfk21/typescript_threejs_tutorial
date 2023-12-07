# TypeScript + three.js + express サンプル

```
npm install
npm run start
```
access localhost:5050

### POST json data
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"width": 100, "height": 100, "depth": 100}' \
     http://localhost:5050/box
```