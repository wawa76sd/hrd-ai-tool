// 이수연 프로님이 새로 발급받으신 API 키입니다.
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

    // 로딩 시작
    btn.disabled = true;
    btn.innerText = "⏳ AI가 커리큘럼을 구성 중입니다...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-blue-600 font-bold animate-pulse text-lg'>새로운 API 키로 연결을 시도 중입니다. 잠시만 기다려주세요!</p>";

    try {
        // ✅ 최신 표준 v1beta 주소를 사용합니다.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: input + " 이 강사/콘텐츠 정보를 바탕으로 교육 커리큘럼 3가지를 제안해줘. 수강 대상과 학습 목표를 포함해서 한국어로 작성해줘." }] 
                }]
            })
        });

        const data = await response.json();
        
        // 구글 서버 에러 응답 확인
        if (data.error) {
            console.error("구글 에러 상세:", data.error);
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            
            // 결과를 가독성 좋게 출력
            resultContainer.innerHTML = `
                <div class="bg-white border-2 border-blue-50 p-8 rounded-2xl shadow-inner whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">
                    ${text}
                </div>
            `;
        } else {
            throw new Error("결과 데이터가 비어 있습니다.");
        }

    } catch (error) {
        console.error("최종 에러 로그:", error);
        alert("🚨 에러 발생: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold text-center border border-red-100 rounded-lg'>오류가 발생했습니다: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
