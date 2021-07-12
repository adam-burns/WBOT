<<<<<<< HEAD
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

function greetings() {
    let date = new Date();
    hour = date.getHours();

    if (hour >= 0 && hour < 12) {
        return "Good Morning";
    }

    if (hour >= 12 && hour < 18) {
        return "Good evening";
    }

    if (hour >= 18 && hour < 24) {
        return "Good night";
    }
}

async function downloadFile(message) {
    let filename = ''
    if (message.type === "document") {
        filename = `${message.filename.split(".")[0]}_${Math.random().toString(36).substring(4)}`
    } else if (message.type === "image" || message.type === "video" || message.type === "ptt" || message.type === "audio") {
        filename = `${message.chatId.user}_${Math.random().toString(36).substring(4)}`
    } else {
        window.log("couldn't recognize message type. Skipping download")
        return
    }
    const buffer = await WAPI.downloadBuffer(message.deprecatedMms3Url)
    const decrypted = await window.Store.CryptoLib.decryptE2EMedia(message.type, buffer, message.mediaKey, message.mimetype);
    const data = await window.WAPI.readBlobAsync(decrypted._blob);
    saveFile(data.split(',')[1], filename, message.mimetype)
    return data;
}

//Updating string prototype to support variables
String.prototype.fillVariables = String.prototype.fillVariables ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\[#" + key + "\\]", "gi"), args[key]);
            }
        }

        return str;
    };

//check if there is pending unread messages. if yes then push it to data
if (intents.appconfig.replyUnreadMsg) {
    // check for pending unread messages
    log("=====> Keep in mind that bot will reply to unread messages but you have to manually mark them as seen.")
    WAPI.getUnreadMessages(false, true, true, (messages) => {
        let processData = []
        data = messages.filter((m) => !m.archive)
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            for (let j = 0; j < element.messages.length; j++) {
                const message = element.messages[j];
                processData.push(message)
            }
        }
        console.log(processData)
        processMessages(processData)
    })
}

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

async function waitBeforeSending(exactMatch, PartialMatch) {
    if (exactMatch || PartialMatch) {
        if ((exactMatch || PartialMatch).afterSeconds) {
            await delay((exactMatch || PartialMatch).afterSeconds * 1000)
        }
    }
}


