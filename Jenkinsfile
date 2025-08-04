pipeline {
    agent any

    tools {
        nodejs "Node24"
        dockerTool "Dockertool" 
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'chmod +x ./node_modules/.bin/jest'
            }
        }

        stage('Construir Imagen Docker') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'docker build -t api-biblioteca:latest .'
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh '''
                    docker stop api-biblioteca || true
                    docker rm api-biblioteca || true
                    docker run -d --name api-biblioteca -p 4000:4000 api-biblioteca:latest
                '''
            }
        }
    }
}