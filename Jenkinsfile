pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

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

        stage('Checkout Backend') {
            steps {
                dir('ecommerce-fullstack') {
                    git url: 'https://github.com/jeanmalagi/ecommerce-fullstack.git', branch: 'main'
                }
            }
        }

        // ✅ RESET COMPLETO DO BANCO (CRÍTICO)
        stage('Start Docker Environment') {
            steps {
                bat '''
                cd ecommerce-fullstack

                docker compose down -v || exit 0
                docker compose up -d --build
                '''
            }
        }

        stage('Wait for API') {
            steps {
                bat '''
                @echo off
                setlocal EnableDelayedExpansion

                echo Aguardando API...

                set RETRY=0

                :loop
                curl http://localhost:3000/api/products >nul 2>&1

                if !ERRORLEVEL!==0 (
                    echo API pronta ✅
                    goto end
                )

                echo Tentativa !RETRY!...
                set /A RETRY+=1

                if !RETRY! GEQ 20 (
                    echo API nao subiu ❌
                    exit /b 1
                )

                timeout /t 3 >nul
                goto loop

                :end
                '''
            }
        }

        // ✅ SEED (AGORA FUNCIONA)
        stage('Seed Database') {
            steps {
                bat '''
                echo Criando usuario admin...

                curl -X POST http://localhost:3000/api/users/register ^
                -H "Content-Type: application/json" ^
                -d "{\\"name\\":\\"Admin\\",\\"email\\":\\"admin@email.com\\",\\"password\\":\\"123456\\",\\"isAdmin\\":true}"

                echo Criando usuario normal...

                curl -X POST http://localhost:3000/api/users/register ^
                -H "Content-Type: application/json" ^
                -d "{\\"name\\":\\"User\\",\\"email\\":\\"cliente@email.com\\",\\"password\\":\\"123456\\"}"
                '''
            }
        }

        stage('Run Tests (Parallel)') {
            parallel {

                stage('Auth') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set NO_COLOR=true
                            npx playwright test tests/auth --reporter=line
                            '''
                        }
                    }
                }

                stage('Products') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set NO_COLOR=true
                            npx playwright test tests/products --reporter=line
                            '''
                        }
                    }
                }

                stage('Cart') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set NO_COLOR=true
                            npx playwright test tests/cart --reporter=line
                            '''
                        }
                    }
                }

                stage('Orders') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set NO_COLOR=true
                            npx playwright test tests/orders --reporter=line
                            '''
                        }
                    }
                }

                stage('Dashboard') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            set NO_COLOR=true
                            npx playwright test tests/dashboard --reporter=line
                            '''
                        }
                    }
                }
            }
        }

        stage('Generate HTML Report') {
            steps {
                bat 'npx playwright test --reporter=html'
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: false
            }
        }

        stage('Shutdown Environment') {
            steps {
                bat '''
                cd ecommerce-fullstack
                docker compose down
                '''
            }
        }
    }

    post {
        always {
            bat '''
            cd ecommerce-fullstack
            docker compose down || exit 0
            '''
        }
    }
}