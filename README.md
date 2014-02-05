
ChildProcess like interface for docker containers.

## API

### Class

Root module exported from `require('docker-process')`.

```js
var DockerProcess = require('docker')
var process = new DockerProcess(
  // dockerode-promise instance
  docker,
  {
    // http://docs.docker.io/en/latest/api/docker_remote_api_v1.8/#create-a-container
    create: {},

    // http://docs.docker.io/en/latest/api/docker_remote_api_v1.8/#start-a-container
    start: {}
  }
);
```

### event: `exit`

Emitted when docker container stops

### event: `close`

Identical to `exit`

### dockerProc.run

Create then start the container and return a promise for its exit
status.

```js
dockerProc.run().then(
  function(code) {
  }
)
```

### dockerProc.remove

Remove the docker container.
