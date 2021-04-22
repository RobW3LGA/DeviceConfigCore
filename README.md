# Device Config Core Library

## Programmatic network access (TypeScript)

### This is a core module that provides programmatic communications to networked gear via SSH and eventually will include REST capability


### Layers are represented by named directories and are logically arranged in the following order:
  - Components: Logical groupings of user interface elements. For example, in a NestJS project, all components (*.service, *.controller, *.module) go into this folder
  - Actions: Executes functions requested from the user interface, calls functions in the Utilities layer and updates the interface
  - Utilities: Functions that can be accessed system-wide
  - Settings: System-wide values
  - Models: Type data


## Usage
  - Note: This library has been designed to be functionally independent from any specific framework

  - Example One: An IOS config (text) file reader to build up and test additional functionality and without an actual hardware device present:
```TypeScript
import { DeviceResponse, IosDevice, IosError } from "./models";
import { fileReader, textReader } from "./utilities";
import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject } from "./actions";

const entryPointTextReader = async (filePath: string = "./dist/tests/mocks/test.asymmetric.config.mock"): Promise<void> => {

  const commands: Array<string> = [];
  const debug: boolean = false;

  const deviceResponse: DeviceResponse<IosDevice | IosError> = await invokeDeviceRequest(textReader(fileReader, filePath), parseIosDeviceResponse, parseIosDeviceReject, commands, debug);
  console.log(JSON.stringify(deviceResponse));
}

entryPointTextReader(process.argv[2]);
```

  - Example Two: In 'show' mode, both the running-config and startup-config are pulled back and compared for differences:
```TypeScript
import { DeviceResponse, IosDevice, IosError, SshConfig } from "./models";
import { SSH2Shell, sshReader } from "./utilities";
import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject, buildIosShowSshRequest } from "./actions";

const entryPointIos = async (): Promise<void> => {

  const host: string = "172.16.240.1";
  const username = "admin";
  const password = "P@ssw0rd";
  const commands: Array<string> = [];
  const debug: boolean = false;

  const sshConfig: SshConfig = buildIosShowSshRequest(host, username, password, commands, debug);

  const deviceResponse: DeviceResponse<IosDevice | IosError> = await invokeDeviceRequest(sshReader(SSH2Shell, sshConfig), parseIosDeviceResponse, parseIosDeviceReject, sshConfig.commands, sshConfig.debug);
  console.log(JSON.stringify(deviceResponse));
}

entryPointIos();
```

  - Example Three: In 'write' mode, standard, valid configurations can be applied and are then written to the startup-config:
```TypeScript
import { DeviceResponse, IosDevice, IosError, SshConfig } from "./models";
import { SSH2Shell, sshReader } from "./utilities";
import { invokeDeviceRequest, parseIosDeviceResponse, parseIosDeviceReject, buildIosWriteSshRequest } from "./actions";

const entryPointIos = async (): Promise<void> => {

  const host: string = "172.16.240.1";
  const username = "admin";
  const password = "P@ssw0rd";
  const commands: Array<string> = ["ip route 192.168.253.0 255.255.255.0 192.168.254.1 name TEMP_ROUTE_ONLY"];
  const debug: boolean = false;

  const sshConfig: SshConfig = buildIosWriteSshRequest(host, username, password, commands, debug);

  const deviceResponse: DeviceResponse<IosDevice | IosError> = await invokeDeviceRequest(sshReader(SSH2Shell, sshConfig), parseIosDeviceResponse, parseIosDeviceReject, sshConfig.commands, sshConfig.debug);
  console.log(JSON.stringify(deviceResponse));
}

entryPointIos();
```


## SSH2Shell modifications

### SSH2Shell (specifically the underlying SSH2 dependency) does not properly handle Cisco SSH communications. As a result, you will need to modify SSH2Shell to conditionally ignore two related errors and provide the boolean attribute 'ignoreSsh2SocketError' in the host section of the SSH config object

### Do not install SSH2Shell directly from NPM:
  - Navigate to the [SSH2Shell JavaScript file][ssh2shell] raw source on GitHub
  - Copy and paste the code into a file named 'ssh2shell.utility.cjs'
  - Insert on line 885 with the following condition:
```JavaScript
if (_this.sshObj.ignoreSsh2SocketError && (err.code == "ECONNRESET" || err.code == "ECONNABORTED")) { return _this.connection.end() } // JHA MOD
```
  - The modified function should look like this:
```JavaScript
this.connection.on("error", (function (_this) {
  return function (err) {
    if (_this.sshObj.debug) {
      _this.emit('msg', _this.sshObj.server.host + ": Connection.error");
    }
    if (_this.sshObj.ignoreSsh2SocketError && (err.code == "ECONNRESET" || err.code == "ECONNABORTED")) { return _this.connection.end() } // JHA MOD
    return _this.emit("error", err, "Connection");
  };
})(this));
```


