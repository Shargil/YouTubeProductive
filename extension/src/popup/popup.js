chrome.storage.sync.get(["CONST", "user"], (res) => {
    chrome.storage.local.get("myYoutube", ({ myYoutube }) => {
        setModeButtonToPreviewsSaved(res.user.extensionMode);
        setMyYouTubeIs(myYoutube);
        settingsAndLogoOnClick();
        setFocusLevelIcon(res.user.focus);

        document.getElementById('searchOnly').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.SEARCH_ONLY);
        console.log(res.CONST.EXTN_MODE.SEARCH_ONLY);
        document.getElementById('filter').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.FILTER);
        console.log(res.CONST.EXTN_MODE.FILTER);

        function onModeClick(wantedMode, event) {
            event.preventDefault;
            chrome.storage.sync.get("user", (res) => {
                let currentMode = res.user.extensionMode;
                if (itsNotTheSameMode(currentMode, wantedMode)) {
                    if (wantedModeIsEasier(currentMode, wantedMode)) {

                        lockChangingModeUI(currentMode, wantedMode);

                        setTimeout(() => {
                            // addFriction(onFinished, onNotFinished)
                            document.querySelector('.friction-title').classList.add('friction-on-title');
                            // document.querySelector('.friction-title').innerText = 'Is changing to an "easier" mode \r\n the right thing to do right now?';
                            document.querySelector('.friction-title').innerHTML = 'Let\'s make sure it\'s an aware decision! <br/> <span style="font-size: 12px;">That it\'s not that small voice in our heads saying "videos until 5AM!!!" <br/> Solve this 3 problems to move to more "tempting" mode. <br/> And get better at simple math while doing it :) ';


                            const frictionMode = "math";
                            if (frictionMode === "math") {
                                let rightAnswers = 0;
                                const neededAnswers = 3;
                                let answer = createNewMathProblem();
                                document.querySelector('.friction-math-container').classList.add("friction-on-math-container");

                                let clickAllowed = true;

                                listenInputOnEnter();
                                document.querySelector('.friction-math-btn').onclick = () => {
                                    if (clickAllowed) {

                                        if (parseInt(document.querySelector('.friction-math-input').value) === answer) {
                                            debugger;
                                            rightAnswers++;
                                            if (rightAnswers < neededAnswers) {
                                                rightAnswerAnimation(true, () => { answer = createNewMathProblem() });
                                            } else {
                                                // changeModeUnlocked
                                                rightAnswerAnimation(true);
                                                showAllConfetti(() => {
                                                    cancelLockChangingModeUI(currentMode, wantedMode);
                                                    frictionOff();
                                                    changeMode();
                                                });

                                            }
                                        } else {
                                            rightAnswerAnimation(false);
                                        }

                                        clickAllowed = false;
                                        setTimeout(() => {
                                            clickAllowed = true;
                                        }, 2000);
                                    }
                                }
                            }
                        }, 120.69);

                    } else {
                        changeMode();
                    }
                } else {
                    cancelLockChangingModeUI(currentMode, wantedMode);
                    frictionOff();
                }


                function changeMode() {
                    chrome.storage.sync.get("user", (res) => {
                        let updatedUser = res.user;
                        updatedUser.extensionMode = wantedMode;
                        chrome.storage.sync.set({ user: updatedUser }, () => {
                            chrome.runtime.sendMessage({ contentScriptFuncs: "reloadCurrYouTubeTab" }, (res) => { });
                            event.target.checked = true;
                        });
                    });
                }
            });
        }

        function itsNotTheSameMode(currentMode, wantedMode) {
            return currentMode !== wantedMode;
        }

        const extnModeStrictLevels = {
            "off": 0,
            "filter": 1,
            "searchOnly": 2
        }

        function wantedModeIsEasier(currentMode, wantedMode) {
            return extnModeStrictLevels[wantedMode] < extnModeStrictLevels[currentMode];

        }

        function createNewMathProblem() {
            document.querySelector('.friction-math-input').value = "";

            let randomNumberOne = getRndInteger(1, 100);
            let randomNumberTwo = getRndInteger(2, 10);

            document.getElementById('friction-math-number-one').innerText = randomNumberOne;
            document.getElementById('friction-math-number-two').innerText = randomNumberTwo;

            const answer = randomNumberOne * randomNumberTwo;
            return answer;

        }

        function rightAnswerAnimation(rightAnswer, onAnimationEnd) {
            hideElement(document.getElementById('icon-submit'));
            showElement(document.getElementById('answer-animation'));
            const player = document.getElementById("answer-animation");

            if (rightAnswer)
                player.load("https://assets3.lottiefiles.com/temp/lf20_5tgmik.json");
            else
                player.load("https://assets6.lottiefiles.com/temp/lf20_yYJhpG.json");

            player.addEventListener('complete', onComplete.bind(null, onAnimationEnd), { once: true });

            function onComplete(onAnimationEnd) {
                hideElement(document.getElementById('answer-animation'));
                showElement(document.getElementById('icon-submit'));
                if (onAnimationEnd)
                    onAnimationEnd()
            }
        }

        function showAllConfetti(onAnimationEnd) {
            setTimeout(() => {
                showConfetti(document.getElementById('confetti-one'))
            }, 750 + 200);

            setTimeout(() => {
                showConfetti(document.getElementById('confetti-two'))
            }, 750 + 700);

            setTimeout(() => {
                showConfetti(document.getElementById('confetti-three'))
            }, 750 + 800);

            setTimeout(() => {
                showConfetti(document.getElementById('confetti-four'))
            }, 750 + 500);

            setTimeout(() => {
                showConfetti(document.getElementById('confetti-five'))
                document.getElementById('confetti-five').addEventListener('complete', onComplete.bind(null, onAnimationEnd), { once: true });

                function onComplete(onAnimationEnd) {
                    debugger;
                    hideElement(document.getElementById('confetti-five'));
                    if (onAnimationEnd)
                        onAnimationEnd()
                }

            }, 750 + 1300);



            function showConfetti(lottiePlayerElement) {
                debugger;
                showElement(lottiePlayerElement);
                lottiePlayerElement.load("../assets/Lottie/confetti.json");

                lottiePlayerElement.addEventListener('complete', () => hideElement(lottiePlayerElement), { once: true });
            }
        }

        function frictionOff() {
            document.querySelector('.friction-math-container').classList.remove("friction-on-math-container");
            document.querySelector('.friction-title').classList.remove('friction-on-title');
            document.querySelector('.friction-title').innerText = '???Habits are best break when introducing friction???';
        }

        function lockChangingModeUI(currentMode, wantedMode) {
            const currentInputParent = document.querySelector("#modes #" + currentMode).parentElement;
            currentInputParent.querySelector("label").classList.add("label-current-mode");
            const wantedInputParent = document.querySelector("#modes #" + wantedMode).parentElement;
            wantedInputParent.querySelector("label").classList.add("label-wanted-mode-locked");
            showElement(wantedInputParent.querySelector(".mode-lock"));
        }

        function cancelLockChangingModeUI(currentMode, wantedMode) {
            const currentInputParent = document.querySelector("#modes #" + currentMode).parentElement;
            currentInputParent.querySelector("label").classList.remove("label-current-mode");
            const wantedInputParent = document.querySelector("#modes #" + wantedMode).parentElement;
            wantedInputParent.querySelector("label").classList.remove("label-wanted-mode-locked");
            hideElement(wantedInputParent.querySelector(".mode-lock"));
        }


        function setModeButtonToPreviewsSaved(extensionMode) {
            let extensionModeElement = document.querySelector("#modes #" + extensionMode);
            extensionModeElement.checked = true;
        }

        function setMyYouTubeIs(myYoutube) {
            let htmlString = '<p>My YouTube is' + (myYoutube.listType === res.CONST.LIST_TYPE.BLACK_LIST ? ' not' : '') + ': </p> <div class="channels-list-container">';
            const fullLists = myYoutube.listType === res.CONST.LIST_TYPE.BLACK_LIST ? myYoutube.fullListsBlack : myYoutube.fullListsWhite;
            for (const fullList of fullLists) {
                htmlString +=
                    '<div class="channels-list-label">' +
                    fullList.name +
                    '<button id="go-to-options" title="Edit lists in Options page">' +
                    '<img src="../assets/Close by AR Ehsan from the Noun Project 1.svg" alt="Close by AR Ehsan from the Noun Project 1.svg"/>' +
                    '</button>' +
                    '</div>'
            }
            htmlString += "</div>"
            document.getElementById("mode-options").innerHTML = htmlString.trim();

            const buttons = document.querySelectorAll('#go-to-options');
            for (const btn of buttons) {
                btn.onclick = function () {
                    if (chrome.runtime.openOptionsPage) {
                        chrome.runtime.openOptionsPage();
                    }
                }
            }
        }

        function settingsAndLogoOnClick() {
            const buttons = document.querySelectorAll('#logo, #settings')
            for (const btn of buttons) {
                btn.onclick = function () {
                    if (chrome.runtime.openOptionsPage) {
                        chrome.runtime.openOptionsPage();
                    }
                }
            }
        }

        function setFocusLevelIcon(focus) {
            let focusLevelBtn = document.getElementById("focusLevelBtn")
            if (focus.focusLevel === "deepFocus") {
                imgSrc = "../assets/DeepFocus.png";
            } else {
                imgSrc = "../assets/FocusRegular.png";
            }
            focusLevelBtn.innerHTML = "<img src=" + imgSrc + " alt='Focus Level Indicator' height='28'/>";
            focusLevelBtn.onclick = function () {
                if (chrome.runtime.openOptionsPage) {
                    chrome.runtime.openOptionsPage();
                }
            }
        }

        function listenInputOnEnter() {
            input = document.querySelector('.friction-math-input');
            input.addEventListener('keyup', (event) => {
                // 13 is Enter
                if (event.keyCode === 13) {
                    event.preventDefault();
                    document.querySelector('.friction-math-btn').click();
                }
            });
        }
    });
});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showElement(element) {
    element.classList.remove("hide");
    element.classList.add("show");
}

function hideElement(element) {
    element.classList.remove("show");
    element.classList.add("hide");
}



// async function mainFunction() {
//     const getFromStorage = (keys) => new Promise((resolve, reject) =>
//         chrome.storage.sync.get(...keys, result => resolve(result)));

//     const res = await getFromStorage;
//     console.log(res);
// }

// mainFunction();