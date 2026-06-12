pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        // ✅ Instalar dependências do projeto
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        // ✅ Instalar browsers do Playwright
        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ Executar testes em paralelo usando blob reporter
        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/auth --reporter=blob'
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/products --reporter=blob'
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders --reporter=blob'
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/cart --reporter=blob'
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/dashboard --reporter=blob'
                        }
                    }
                }
            }
        }

        // ✅ Gerar relatório consolidado
        stage('Generate Playwright Report') {
            steps {
                bat 'npx playwright merge-reports --reporter html ./blob-report'
                bat 'dir playwright-report'
            }
        }

        // ✅ Publicar relatório no Jenkins
        stage('Publish Report') {
            steps {
                publishHTML([
                    reportDir: "${WORKSPACE}/playwright-report",
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false,
                    includes: '**/*'
                ])
            }
        }
    }
}