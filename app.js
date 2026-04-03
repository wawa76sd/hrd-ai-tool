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
    btn.innerText = "⏳ 기획안 생성 중...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-4 text-blue-500 font-bold'>AI가 강의안을 구성하고 있습니다...</p>";

    try {
        // ✅ 주소를 가장 확실한 정석 버전으로 변경했습니다.
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
        
        // 🚨 만약 구글 서버에서 에러를 보냈다면 팝업으로 띄웁니다.
        if (data.error) {
            throw new Error(`Google API 에러: ${data.error.message}`);
        }

        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            resultContainer.innerHTML = `<div class="bg-blue-50 p-8 rounded-xl shadow-inner whitespace-pre-wrap leading-relaxed text-gray-800">${text}</div>`;
        } else {
            console.log("전체 응답 데이터:", data); // 분석용 로그
            throw new Error("결과 데이터 형식이 예상과 다릅니다.");
        }

    } catch (error) {
        console.error("에러 상세 정보:", error);
        alert("에러가 발생했습니다: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold'>오류 발생: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