## Dependencies (via NPM, all latest versions):
  - ssh2 - Note: Any frameworks using this library will need this dependency installed
  - dev:
    - @types/jest
    - @types/node
    - jest
    - ts-jest
    - typescript


## package.json modifications for Jest with TS-Jest

### This configuration prescribes all unit tests into a dedicated 'tests' folder under the project root:
```JSON
{
  "Default package.json (also replace in a default NestJS project package.json)": "...",

  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": ".",
    "testMatch": [
      "**/tests/**/*.test.(t|j)s"
    ],
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "./src/**/*.(t|j)s"
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/dist/"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": [ "text", "html" ],
    "testEnvironment": "node"
  }
}
```

### package.json NPM scripts (for convenience):
```JSON
"scripts": {
  "copy:ssh2shell": "@pwsh.exe -Command Copy-Item \"./src/utilities/helper.utilities/ssh2shell.utility.cjs ./dist/src/utilities/helper.utilities\" -Force",
  "copy:config": "@pwsh.exe -Command Copy-Item \"./tests/mocks/test.asymmetric.config.mock ./dist/tests/mocks\" -Force",
  "copyFiles": "npm run copy:ssh2shell && npm run copy:config",
  "start": "npx tsc && npm run copyFiles && node ./dist/src/entry.point.js",
  "test": "jest",
  "test:coverage": "npm test -- --coverage"
},
```


## tsconfig.json modifications for the core library

### These parameters combine the default NestJS options with best practices and add the ability for the SSH2 and SSH2Shell dependencies to properly function and also allow for better regex search result handling:
```JSON
{
  "compilerOptions": {
    /* Basic Options */
    "incremental": true,    /* Enable incremental compilation */
    "target": "es2017",     /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",   /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "declaration": true,    /* Generates corresponding '.d.ts' file. */
    "sourceMap": true,      /* Generates corresponding '.map' file. */
    "outDir": "./dist",     /* Redirect output structure to the directory. */
    "removeComments": true, /* Do not emit comments to output. */
    "lib": [
      "es2020.string"
    ],                      /* JH dev-added for string.matchAll() functionality (bandaid fix: remove when possible) */
    /* Strict Type-Checking Options */
    "strict": true,                       /* Enable all strict type-checking options. */
    "noImplicitAny": true,                /* Raise error on expressions and declarations with an implied 'any' type. */
    "strictNullChecks": true,             /* Enable strict null checks. */
    "strictFunctionTypes": true,          /* Enable strict checking of function types. */
    "strictBindCallApply": true,          /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    "strictPropertyInitialization": true, /* Enable strict checking of property initialization in classes. */
    "noImplicitThis": true,               /* Raise error on 'this' expressions with an implied 'any' type. */
    "alwaysStrict": true,                 /* Parse in strict mode and emit "use strict" for each source file. */
    /* Additional Checks */
    "noUnusedLocals": true,                     /* Report errors on unused locals. */
    "noUnusedParameters": true,                 /* Report errors on unused parameters. */
    "noImplicitReturns": true,                  /* Report error when not all code paths in function return a value. */
    "noFallthroughCasesInSwitch": true,         /* Report errors for fallthrough cases in switch statement. */
    "noUncheckedIndexedAccess": true,           /* Include 'undefined' in index signature results */
    "noPropertyAccessFromIndexSignature": true, /* Require undeclared properties from index signatures to use element accesses. */
    /* Module Resolution Options */
    "moduleResolution": "node",           /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "baseUrl": "./",                      /* Base directory to resolve non-absolute module names. */
    "allowSyntheticDefaultImports": true, /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    /* Experimental Options */
    "experimentalDecorators": true, /* Enables experimental support for ES7 decorators. */
    "emitDecoratorMetadata": true,  /* Enables experimental support for emitting type metadata for decorators. */
    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```


## Unit tests
  - Use 'npm test' or 'npm run test:coverage' as needed
  - Pro tip: Jest has been set to generate very handy HTML files for code coverage testing (open the index.html file in a browser). The resulting folder (./coverage) can be deleted when done reviewing


## Conversion to native ES6 Module format
### Note: Upon conversion, unit tests will cease to properly function until Jest and TS-Jest versions 27.x are released

### helper.utilities\index.ts:
```TypeScript
import { createRequire } from 'module'; // add or uncomment
const required = createRequire(import.meta.url); // add or uncomment
const SSH2Shell = required('./ssh2shell.utility.cjs'); // change (note the 'd' at the end of 'required')
```

### tsconfig.json:
```JSON
"compilerOptions": {
  "target": "ESNext", // change
  "module": "ESNext", // change
  "moduleResolution": "node", //uncomment
}
```

### package.json:
```JSON
"type": "module", //add
```

### To run (as of Node 15.12.x):
```
npx tsc
node --experimental-specifier-resolution=node ./dist/src/entry.point.js
```

[ssh2shell]: https://raw.githubusercontent.com/cmp-202/ssh2shell/master/lib/ssh2shell.js