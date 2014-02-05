suite('docker_run', function() {
  var DockerRun = require('./');
  var docker = require('./test/docker')();

  var subject;
  setup(function() {
    subject = new DockerRun(docker, {
      create: { Image: 'ubuntu', Cmd: ['/bin/bash', '-c', 'echo "xfoo" | tee /dev/stderr'] },
      start: {}
    });
  });

  suite('#exec', function() {
    var stdoutBuffer;
    var stderrBuffer;

    test('run docker image', function() {
      stderrBuffer = [];
      stdoutBuffer = [];

      function append(buffer, item) {
        buffer.push(item.toString());
      }

      var promise = subject.exec();

      assert.ok(subject.stdout, 'has stdout, stream');
      assert.ok(subject.stderr, 'has stderr stream');

      subject.stdout.on('data', append.bind(null, stdoutBuffer));
      subject.stderr.on('data', append.bind(null, stderrBuffer));
      assert.equal(subject.exitCode, null);


      var didExit = false;
      subject.once('exit', function() {
        didExit = true;
      });

      return promise.then(
        function(status) {
          console.log(stdoutBuffer, stderrBuffer);
          assert.ok(stderrBuffer.length, 'has stderr');
          assert.ok(stdoutBuffer.length, 'has stdout');
          assert.equal(stdoutBuffer[0].trim(), 'xfoo');
          assert.equal(stderrBuffer[0].trim(), 'xfoo');

          assert.equal(subject.exitCode, 0);
          assert.ok(didExit, 'stream is marked as exited');
        }
      );
    });
  });
});
