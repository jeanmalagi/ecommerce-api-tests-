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

        stage('Clean Reports') {
            steps {
                bat 'if exist blob-report rmdir /s /q blob-report'
                bat 'if exist playwright-report rmdir /s /q playwright-report'
            }
        }

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

        stage('Generate Playwright Report') {
            steps {
                bat 'npx playwright merge-reports blob-report'
                bat 'dir playwright-report'
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }
}