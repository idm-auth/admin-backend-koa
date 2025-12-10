# Sample API

## Create Sample
```bash
curl -X POST http://localhost:3000/samples \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

## List Samples
```bash
curl http://localhost:3000/samples
```
