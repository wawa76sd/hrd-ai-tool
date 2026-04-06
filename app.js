// 발급받으신 API 키 (AIzaSy...)
const API_KEY = "AIzaSyA91ZyP98rC21tQIaFIEK8zAVA4fMAWius"; 

window.generatePlan = async function() {
    const input = document.getElementById('youtubeInput').value;
    const btn = document.getElementById('btn');
    const resultSection = document.getElementById('resultSection');
    const resultContainer = document.getElementById('resultContainer');

    if (!input) {
        alert("분석할 정보를 입력해 주세요!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ 해커스 베테랑 설계자가 분석 중...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-blue-600 font-bold animate-pulse text-lg'>해커스 교육그룹 기준에 맞춰 최적의 모델로 연결 중입니다...</p>";

    try {
        // ✅ [해결책] v1beta 주소 + gemini-1.5-flash-latest 모델명을 사용합니다.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `당신은 해커스 교육그룹의 베테랑 교수설계자입니다. 
                        다음 정보를 분석하여 반드시 아래의 [출력 양식]에 맞춰서만 답변하세요.
                        설명이나 인사말은 생략하고 본문만 출력합니다.

                        [분석 정보]: ${input}

                        [출력 양식]:
                        ■ 강의 대주제: (강의 분야 예시: '데이터 엔지니어링'처럼 큰 주제의 명사구로 작성)
                        ■ 강의 분야: (구체적인 강의 주제 작성, 예시: 'AI 모델 성능 극대화를 위한 데이터 파이프라인 구축 및 관리')
                        ■ 제작 내용:
                        - 강의 세부 내용 1: (예시: 대용량 데이터의 수집, 저장, 가공 프로세스 자동화 시스템 설계)
                        - 강의 세부 내용 2: (예시: 고성능 검색을 위한 벡터 데이터베이스(Vector DB) 구축 및 최적화)
                        - 강의 세부 내용 3: (예시: 실시간 데이터 스트리밍 처리와 AI 학습용 데이터셋 관리 기법)`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            // 상세 에러 내용을 팝업으로 띄워 확인합니다.
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            resultContainer.innerHTML = `
                <div class="bg-white border-2 border-blue-100 p-8 rounded-2xl shadow-sm whitespace-pre-wrap leading-relaxed text-gray-800 text-lg font-medium">
                    ${text}
                </div>
            `;
        }
    } catch (error) {
        console.error("에러 발생:", error);
        alert("🚨 구글 서버 응답: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold text-center border border-red-100 rounded-lg'>오류: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