quizFillName = function (itemPhone, string) {
    var searchStr = string;
    var name = itemPhone.contact.pushname;
    // window.log("TEST: in function qFN");
    if (name == undefined) name = itemPhone.contact.name;
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

quizFillCorrectReplies = function (itemPhone, string) {
    var searchStr = string;
    var itemQuiz = itemPhone.quiz.find(r => r.id === interaction.quiz.id);
    var correctReplies = itemQuiz.question.filter(o => o.reply.isCorrect == true);
    while (searchStr.indexOf('#correct_replies') >= 0) {
        searchStr = searchStr.replace('#correct_replies', correctReplies.length);
    }
    return searchStr;
}

quizFillIncorrectReplies = function (itemPhone, string) {
    var searchStr = string;
    var itemQuiz = itemPhone.quiz.find(r => r.id === interaction.quiz.id);
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
=======
async function processMessages(data) {
>>>>>>> c3a4818453b7381bd6f81b02aac5d196cbd37ccc
    for (let i = 0; i < data.length; i++) {
        //fetch API to send and receive response from server
        let message = data[i];
        body = {};
        body.text = message.body;
        body.type = 'message';
        body.user = message.chatId._serialized;
        //body.original = message;
        if (intents.appconfig.downloadMedia) {
            downloadFile(message)
        }
        if (intents.appconfig.webhook) {
            //if message is image then download it first and then call an webhook
            if (message.type == "image") {
                body.base64DataFile = await downloadFile(message)
            }
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
                        itemResponse.text = itemResponse.text.fillVariables({ name: message.sender.pushname, phoneNumber: message.sender.id.user, greetings: greetings() });
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
            continue;
        }
        if (message.type == "chat") {
            //message.isGroupMsg to check if this is a group
            if (message.isGroupMsg == true && intents.appconfig.isGroupReply == false) {
                window.log("Message received in group and group reply is off. so will not take any actions.");
                continue;
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

            // set a single ChatId to test
            var itemPhone = chatIdStore.chat.find(o => o.chatId == message.chatId);

            // STATUS of CHAT-ID? Generate itemPhone object
            if (itemPhone == undefined) {
                window.log('DEBUG: itemPhone: chatId does not exist');
                chatIdStore.chat.push({"chatId": message.chatId,"quiz":[]});
                itemPhone = chatIdStore.chat.find(o => o.chatId === message.chatId);
                window.log("DEBUG: KnownChatIds " + JSON.stringify(KnownChatIds));
                if (KnownChatIds.includes(message.chatId._serialized)) {
                      itemPhone.contact = WAPI.getContact(message.chatId);
                      window.log("DEBUG: message.chatId is in KnownChatIds");
                      window.log(itemPhone.contact);
                }
                window.log("DEBUG: itemPhone: chatId created for " + itemPhone.chatId)
            }

            // IS CURRENT QUIZ a NEW QUIZ for CHAT-ID? Generate itemPhone.quiz
            var itemQuiz = itemPhone.quiz.find(o => o.id === interaction.quiz.id);
            if (itemQuiz == undefined) {
                window.log("DEBUG: chatId: current quiz '" + interaction.quiz.id + "' does NOT exist in " + itemPhone.chatId + "'s  profile");
                // Populate itemPhone.itemQuiz with current quiz object
                itemPhone.quiz.push({"id":interaction.quiz.id,"preamble":interaction.quiz.preamble,"question":[],"postamble":interaction.quiz.postamble,"isCompleted":false});
                itemQuiz = itemPhone.quiz.find(o => o.id === interaction.quiz.id);
                for (let q of interaction.quiz.question) {
                    itemQuiz.question.push({"preamble":q.preamble,"postamble":q.postamble,"text":q.text,"answer":q.answer,"isCompleted":false,"reply":{}});
                }
                window.log("DEBUG: chatId: current quiz '" + interaction.quiz.id + "' element created for " + itemPhone.chatId + "'s  profile");
            } else
                window.log("DEBUG: chatId: current quiz '" + interaction.quiz.id + "' already exists in " + itemPhone.chatId + "'s  profile");


            if (itemQuiz.isCompleted == false) {
                // END: SETUP/LOOKUP DATASTORE STRUCTURE FOR A MESSAGE SENDER
                // ------------------------------------------------

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
                    window.log("DEBUG: Quiz '" + itemQuiz.id + "' has started for " + itemPhone.chatId);
                    //window.log("SEND: QUIZ PREAMBLE to " + itemPhone.chatId + " quiz.preamble[]: " + itemQuiz.preamble);
                    //response = response.concat('\n', itemQuiz.preamble);
                    response = quizFillName(itemPhone, itemQuiz.preamble.toString());
                    window.log("DEBUG: response = " + response);

                    WAPI.sendMessage2(itemPhone.chatId, response);
                    itemQuiz.hasBegun = true;
                }

                if (itemQuestion != undefined) {
                    if (itemQuiz.preamble != undefined) {
                        window.log("SEND: QUIZ QUESTION PREAMBLE to " + itemPhone.chatId + " question.preamble[]: " + itemQuestion.preamble);
                        response = itemQuestion.preamble.toString();
		        response = quizFillName(itemPhone, response);
                        response = quizFillCorrectReplies(itemPhone, response);
                        response = quizFillIncorrectReplies(itemPhone, response);
                        window.log("DEBUG: RESPONSE:" + response);
                        WAPI.sendMessage2(itemPhone.chatId, response);
		    }
                    window.log("SEND: QUIZ QUESTION TEXT to " + itemPhone.chatId + " question.text: " + itemQuestion.text);
                    //response = response.concat('\n\n', itemQuestion.text);
                    WAPI.sendMessage2(itemPhone.chatId, itemQuestion.text.toString());
                    // window.log("DEBUG: RESPONSE:" + response);
                    response = "";
                    var itemAnswer = itemQuestion.answer.forEach(o => {
                        if (o.text != undefined) {
                             window.log("DEBUG: ANSWER -> " + o.text);
                             response = response.concat('\n', o.text);
                        }
                    });
                    WAPI.sendMessage2(itemPhone.chatId, response);
                } else {
                    window.log("DEBUG: No unanswered questions found.");
                    if (itemQuiz.postamble != undefined) {
		        response = quizFillName(itemPhone, itemQuiz.postamble.toString());
                        response = quizFillCorrectReplies(itemPhone, response);
                        response = quizFillIncorrectReplies(itemPhone, response);
		        response = response.replace('#questions', itemQuiz.question.length);
                        window.log("SEND: QUIZ POSTAMBLE to " + itemPhone.chatId + " quiz.postamble[]: " + response);
                        // response = response.concat('\n\n', mixed);
                        WAPI.sendMessage2(itemPhone.chatId, response);
                    }
                    // Quiz complete. Mark as so.
                    itemQuiz.isCompleted = true;
                }

                putStoreFile(itemPhone.chatId, JSON.stringify(itemPhone, null, 4));
                //window.log('DEBUG: chatIdStore updated for '+ itemPhone.chatId);
                //window.log('FINAL SEND:\n' + response);
                //if (KnownChatIds.includes(message.chatId._serialized) && response.length > 0) {
                //    WAPI.sendMessage2(itemPhone.chatId, response);
                //}
            } else {
<<<<<<< HEAD
                window.log("DEBUG: " + itemPhone.chatId  + "has already completed this quiz!!")
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
                        window.log("FILE SENDING: "+ (exactMatch || PartialMatch).file + " to " + itemPhone.chatId);
                        WAPI.sendImage(base64Data, message.chatId._serialized, (exactMatch || PartialMatch).file);
                        window.log("FILE SENT: "+ (exactMatch || PartialMatch).file + " to " + itemPhone.chatId);
                    }).catch((error) => {
                        window.log("Error in sending file\n" + error);
                    })
                }
	    }

        } else {
		window.log(`DEBUG: Message type ${message.type} received`);
	}
=======
                console.log("No partial match found");
            }
            WAPI.sendSeen(message.chatId._serialized);
            response = response.fillVariables({ name: message.sender.pushname, phoneNumber: message.sender.id.user, greetings: greetings() })
            await waitBeforeSending(exactMatch, PartialMatch)
            if (exactMatch != undefined || PartialMatch != undefined) {
                //returning if there is no file
                if ((exactMatch || PartialMatch).file != undefined) {
                    files = await resolveSpintax((exactMatch || PartialMatch).file);
                    window.getFile(files).then((base64Data) => {
                        console.log(base64Data);
                        WAPI.sendImage(base64Data, message.chatId._serialized, (exactMatch || PartialMatch).file, response);
                    }).catch((error) => {
                        window.log("Error in sending file\n" + error);
                    })
                } else {
                    WAPI.sendMessage2(message.chatId._serialized, response);
                }
            }
            //sending file if there is any
        }
>>>>>>> c3a4818453b7381bd6f81b02aac5d196cbd37ccc
    }
}

WAPI.waitNewMessages(false, async (data) => {
    console.log(data)
    processMessages(data)
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
