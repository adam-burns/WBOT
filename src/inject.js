window.log(`DEBUG:  #### INJECT CODE EXECUTED!!!`);
// --
// show Current active Quiz details
//
//if (interaction.quiz.active == true) {
//    window.log('*** Quiz Summary ***');
//    window.log('Quiz Name: ' + interaction.quiz.id);
//    window.log('Quiz Preamble: ' + interaction.quiz.preamble);
//    window.log('Number of Questions: ' + interaction.quiz.question.length);
//    interaction.quiz.question.forEach(itemQuestion => {
//        window.log('Question: ' + itemQuestion.text)
//        itemQuestion.answer.forEach(itemAnswer => {
//    	window.log('  Answer:   ' + itemAnswer.text + (itemAnswer.isCorrect == true ? ' (correct) ':' (incorrect)'));
//        window.log('    -> '+ itemAnswer.response);
//        });
//    });
//}

//function parse(str) {
//
//  return Function(` return (${str})`)()
//
//}

quizFillName = function (itemMessageSender, string) {
    var searchStr = string;
    var name = itemMessageSender.contact.pushname;
    // window.log("TEST: in function qFN");
    if (name == undefined) name = itemMessageSender.contact.name;
    //     window.log("TEST: in function qFN: name = " + name);
    if ((name == undefined) || (name.indexOf('#name') >= 0)) {
        name = "";
    //     window.log("TEST: in function qFN: name = " + name);
    }
    // window.log("TEST: in function qFN: searchStr = " + searchStr);
    while (searchStr.indexOf('#name') >= 0) {
        searchStr = searchStr.replace('#name', name);
    }
    return searchStr;
}

quizFillCorrectReplies = function (itemMessageSender, string) {
    var searchStr = string;
    var itemQuiz = itemMessageSender.quiz.find(r => r.id === interaction.quiz.id);
    var correctReplies = itemQuiz.question.filter(o => o.reply.isCorrect == true);
    while (searchStr.indexOf('#correct_replies') >= 0) {
        searchStr = searchStr.replace('#correct_replies', correctReplies.length);
    }
    return searchStr;
}

quizFillIncorrectReplies = function (itemMessageSender, string) {
    var searchStr = string;
    var itemQuiz = itemMessageSender.quiz.find(r => r.id === interaction.quiz.id);
    var incorrectReplies = itemQuiz.question.filter(o => o.reply.isCorrect == false);
    while (searchStr.indexOf('#incorrect_replies') >= 0) {
        searchStr = searchStr.replace('#incorrect_replies', incorrectReplies.length);
    }
    return searchStr;
}




// CompletedQuestions is an array of Questions within a Quiz to tally for
quizResults = function (ChatID, CompletedQuestions) { // note Quiz will always be interaction.quiz for now ...
    if ((ChatID != undefined) && (ChatID.quiz != undefined)) {
         var itemQuiz = ChatID.quiz.find(o => o.id === interaction.quiz.id); // Quiz is hard coded for now
         if (itemQuiz != undefined) {
             var itemQuestions = itemQuiz.question;
             var ChatIDQuestions = itemQuiz.question;
             var ChatIDCompletedQuestions = itemQuiz.question.filter(o => o.isCompleted == true);
             window.log("ChatIDQ: " + ChatIDQuestions.length + " ChatIDCQ.length = " + ChatIDCompletedQuestions.length + " CQ.length = " + CompletedQuestions.length);
             var testCompletedQuestions = [];
             CompletedQuestions.forEach(o => {
                 window.log("forEach o.text: " + o.text);
                 var q = ChatIDQuestions.find(p => p.text === o.text);
                 // if (q != undefined) testCompletedQuestions.push(q);
                 if (q != undefined) {
                     window.log("forEach: o.text: " + o.text + " q.text: " + q.text);
                     testCompletedQuestions.push(JSON.parse(JSON.stringify(q)));
                 } else {
                     window.log("DEBUG: qR: q is undefined");
                 }
             });
             window.log('DEBUG: qR: ' + testCompletedQuestions.length);
             //var testCompletedQuestions = CompletedQuestions.filter(o => ChatIDCompletedQuestions.filter(p => p.isCompleted == o.isCompleted));
             
             //var testCompletedQuestions = ChatIDCompletedQuestions.filter(o => CompletedQuestions.filter(p => p.isCompleted === o.isCompleted));
             //window.log("TEST: testCompletedQuestions.length: " + testCompletedQuestions.length);
             //window.log("TEST: testCompletedQuestions: " + JSON.stringify(testCompletedQuestions, null, 2));
             // 
             // var correctReplies = itemQuiz.question.filter(o => o.reply.isCorrect == true);
             // var incorrectReplies = itemQuiz.question.filter(o => o.reply.isCorrect == false);
             // var noReplies = itemQuiz.question.filter(o => o.reply.isCorrect == undefined);
             // 
             var correctReplies = testCompletedQuestions.filter(o => o.reply.isCorrect == true);
             var incorrectReplies = testCompletedQuestions.filter(o => o.reply.isCorrect == false);
             var noReplies = testCompletedQuestions.filter(o => o.reply.isCorrect == undefined);
             return ([testCompletedQuestions.length, correctReplies.length, incorrectReplies.length, noReplies.length]);
         }
    }
}

