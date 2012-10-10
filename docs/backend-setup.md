# Backend Setup Instructions

Follow these steps to configure a computer to autonomously run the MapCenter
real time update service. These instructions assume that the target server is
running Debian 6.0 (code named "Squeeze"). This operating system can be
downloaded free of charge from [debian.org](http://www.debian.org/).

1. SSH into the target machine as the root user
2. Set the hard and soft limits of maximum open file handles to a number that
  is at least as large as the desired number of concurrent connections. Add the
  following lines to `/etc/security/limits.conf` (assuming support for 40,960
  concurrent connections is acceptable):

      root      hard    nofile   40960
      root      soft    nofile   40960

3. Create a directory called `import` in the root user's home directory, and
   upload the following files into it:
  - The shell scripts from the `backend/setup/` directory of this repository:
    - setup.sh
    - mapcenter-runner
    - startup.sh
  - Public key files (`*.pub`) for intended SSH users
  - OAuth service credentials, formatted as described in
    `backend/credentials/oauth/readme.md`

  The following is a graphical representation of the expected directory
  structure:

      /root/import/
      |- setup.sh
      |- mapcenter-runner
      |- startup.sh
      |- public-keys/
      |  `- *.pub
      `- oauth/
         `- *.json

4. Modify the environmental variables declared at the beginning of the
   `setup.sh` script according to your environment
5. Execute the `setup.sh` shell script, answering prompts as necessary

When complete, the web interface will be accessible via the host and port
defined in `setup.sh`.
