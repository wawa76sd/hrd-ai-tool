onst API_KEY = "AIzaSyA91ZyP98rC21tQIaFIEK8zAVA4fMAWius"; 

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
    btn.innerText = "⏳ 시스템 최적 모델 찾는 중...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-blue-600 font-bold animate-pulse text-lg'>현재 API 키에서 사용 가능한 최적의 모델을 연결하고 있습니다...</p>";

    try {
        // ✅ [핵심 변경] 모델명을 최대한 단순화하거나 가장 기본형인 gemini-pro로 시도합니다.
        // 특정 버전(1.5 등)을 명시하지 않고 기본형으로 찔러보는 방식입니다.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
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
        
        // 만약 여기서도 모델을 못 찾는다면 서버가 보내주는 진짜 에러 메시지를 팝업으로 띄웁니다.
        if (data.error) {
            console.error("서버 응답 에러:", data.error);
            // 에러 메시지에 사용 가능한 모델 리스트가 포함되어 있는지 확인하기 위함입니다.
            alert("🚨 시스템 메시지: " + data.error.message);
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            resultContainer.innerHTML = `
                <div class="bg-white border-2 border-blue-50 p-8 rounded-2xl shadow-inner whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">
                    ${text}
                </div>
            `;
        }
    } catch (error) {
        console.error("에러 발생:", error);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold text-center border border-red-100 rounded-lg'>연결 오류: ${error.message}<br><small>API 키의 모델 권한 설정을 확인해주세요.</small></p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
