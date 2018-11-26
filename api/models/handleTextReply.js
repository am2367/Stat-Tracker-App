var twilio = require('twilio');
const mongoConnection = require('../models/mongoConnection.js');
const updateResponse = require('../models/updateResponse.js');
const updateLastJobSent = require('../models/updateLastJobSent.js');
const incrementOccurrenceCount = require('../models/incrementOccurrenceCount.js');
const sendText = require('../models/sendText.js');

const handleTextReply = (req, callback) => {
    mongoConnection(function(dbo, closeDb){
        
        const match = { "$match": { Phone: req.From } }
        const lookup = {
                            "$lookup": {
                                "from": "Configs",
                                "localField": "Username",
                                "foreignField": "Username",
                                "as": "UserData"
                            }
                        }
        const unwind = {"$unwind": "$UserData"}
        const lookup2 = {
                            "$lookup": {
                                "from": "Responses",
                                "localField": "UserData.Username",
                                "foreignField": "Username",
                                "as": "UserData.Responses"
                            }
                        }

        //Find object for passed username
        dbo.collection("Users").aggregate([match, lookup, unwind, lookup2]).toArray(function myFunc(err, result) {
            if (err) throw err;

            //if user is found
            if(result.length){
                //console.log(result[0])
                
                const record = result[0]
                const config = record.UserData.LastJobSent.JobName.split('_')[1]
                const questionIndex = parseInt(record.UserData.LastJobSent.QuestionIndex)
                const questionData = record.UserData.Configurations[config].questionData
                const answerType = questionData[questionIndex].type
                const response = req.Body.toLowerCase()
                
                handleResponse(response, record, config, questionIndex, answerType, function(validAnswer){
                    
                    //If the answer is a valid answer and this question triggers another question
                    if(validAnswer && questionData[questionIndex].triggersQuestion){
                        const nextQuestion = questionData[questionIndex + 1].question

                        //If the answer triggers another question then send the next question
                        if(response === questionData[questionIndex + 1].triggeredByAnswer){
                            sendText(record.Username, nextQuestion, function(response){
                                console.log(response)
                                
                                //Update the last job sent object in db
                                updateLastJobSent(record.Username, record.UserData.LastJobSent.JobName, questionIndex+1, function(response){
                                    console.log(response)
                                })
                
                            })
                        }
                        //No more questions so send thank you response and increment occurrences 
                        else{
                            incrementOccurrenceCount(record.Username, record.UserData.LastJobSent.JobName, function(result){
                                console.log(result)
                            })

                            sendText(record.Username, "Responses have been recorded. Thanks!", function(response){
                                console.log(response)
                
                                /*updateLastJobSent(record.Username, record.UserData.LastJobSent.JobName, questionIndex+1, function(response){
                                    console.log(response)
                                })*/
                
                            })
                        }
                    }
                    //No more questions so send thank you response and increment occurrences
                    else if(validAnswer){
                        incrementOccurrenceCount(record.Username, record.UserData.LastJobSent.JobName, function(result){
                            console.log(result)
                        })

                        sendText(record.Username, "Responses have been recorded. Thanks!", function(response){
                            console.log(response)
            
                            /*updateLastJobSent(record.Username, record.UserData.LastJobSent.JobName, questionIndex+1, function(response){
                                console.log(response)
                            })*/
            
                        })
                    }
                })
            }
            else{
                callback('Error');
            }    
        
            closeDb()
        
        });
    });
}

function handleResponse(response, record, config, questionIndex, answerType, callback){
    
    if(answerType === 'yes/no'){
        if(response === 'yes' || 'no'){
            updateResponse(record.Username, record.UserData.LastJobSent.JobName, questionIndex, response, function(result){
                console.log(result)
                callback(true, config, questionIndex)
            })
        }else{
            let message = 'That is not a valid answer. Please answer with Yes or No, or change the answer type for your question.'

            sendText(record.Username, message, function(response){
                console.log(response)
                callback(false, config, questionIndex)
            })
        }
    }else{
        if(parseInt(response) >= 1 && parseInt(response) <= parseInt(answerType)){
            updateResponse(record.Username, record.UserData.LastJobSent.JobName, questionIndex, response, function(result){
                console.log(result)
                callback(true, config, questionIndex)
            })
        }else{
            let message = 'That is not a valid answer. Please answer with 1-' + answerType + ', or change the answer type for your question.'

            sendText(record.Username, message, function(response){
                console.log(response)
                callback(false)
            })
        }
    }

    
}

module.exports = handleTextReply;
