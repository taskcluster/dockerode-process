suite('docker process', function() {
  var DockerRun = require('./');
  var docker = require('./test/docker')();

  suite('#exec - with tty', function() {
    var subject;
    setup(function() {
      subject = new DockerRun(docker, {
        create: {
          Image: 'ubuntu',
          Cmd: ['/bin/bash', '-c', 'echo stdout && echo stderr >&2'],
          Tty: true
        },
        start: {}
      });
    });

    test('single stream from tty', function() {
      var expected = 'stdout\nstderr\n';
      var result = '';

      subject.stdout.on('data', function(value) {
        result += value;
      });

      return subject.exec().then(function() {
        // ensure there are only \n and no \r
        result = result.replace('\r', '');
        assert.equal(expected.trim(), result.trim());
      });
    });
  });

  suite('#exec - without tty', function() {
    var subject;
    setup(function() {
      subject = new DockerRun(docker, {
        create: { Image: 'ubuntu', Cmd: ['/bin/bash', '-c', 'echo stdout && echo stderr >&2'] },
        start: {}
      });
    });

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
          assert.ok(stderrBuffer.length, 'has stderr');
          assert.ok(stdoutBuffer.length, 'has stdout');
          assert.equal(stdoutBuffer[0].trim(), 'stdout');
          assert.equal(stderrBuffer[0].trim(), 'stderr');
          assert.ok(subject.container, 'has container');

          assert.equal(subject.exitCode, 0);
          assert.ok(didExit, 'stream is marked as exited');
        }
      );
    });
  });
});
