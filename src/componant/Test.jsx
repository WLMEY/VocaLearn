



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Test = () => {
//     const navigate = useNavigate();
//     const [Question, setQuestion] = useState([]);
//     const [words, setWords] = useState([]);
//     const [ansEnglish, setAnsEnglish] = useState([]);
//     const [newReviw, setNewReviw] = useState([]);
//     const [statistics, setStatistics] = useState([]);
//     const [review, setReview] = useState()


//     const [Q_No, setQ_No] = useState(0);
//     const Question_No = 10;

//     const goto = () => navigate("/review");

//     const QuestionSetting = () => {
//         const shuffled = [...words].sort(() => 0.5 - Math.random());
//         const unReviewed = shuffled.filter(word => !word.Reviewed);
//         setQuestion(unReviewed.slice(0, Question_No));
//     };

//     const setReviewed = async () => {
//         console.log("send on statistics.Reviewed : ",statistics.Reviewed)
//         console.log("send on  Question.length:  ", Question.length)

//         setReview(statistics.Reviewed + Question.length);
//     }
//     const sendReviewedStat = async () => {
//         console.log("send on click ")
//         await axios.patch("http://localhost:5000/Statistics/1", { Reviewed: review });

//     }
//     useEffect(() => {
        
//         console.log("Updated review:", review);
//         sendReviewedStat();
//     }, [review]);
//     useEffect(() => {
//         setReviewed();
//     },[words])
//     // useEffect(() => {
//     //     sendReviewedStat();
//     // },[review])

//     const Get_Words = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:5000/words");
//             const { data: stat } = await axios.get("http://localhost:5000/Statistics/1");

//             setStatistics(stat);
//             setWords(data);
//         } catch (error) {
//             console.error("Error fetching words:", error);
//         }
//     };

//     useEffect(() => {
//         Get_Words();
//     }, []);

//     useEffect(() => {
//         if (words.length > 0) {
//             QuestionSetting();
//         }
//     }, [words]);

//     useEffect(() => {
//         if (newReviw.length > 0) {
//             sendNewReviw();
//         }
//     }, [newReviw]);

//     const Correction = () => {
//         const updatedReview = Question.map((q, i) => ({
//             ...q,
//             mistakes: q.English !== (ansEnglish[i] || ""),
//             Reviewed: true,
//         }));
//         setNewReviw(updatedReview);
//     };

//     const sendNewReviw = async () => {
//         try {
//             console.log("typeof : " + typeof (newReviw))
//             for (let i = 0; i < newReviw.length; i++) {
//                 await axios.post("http://localhost:5000/LastTest", newReviw[i]);
//             }


//             await axios.put("http://localhost:5000/Statistics/1", { ...statistics, Tests: (statistics.Tests + 1) })
//         } catch (error) {
//             console.error("Error sending review data:", error);
//         }
//     };

//     function check() {
//         if (Q_No < Question.length - 1) {
//             setQ_No(Q_No + 1);
//         } else {

//             Correction();
            
//             goto();
//             setQ_No(0);
//         }
//     }

//     return (
//         <div className='new'>
//             <div className='Q_ditils'>
//                 <span>Question No. : {Q_No + 1}</span>
//                 <span>Total Questions : {Question.length}</span>
//                 <span>Type English</span>
//             </div>

//             {Question.length > 0 && (
//                 <>
//                     <h1>{Question[Q_No]?.Arabic}</h1>
//                     <input
//                         value={ansEnglish[Q_No] || ""}
//                         onChange={(e) => {
//                             const newAnswers = [...ansEnglish];
//                             newAnswers[Q_No] = e.target.value;
//                             setAnsEnglish(newAnswers);
//                         }}
//                         type='text'
//                         id='englishInput'
//                         dir="ltr"
//                         lang="en"
//                         inputMode="latin"
//                         placeholder='English'
//                     />
//                     <button onClick={check} className='btn'>
//                         {Q_No < Question.length - 1 ? "Next" : "Submit & Review"}
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Test;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Test = () => {
    const navigate = useNavigate();
    const [Question, setQuestion] = useState([]);
    const [words, setWords] = useState([]);
    const [ansEnglish, setAnsEnglish] = useState([]);
    const [newReviw, setNewReviw] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [review, setReview] = useState(0);
    const [Q_No, setQ_No] = useState(0);
    const Question_No = 10;

    const goto = () => navigate("/review");

    // جلب البيانات الأولية
    const Get_Words = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/words");
            const { data: stat } = await axios.get("http://localhost:5000/Statistics/1");
            setStatistics(stat);
            setWords(data);
            setReview(stat?.Reviewed || 0); // تهيئة قيمة review
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // إعداد الأسئلة
    const QuestionSetting = () => {
        if (!words.length) return;
        const shuffled = [...words].sort(() => 0.5 - Math.random());
        const unReviewed = shuffled.filter(word => !word.Reviewed);
        setQuestion(unReviewed.slice(0, Question_No));
    };

    // تحديث الإحصائيات بعد إنهاء الاختبار
    const updateStatistics = async () => {
        if (!statistics) return;
        
        try {
            // تحديث عدد المراجعات
            const newReviewedCount = review + Question.length;
            await axios.patch("http://localhost:5000/Statistics/1", { 
                Reviewed: newReviewedCount,
                Tests: statistics.Tests + 1
            });
            
            return true;
        } catch (error) {
            console.error("Error updating statistics:", error);
            return false;
        }
    };

    // تصحيح الإجابات وإرسال البيانات
    const Correction = async () => {
        const updatedReview = Question.map((q, i) => ({
            ...q,
            mistakes: q.English !== (ansEnglish[i] || ""),
            Reviewed: true,
        }));
        
        try {
            // إرسال نتائج الاختبار
            for (const item of updatedReview) {
                await axios.post("http://localhost:5000/LastTest", item);
            }
            setNewReviw(updatedReview);
            return true;
        } catch (error) {
            console.error("Error sending test results:", error);
            return false;
        }
    };

    // معالجة النقر على زر التالي/إرسال
    const handleCheck = async () => {
        if (Q_No < Question.length - 1) {
            setQ_No(Q_No + 1);
            return;
        }

        // عند إنهاء الأسئلة
        const correctionSuccess = await Correction();
        const updateSuccess = await updateStatistics();

        if (correctionSuccess && updateSuccess) {
            goto();
            setQ_No(0);
        }
    };

    // Effects
    useEffect(() => {
        Get_Words();
    }, []);

    useEffect(() => {
        if (words.length > 0) {
            QuestionSetting();
        }
    }, [words]);

    return (
        <div className='new'>
            <div className='Q_ditils'>
                <span>Question No.: {Q_No + 1}</span>
                <span>Total Questions: {Question.length}</span>
                <span>Type English</span>
            </div>

            {Question.length > 0 && (
                <>
                    <h1>{Question[Q_No]?.Arabic}</h1>
                    <input
                        value={ansEnglish[Q_No] || ""}
                        onChange={(e) => {
                            const newAnswers = [...ansEnglish];
                            newAnswers[Q_No] = e.target.value;
                            setAnsEnglish(newAnswers);
                        }}
                        type='text'
                        id='englishInput'
                        dir="ltr"
                        lang="en"
                        inputMode="latin"
                        placeholder='English'
                    />
                    <button onClick={handleCheck} className='btn'>
                        {Q_No < Question.length - 1 ? "Next" : "Submit & Review"}
                    </button>
                </>
            )}
        </div>
    );
};

export default Test;