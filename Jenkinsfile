pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ SUBIR DOCKER
        stage('Start Docker Environment') {
            steps {
                bat 'docker compose down'
                bat 'docker compose up -d --build'
            }
        }

        // ✅ ESPERAR API SUBIR
        stage('Wait for API') {
            steps {
                bat 'node wait-for-api.js'
            }
        }

        // ✅ TESTES PARALELOS
        stage('Run Tests (Parallel)') {
            parallel {

                stage('Auth') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/auth --reporter=line'
                        }
                    }
                }

                stage('Products') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/products --reporter=line'
                        }
                    }
                }

                stage('Cart') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/cart --reporter=line'
                        }
                    }
                }

                stage('Orders') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders --reporter=line'
                        }
                    }
                }
            }
        }

        // ✅ RELATÓRIO FINAL
        stage('Generate HTML Report') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    bat 'npx playwright test --reporter=html'
                }
            }
        }

        // ✅ ARQUIVAR RELATÓRIO
        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: false
            }
        }

        // ✅ FINALIZAR DOCKER
        stage('Shutdown Environment') {
            steps {
                bat 'docker compose down'
            }
        }
    }
}