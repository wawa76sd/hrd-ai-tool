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
    resultContainer.innerHTML = "<p class='text-center p-4 text-blue-500 font-bold'>AI가 강의안을 구성하고 있습니다. 잠시만 기다려주세요!</p>";

    try {
        // ✅ 수정된 부분: v1beta 대신 v1을 쓰고 모델 경로를 정확히 맞췄습니다.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: input + " 이 내용을 바탕으로 교육 커리큘럼 3가지를 제안해줘. 한국어로 작성해줘." }] 
                }]
            })
        });

        const data = await response.json();
        
        // 데이터가 잘 왔는지 확인하는 안전 장치
        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            resultContainer.innerHTML = `<div class="bg-blue-50 p-8 rounded-xl shadow-inner whitespace-pre-wrap leading-relaxed text-gray-800">${text}</div>`;
        } else {
            throw new Error("응답 데이터 형식이 올바르지 않습니다.");
        }

    } catch (error) {
        console.error(error);
        alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요!");
        resultContainer.innerHTML = `<p class='text-red-500 p-4'>오류 발생: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
