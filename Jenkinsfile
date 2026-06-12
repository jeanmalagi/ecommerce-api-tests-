pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ PARALLEL TEST EXECUTION
        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/auth'
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/products'
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders'
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/cart'
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/dashboard'
                    }
                }
                stage('Publish Report') {
                    steps {
                        publishHTML([
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'Playwright Test Report',
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true
                        ])
                    }
                }                

            }
        }
    }
}