pipeline {
  agent any

  environment {
    APP_PORT = '3010'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build Docker image') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('Deploy to test environment') {
      when {
        expression { env.GIT_BRANCH in ['origin/develop', 'develop'] }
      }
      steps {
        sh 'chmod +x scripts/deploy-test.sh'
        sh './scripts/deploy-test.sh'
      }
    }
  }
}