//var testChatID = "491704552266@c.us";
//var testGroupID = "491704552266-1588096294@g.us";
//
//window.log("TEST: chatIdStore:" + chatIdStore);
//var testPhone = chatIdStore.chat.find(o => o.chatId == testChatID);
//var testGroup = chatIdStore.chat.find(o => o.chatId == testGroupID);
//window.log("TEST: testPhone: " + testPhone);
//
//window.log("TEST: quizFillName: " + quizFillName(testPhone, "My name is #name"));
//
////var testQuiz = testPhone.quiz.find(r => r.id === interaction.quiz.id);
////var testQuestions = testQuiz.question.filter(o => o.isCompleted == true);
//var testPhoneCompletedQuestions = (testPhone.quiz.find(r => r.id === interaction.quiz.id)).question.filter(o => o.isCompleted == true);
//var testGroupCompletedQuestions = (testGroup.quiz.find(r => r.id === interaction.quiz.id)).question.filter(o => o.isCompleted == true);
//
//window.log("TEST: testPhoneCQ: " + testPhoneCompletedQuestions.length + "testGroupCQ: " + testGroupCompletedQuestions.length);
////window.log("TEST: testPhoneCompletedQuestions: " + JSON.stringify(testPhoneCompletedQuestions, null, 2));
//window.log("TEST: testPhone quizResults against testPhoneCompleted: " + quizResults(testPhone, testPhoneCompletedQuestions));
//window.log("TEST: testPhone quizResults against testGroupCompleted: " + quizResults(testPhone, testGroupCompletedQuestions));
//window.log("TEST: testGroup quizResults against testGroupCompleted: " + quizResults(testGroup, testGroupCompletedQuestions));
//window.log("TEST: testGroup quizResults against testPhoneCompleted: " + quizResults(testGroup, testPhoneCompletedQuestions));
////window.log("TEST: testGroup quizResults: " + quizResults(testGroup));

