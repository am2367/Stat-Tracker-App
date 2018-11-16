const updateConfig = require('../models/updateConfig.js');

const createDefaultConfigs = (username, callback) => {
    let configs = ['Productivity', 'Energy', 'Patience']
    let questionData = {
                        1:{
                            type: '',
                            index: 1,
                            question: '',
                            triggersQuestion: false,
                            triggeredByAnswer: '',
                            triggeredByAnswerScale: [],
                            triggeredByAnswerType: ''
                          }
                        }
    let notificationData = {
                            notificationType: '',
                            onDays: [],
                            messageTimeType: '',
                            everyHours: 0,
                            everyMinutes: 0,
                            atTime: "",
                            summary: ''
                            }
    
    configs.forEach(function(config){
        updateConfig(username, {
                    configName: config,
                    active: false,
                    numQuestions: 1,
                    completed: {},
                    triggerAnswerType: '',
                    questionData: questionData,
                    notificationData: notificationData}, function(result){
            console.log(result)
        }, function(result){
            console.log(result)
        })
    })

    callback('Created')
}
module.exports = createDefaultConfigs;