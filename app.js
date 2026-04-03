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

    // 로딩 표시
    btn.disabled = true;
    btn.innerText = "⏳ 기획안 생성 중...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-4'>AI가 열심히 생각하고 있습니다...</p>";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input + " 이 내용을 바탕으로 교육 커리큘럼 3가지를 제안해줘." }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // 결과 출력
        resultContainer.innerHTML = `<div class="bg-blue-50 p-6 rounded-lg whitespace-pre-wrap text-gray-800">${text}</div>`;
    } catch (error) {
        console.error(error);
        alert("에러가 발생했습니다. API 키를 확인해주세요!");
        resultContainer.innerHTML = "오류가 발생했습니다.";
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