WAPI.waitNewMessages(false, async (data) => {
    for (let i = 0; i < data.length; i++) {
        //fetch API to send and receive response from server
        let message = data[i];
        body = {};
        body.text = message.body;
        body.type = 'message';
        body.user = message.chatId._serialized;
        //body.original = message;
        if (intents.appconfig.webhook) {
            fetch(intents.appconfig.webhook, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => resp.json()).then(function (response) {
                //response received from server
                console.log(response);
                WAPI.sendSeen(message.chatId._serialized);
                //replying to the user based on response
                if (response && response.length > 0) {
                    response.forEach(itemResponse => {
                        WAPI.sendMessage2(message.chatId._serialized, itemResponse.text);
                        //sending files if there is any 
                        if (itemResponse.files && itemResponse.files.length > 0) {
                            itemResponse.files.forEach((itemFile) => {
                                WAPI.sendImage(itemFile.file, message.chatId._serialized, itemFile.name);
                            })
                        }
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
        window.log(`Message from ${message.chatId.user} checking..`);
        if (intents.blocked.indexOf(message.chatId.user) >= 0) {
            window.log("number is blocked by BOT. no reply");
            return;
        }
        if (message.type == "chat") {
            //message.isGroupMsg to check if this is a group
            if (message.isGroupMsg == true && intents.appconfig.isGroupReply == false) {
                window.log("Message received in group and group reply is off. so will not take any actions.");
                return;
            }

            // --- QUIZ START ---

            // ------------------------------------------------
            // SETUP/LOOKUP DATASTORE STRUCTURE FOR A MESSAGE SENDER
            var response = "";
            var KnownChatIds = WAPI.getAllChatIds();

            // STATUS of CURRENT QUIZ
            if (interaction.quiz && interaction.quiz.active == true)
                window.log("DEBUG: quiz: current quiz: '" + interaction.quiz.id + "' is active");
            else
                window.log("DEBUG: quiz: current quiz '" + interaction.quiz.id + "' is NOT active");

            // find itemMessageSender in our chatIDStore
            //var itemMessageSender = chatIdStore.chat.find(o => o.chatId == message.chatId);
            var itemMessageSender = chatIdStore.find(o => o.chatId == message.chatId);

            // If itemMessageSender was not in our chatIDStore, create a new record
            if (itemMessageSender == undefined) {
                window.log('DEBUG: itemMessageSender: chatId does not exist');
                //chatIdStore.chat.push({"chatId": message.chatId,"quiz":[]});
                chatIdStore.push({"chatId": message.chatId,"quiz":[]});
                //itemMessageSender = chatIdStore.chat.find(o => o.chatId === message.chatId);
                itemMessageSender = chatIdStore.find(o => o.chatId === message.chatId);
                window.log("DEBUG: KnownChatIds " + JSON.stringify(KnownChatIds));
                if (KnownChatIds.includes(message.chatId._serialized)) {
                      itemMessageSender.contact = WAPI.getContact(message.chatId);
                      window.log("DEBUG: message.chatId is in KnownChatIds");
                      window.log(itemMessageSender.contact);
                }
                window.log("DEBUG: itemMessageSender: chatId created for " + itemMessageSender.chatId)
            }

            // Is itemMessageSender's current quiz defined?
            if (itemMessageSender.currentQuizID == undefined) {
                window.log("DEBUG: itemMessageSender: " + itemMessageSender.chatId + " current quizID is undefined");
                var exactMatch = intents.bot.find(obj => obj.exact.find(ex => ex == message.body.toLowerCase()));
                if (exactMatch != undefined) {
                    if (exactMatch.quizID != undefined) {
                        window.log("DEBUG: itemMessageSender: " + itemMessageSender.chatId + " message requests quizID: " + exactMatch.quizID);
                        itemMessageSender.currentQuizID = exactMatch.quizID;
                    } else {
                        itemMessageSender.currentQuizID = interaction.quiz.id;
                    }
                        
                }
            } else {
		// for now take old default ... 
                window.log("DEBUG: itemMessageSender: " + itemMessageSender.chatId + " has existing currentQuizID: " + itemMessageSender.currentQuizID);
            }



            // IS CURRENT QUIZ a NEW QUIZ for CHAT-ID? Generate itemMessageSender.quiz
            var itemQuiz = itemMessageSender.quiz.find(o => o.id === itemMessageSender.currentQuizID);
            if (itemQuiz == undefined) {
                window.log("DEBUG: chatId: current quiz '" + itemMessageSender.currentQuizID + "' does NOT exist in " + itemMessageSender.chatId + "'s  profile");
                // Populate itemMessageSender.itemQuiz with current quiz object
                var itemCurrentQuiz = quizStore.find(o => o.quiz.id === itemMessageSender.currentQuizID);
                window.log("DEBUG: itemCurrentQuiz.quiz.id: " + itemCurrentQuiz.quiz.id);
		// TODO TEST itemCurrentQuiz != undefined here
                itemMessageSender.quiz.push({"id":itemCurrentQuiz.quiz.id,"preamble":itemCurrentQuiz.quiz.preamble,"question":[],"postamble":itemCurrentQuiz.quiz.postamble,"isCompleted":false});
                itemQuiz = itemMessageSender.quiz.find(o => o.id === itemCurrentQuiz.quiz.id);
                for (let q of itemCurrentQuiz.quiz.question) {
                    itemQuiz.question.push({"preamble":q.preamble,"postamble":q.postamble,"text":q.text,"answer":q.answer,"isCompleted":false,"reply":{}});
                }
                window.log("DEBUG: chatId: current quiz '" + itemMessageSender.currentQuizID + "' element created for " + itemMessageSender.chatId + "'s  profile");
            } else
                window.log("DEBUG: chatId: current quiz '" + itemMessageSender.currentQuizID + "' already exists in " + itemMessageSender.chatId + "'s  profile");


            if (itemQuiz.isCompleted == false) {

                var itemQuestion = itemQuiz.question.find(o => o.isCompleted != true);

                if (itemQuiz.hasBegun == true) {
                    // RECEIVE RESPONSE
                    itemQuestion.reply.text = message.body;
                    //window.log('DEBUG: FAKE set message.body = ' + message.body);

                    // PROCESS RESPONSE
                    var itemPartialMatch = itemQuestion.answer.find(obj => obj.contains.find(ex => message.body.toLowerCase().search(ex) > -1));
                    window.log("DEBUG: JSON.stringify(itemPartialMatch) =" + JSON.stringify(itemPartialMatch));
                    if (itemPartialMatch != undefined) {
                        //response = response.concat('\n', itemPartialMatch.response);
                        WAPI.sendMessage2(message.chatId._serialized, itemPartialMatch.response);
                        window.log(`Replying with ${response}`);
                        itemQuestion.reply.isCorrect = itemPartialMatch.isCorrect;
                        itemQuestion.isCompleted = true;
                        itemQuestion = itemQuiz.question.find(o => o.isCompleted != true);
                    } else {
                        window.log("No partial match found");
                    }
                } else {
                    window.log("DEBUG: Quiz '" + itemQuiz.id + "' has started for " + itemMessageSender.chatId);
                    //window.log("SEND: QUIZ PREAMBLE to " + itemMessageSender.chatId + " quiz.preamble[]: " + itemQuiz.preamble);
                    //response = response.concat('\n', itemQuiz.preamble);
                    response = quizFillName(itemMessageSender, itemQuiz.preamble.toString());
                    window.log("DEBUG: response = " + response);

                    WAPI.sendMessage2(itemMessageSender.chatId, response);
                    itemQuiz.hasBegun = true;
                }

                if (itemQuestion != undefined) {
                    if (itemQuiz.preamble != undefined) {
                        window.log("SEND: QUIZ QUESTION PREAMBLE to " + itemMessageSender.chatId + " question.preamble[]: " + itemQuestion.preamble);
                        response = itemQuestion.preamble.toString();
		        response = quizFillName(itemMessageSender, response);
                        response = quizFillCorrectReplies(itemMessageSender, response);
                        response = quizFillIncorrectReplies(itemMessageSender, response);
                        window.log("DEBUG: RESPONSE:" + response);
                        WAPI.sendMessage2(itemMessageSender.chatId, response);
		    }
                    window.log("SEND: QUIZ QUESTION TEXT to " + itemMessageSender.chatId + " question.text: " + itemQuestion.text);
                    //response = response.concat('\n\n', itemQuestion.text);
                    WAPI.sendMessage2(itemMessageSender.chatId, itemQuestion.text.toString());
                    // window.log("DEBUG: RESPONSE:" + response);
                    response = "";
                    var itemAnswer = itemQuestion.answer.forEach(o => {
                        if (o.text != undefined) {
                             window.log("DEBUG: ANSWER -> " + o.text);
                             response = response.concat('\n', o.text);
                        }
                    });
                    WAPI.sendMessage2(itemMessageSender.chatId, response);
                } else {
                    window.log("DEBUG: No unanswered questions found.");
                    if (itemQuiz.postamble != undefined) {
		        response = quizFillName(itemMessageSender, itemQuiz.postamble.toString());
                        response = quizFillCorrectReplies(itemMessageSender, response);
                        response = quizFillIncorrectReplies(itemMessageSender, response);
		        response = response.replace('#questions', itemQuiz.question.length);
                        window.log("SEND: QUIZ POSTAMBLE to " + itemMessageSender.chatId + " quiz.postamble[]: " + response);
                        // response = response.concat('\n\n', mixed);
                        WAPI.sendMessage2(itemMessageSender.chatId, response);
                    }
                    // Quiz complete. Mark as so.
                    itemQuiz.isCompleted = true;
                }

                putStoreFile(itemMessageSender.chatId, JSON.stringify(itemMessageSender, null, 4));
                //window.log('DEBUG: chatIdStore updated for '+ itemMessageSender.chatId);
                //window.log('FINAL SEND:\n' + response);
                //if (KnownChatIds.includes(message.chatId._serialized) && response.length > 0) {
                //    WAPI.sendMessage2(itemMessageSender.chatId, response);
                //}
            } else {
                window.log("DEBUG: " + itemMessageSender.chatId  + " has already completed quiz ID " + itemMessageSender.currentQuizID)
            }

            // --- QUIZ END ---
            if ( (itemQuiz == undefined) || (itemQuiz.hasBegun != true || itemQuiz.isCompleted == true) ) {

                var exactMatch = intents.bot.find(obj => obj.exact.find(ex => ex == message.body.toLowerCase()));
                var response = "";
                if (exactMatch != undefined) {
                    response = await resolveSpintax(exactMatch.response);
                    window.log(`Replying with ${response}`);
                } else {
                    response = await resolveSpintax(intents.noMatch);
                    window.log(`No exact match found. So replying with ${response} instead`);
                }
                var PartialMatch = intents.bot.find(obj => obj.contains.find(ex => message.body.toLowerCase().search(ex) > -1));
                if (PartialMatch != undefined) {
                    response = await resolveSpintax(PartialMatch.response);
                    window.log(`Replying with ${response}`);
                } else {
                    console.log("No partial match found");
                }
                WAPI.sendSeen(message.chatId._serialized);
                WAPI.sendMessage2(message.chatId._serialized, response);
                if ((exactMatch || PartialMatch).file != undefined) {
                    window.getFile((exactMatch || PartialMatch).file).then((base64Data) => {
                        //console.log(file);
                        window.log("FILE SENDING: "+ (exactMatch || PartialMatch).file + " to " + itemMessageSender.chatId);
                        WAPI.sendImage(base64Data, message.chatId._serialized, (exactMatch || PartialMatch).file);
                        window.log("FILE SENT: "+ (exactMatch || PartialMatch).file + " to " + itemMessageSender.chatId);
                    }).catch((error) => {
                        window.log("Error in sending file\n" + error);
                    })
                }
	    }

        } else {
		window.log(`DEBUG: Message type ${message.type} received`);
	}
    }
});
WAPI.addOptions = function () {
    var suggestions = "";
    intents.smartreply.suggestions.map((item) => {
        suggestions += `<button style="background-color: #eeeeee;
                                margin: 5px;
                                padding: 5px 10px;
                                font-size: inherit;
                                border-radius: 50px;" class="reply-options">${item}</button>`;
    });
    var div = document.createElement("DIV");
    div.style.height = "40px";
    div.style.textAlign = "center";
    div.style.zIndex = "5";
    div.innerHTML = suggestions;
    div.classList.add("grGJn");
    var mainDiv = document.querySelector("#main");
    var footer = document.querySelector("footer");
    footer.insertBefore(div, footer.firstChild);
    var suggestions = document.body.querySelectorAll(".reply-options");
    for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];
        suggestion.addEventListener("click", (event) => {
            console.log(event.target.textContent);
            window.sendMessage(event.target.textContent).then(text => console.log(text));
        });
    }
    mainDiv.children[mainDiv.children.length - 5].querySelector("div > div div[tabindex]").scrollTop += 100;
}
