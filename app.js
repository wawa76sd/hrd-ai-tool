const API_KEY = "AIzaSyBgn2uGMqgeZVvaf-5zx1Cxy7pqsbflwTM"; 

window.generatePlan = async function() {
    const input = document.getElementById('youtubeInput').value;
    const btn = document.getElementById('btn');
    const resultSection = document.getElementById('resultSection');
    const resultContainer = document.getElementById('resultContainer');

    if (!input) {
        alert("내용을 입력해주세요!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ AI가 커리큘럼을 짜는 중입니다...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-blue-600 font-bold animate-pulse'>모델 서버에 접속 중입니다. 잠시만 기다려주세요!</p>";

    try {
        // ✅ 구글 API의 가장 확실한 '정석' 주소입니다. (v1beta + models 경로)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: input + " 이 내용을 바탕으로 교육 커리큘럼 3가지를 제안해줘. 한국어로 작성해줘." }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            resultContainer.innerHTML = `<div class="bg-white border-2 border-blue-50 p-8 rounded-2xl shadow-inner whitespace-pre-wrap text-gray-800 text-lg">${text}</div>`;
        }
    } catch (error) {
        alert("🚨 에러: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold text-center'>오류 발생: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
