#!/usr/bin/env groovy
pipeline{
    agent any

    environment {
      GTRI_IMAGE_REGISTRY = credentials('gtri-image-registry')
      GTRI_RANCHER_API_ENDPOINT = credentials('gtri-rancher-api-endpoint')
      GTRI_CLARITY_ENV_ID = credentials('gtri-clarity-env-id')
      GTRI_HDAP_ENV_ID = credentials('gtri-hdap-env-id')
    }

    stages{
        stage('Deploy'){
            steps{
                script{
                    docker.withRegistry("https://${GTRI_IMAGE_REGISTRY}"){
                        def fhirclientImage = docker.build("clarity-fhir-client:1.0", "-f ./Dockerfile.prod .")
                        fhirclientImage.push('latest')
                    }
                }
            }
        }

        stage('Notify'){
            steps{
                script{
                    //deploy to GTRI Clarity
                    rancher confirm: true, credentialId: 'gt-rancher-server', endpoint: "${GTRI_RANCHER_API_ENDPOINT}", environmentId: "${GTRI_CLARITY_ENV_ID}", environments: '', image: "${GTRI_IMAGE_REGISTRY}/clarity-fhir-client:latest", ports: '', service: 'ClarityNLP/fhirclient', timeout: 120
                    //deploy to GTRI HDAP
                     rancher confirm: true, credentialId: 'gt-rancher-server', endpoint: "${GTRI_RANCHER_API_ENDPOINT}", environmentId: "${GTRI_HDAP_ENV_ID}", environments: '', image: "${GTRI_IMAGE_REGISTRY}/clarity-fhir-client:latest", ports: '', service: 'ClarityNLP/fhirclient', timeout: 120
                }
            }
        }
    }
}
