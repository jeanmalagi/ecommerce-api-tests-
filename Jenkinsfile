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
                bat 'if exist reports rmdir /s /q reports'
                bat 'mkdir reports'
            }
        }

        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\auth
                            npx playwright test tests/auth
                            '''
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\products
                            npx playwright test tests/products
                            '''
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\orders
                            npx playwright test tests/orders
                            '''
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\cart
                            npx playwright test tests/cart
                            '''
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\dashboard
                            npx playwright test tests/dashboard
                            '''
                        }
                    }
                }
            }
        }

        stage('Debug Reports') {
            steps {
                bat 'dir reports /s'
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'reports/**', fingerprint: true
            }
        }
    }
}