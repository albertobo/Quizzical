import React from "react"
import "./index.css"


export default function App() {
    const number = React.createRef()
    const [count, setCount] = React.useState(0)
    const [numberOfQuestions, setNumberOfQuestions] = React.useState(0)
    const [isChecked, setIsChecked] = React.useState(false)
    const [isStarted, setIsStarted] = React.useState(false)
    const [questionsHtml, setQuestionsHtml] = React.useState("")
    
    React.useEffect(() => {
        setNumberOfQuestions(parseInt(number.current.value))
    }, [numberOfQuestions])

    React.useEffect(() => {
        fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}`)
        .then(res => res.json())
        .then(data => {
            const questionsArray = []
            for (let i = 0; i < data.results.length; i++) {
                let isIterated = false
                const question = Object.values(data.results[i])
                const questionId = newId()
                const questionArray = []
                const answers = []
                for (let j = 0; j < question.length; j++) {
                    if (j === 5) {
                        for (let z = 0; z < question[5].length; z++) {
                            answers.push({ questionId: questionId, id: newId(), answer: question[5][z].replace(/&quot\;/g, "\"").replace(/(&#039\;)/g, "\'"), isCorrect: false, isHeld: false, styles: "notHeld" })
                        }
                    } else if (j === 4) {
                        answers.push({ questionId: questionId, id: newId(), answer: question[4].replace(/&quot\;/g, "\"").replace(/(&#039\;)/g, "\'"), isCorrect: true, isHeld: false, styles: "notHeld" })
                    } else if (j === 3) {
                        questionArray.push({ id: newId(), question: (question[3].replace(/(&quot\;)/g, "\"")).replace(/(&#039\;)/g, "\'")})
                    }
                }
                const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
                questionArray.push(shuffledAnswers)
                questionArray.push({ questionId: newId() })
                questionsArray.push(questionArray)
                localStorage.setItem("questions", JSON.stringify(questionsArray))
            }
        })
    }, [numberOfQuestions])
    
    function setNumber() {
        setNumberOfQuestions(parseInt(number.current.value))
    }
    
    function checkAnswers() {
        setIsChecked(true)
        const questionsArray = JSON.parse(localStorage.getItem("questions"))
        for (let i = 0; i < questionsArray.length; i++) {
            for (let j = 0; j < questionsArray[i][1].length; j++) {
                if (questionsArray[i][1][j].isHeld && questionsArray[i][1][j].isCorrect) {
                    questionsArray[i][1][j].styles = "correctAnswer"
                    setCount(prevCount => prevCount + 1)
                } else if (!questionsArray[i][1][j].isHeld && questionsArray[i][1][j].isCorrect) {
                    questionsArray[i][1][j].styles = "correctAnswer"
                } else if (questionsArray[i][1][j].isHeld && !questionsArray[i][1][j].isCorrect) {
                    questionsArray[i][1][j].styles = "wrongAnswer"
                }
            }
        }
        localStorage.setItem("questions", JSON.stringify(questionsArray))
        render()
        }
    function handleClick(e) {
        let questionsArray = JSON.parse(localStorage.getItem("questions"))
        for (let i = 0; i < questionsArray.length; i++) {
            if (questionsArray[i][2].questionId == e.target.getAttribute("name")) {
                questionsArray[i][1].map(question => {
                    if (question.id === e.target.id) {
                        return (question.isHeld = true, question.styles = "isHeld")
                    } else {
                        return (question.isHeld = false, question.styles = "notHeld")
                    }
                })
            }
        }
        localStorage.setItem("questions", JSON.stringify(questionsArray))
        render()
    }

    function toggle() {
        setIsStarted(prevIsStarted => !prevIsStarted)
        render()
    }
    
    function render() {
        const questions = JSON.parse(localStorage.getItem("questions")).map(question => {
            if (question[1].length === 4) {
                return <div id={question[2]} className="question-container" key={question[0].id}>
                    <h3 className="question">{question[0].question}</h3>
                    <div className="answers-container">
                        <p name={question[2].questionId} className={[question[1][0].styles]} id={question[1][0].id} onClick={
                            !isChecked ? (e) => handleClick(e) : null}>{question[1][0].answer}</p>
                        <p name={question[2].questionId} className={[question[1][1].styles]} id={question[1][1].id} onClick={
                            !isChecked ? (e) => handleClick(e) : null}>{question[1][1].answer}</p>
                        <p name={question[2].questionId} className={[question[1][2].styles]} id={question[1][2].id} onClick={
                            !isChecked ? (e) => handleClick(e) : null}>{question[1][2].answer}</p>
                        <p name={question[2].questionId} className={[question[1][3].styles]} id={question[1][3].id} onClick={
                            !isChecked ? (e) => handleClick(e) : null}>{question[1][3].answer}</p>
                    </div>
                </div>
            } else {
                return <div id={question[2]} className="question-container" key={question[0].id}>
                    <h3 className="question">{question[0].question}</h3>
                    <div className="answers-container">
                        <p name={question[2].questionId} className={[question[1][0].styles]} id={question[1][0].id} onClick={
                            !isChecked ? (e) => handleClick(e) : null}>{question[1][0].answer}</p>
                        <p name={question[2].questionId} className={[question[1][1].styles]} id={question[1][1].id} onClick={
                            !isChecked ? (e) => handleClick(e) : null}>{question[1][1].answer}</p>
                    </div>
                </div>
            }
        })
        setQuestionsHtml(questions)
    }
    
    function setChecked() {
        location.reload()
    }
    
    function newId() {
        let id = ""
        const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        for (let i = 0; i < 20; i++) {
            id += characters[Math.floor(Math.random() * 36)]
        }
        return id
    }
    return (
        <main>
            {!isStarted ?
                <div className="start-page">
                    <h2 className="game-title">Quizzical</h2>
                    <h3 className="description">Some description if needed</h3>
                    <label htmlFor="number-of-questions">Number of questions</label>
                    <select onClick={setNumber} ref={number} id="number-of-questions">
                    <option>5</option>
                    <option >10</option>
                    <option>15</option>
                    <option>20</option>
                    </select>
                    <button className="start-button" onClick={(e) => {
                        toggle()
                    }}>Start quiz</button>
                </div> :
                <div className="questions-page">
                    {questionsHtml}
                    <h3 className="result">Result: {count}/{JSON.parse(localStorage.getItem("questions")).length}</h3>
                    {!isChecked ? <button className="check-answers-button" onClick={checkAnswers}>Check answers</button> : <button className="check-answers-button" onClick={setChecked}>Play again</button>}
                </div>
            }
        </main>
    )
}


