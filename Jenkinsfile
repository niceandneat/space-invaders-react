// Reference https://issues.jenkins.io/browse/JENKINS-57269
def remote = [:]
remote.name = 'web'
remote.host = '13.125.62.25'
remote.allowAnyHosts = true

pipeline {
  agent {
    docker {
      image 'node'
    }
  }

  environment {
    CI = 'true'
    PUBLIC_PATH = '/projects/space-invaders/'
    DIST_PATH = '/home/ubuntu/projects/niceandneat.dev/dist/projects'
    PRJECT_NAME = 'space-invaders'
  }

  stages {
    stage('Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'lightsail-rsa', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'userName')]) {
          script {
            remote.user = userName
            remote.identityFile = identity
          }
          sshCommand remote: remote, command: "mkdir -p $DIST_PATH/temp"
          sshPut remote: remote, from: 'dist', into: "$DIST_PATH/temp"
          sshCommand remote: remote, command: "rm -rf $DIST_PATH/$PRJECT_NAME && mv $DIST_PATH/temp/dist $DIST_PATH/$PRJECT_NAME"
          sshCommand remote: remote, command: "rm -rf $DIST_PATH/temp"
        }
      }
    }
  }
}
