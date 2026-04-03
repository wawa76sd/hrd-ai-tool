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
    btn.innerText = "⏳ 시스템 연결 중...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-blue-600 font-bold animate-pulse'>모델 서버에 접속 중입니다. 잠시만 기다려주세요!</p>";

    try {
        // ✅ 가장 범용적인 호출 주소입니다.
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
        
        // 만약 여기서도 Not Found가 뜬다면, 모델명을 'gemini-pro'로 강제 전환합니다.
        if (data.error && data.error.message.includes("not found")) {
            console.log("Flash 모델을 찾을 수 없어 Pro 모델로 재시도합니다.");
            return retryWithPro(input); 
        }

        if (data.candidates && data.candidates[0].content) {
            renderResult(data.candidates[0].content.parts[0].text);
        } else {
            throw new Error(data.error ? data.error.message : "알 수 없는 오류");
        }

    } catch (error) {
        alert("🚨 연결 오류: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4'>서버 응답 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};

// 모델을 바꿔서 한 번 더 찔러보는 안전장치 함수
async function retryWithPro(input) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: input + " 교육 커리큘럼 3가지를 제안해줘." }] }]
        })
    });
    const data = await response.json();
    if (data.candidates) {
        renderResult(data.candidates[0].content.parts[0].text);
    } else {
        alert("모든 모델이 응답하지 않습니다. API 키 설정을 다시 확인해주세요.");
    }
}

function renderResult(text) {
    document.getElementById('resultContainer').innerHTML = `
        <div class="bg-white border-2 border-blue-50 p-8 rounded-2xl shadow-inner whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">
            ${text}
        </div>
    `;
}
