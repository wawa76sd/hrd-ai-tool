const API_KEY = "AIzaSyAPwaMsCctznzn4TgJE84-lCY0aE0Fr8MM"; 

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
    btn.innerText = "⏳ AI가 기획안을 작성 중입니다...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-blue-600 font-bold animate-pulse text-lg'>커리큘럼을 구성하고 있습니다. 잠시만 기다려주세요!</p>";

    try {
        // ✅ 최신 표준 주소: v1을 사용하고 모델 경로를 명확히 지정합니다.
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
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
        
        // 구글 서버 에러 메시지 상세 출력
        if (data.error) {
            console.error("상세 에러 내용:", data.error);
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            // 결과를 더 예쁘게 출력하기 위한 처리
            resultContainer.innerHTML = `
                <div class="bg-white border-2 border-blue-50 p-8 rounded-2xl shadow-inner whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">
                    ${text}
                </div>
            `;
        } else {
            throw new Error("결과 형식이 올바르지 않습니다.");
        }

    } catch (error) {
        console.error("최종 에러 로그:", error);
        alert("🚨 에러 발생: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold text-center border border-red-200 rounded-lg'>오류: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
