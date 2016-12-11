# Build
Generate production!

## `npm run build -- --os=<?> --pro=<?> --dir=<?>`

### `os=<?>`
Available `os` chrome, ios, android, default and web

```javascript
"individual": {
  // custom os configuration
  "osName": {
    "dist": {
      "type": "typeName",
      "file": {
        "css": {
          "(osName)": true
        },
        "js": {
          "(osName)": true
        },
        "root": {
          "(osName)": true
        }
      }
    }
  }
  // ...
}
```
### `pro=<?>`

### `dir=<?>`

### `source=<?>`

## Usage
```javascript
npm run build -- --os=
npm run build -- --os=ios --pro=lst
npm run build -- --os=ios --pro=eba
npm run build -- --os=ios --dir=../scriptive.appName --pro=eba
npm run build --  --os=web --dir=docs
npm run web -- --pro=firebase --dir=../scriptive.firebase/firebase

npm run build -- --os=web  --pro=test --dir=../scriptive.test/firebase
npm run build -- --os=web  --pro=test --dir=firebase
npm run build -- --os=web  --pro=test --dir=../delete-firebase
npm run build -- --os=web  --pro=test --source=true
npm run build -- --os=firebase  --pro=test
npm run build -- --os=web  --pro=test
npm run build -- --os=web
```

## Todo


