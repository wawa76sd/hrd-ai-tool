const API_KEY = "AIzaSyA91ZyP98rC21tQIaFIEK8zAVA4fMAWius"; 

// 함수를 window 객체에 등록하여 HTML의 onclick과 확실히 연결합니다.
window.generatePlan = async function() {
    console.log("교수설계 시작!"); // 디버깅용

    const input = document.getElementById('youtubeInput').value;
    const btn = document.getElementById('btn');
    const resultSection = document.getElementById('resultSection');
    const resultContainer = document.getElementById('resultContainer');

    if (!input) {
        alert("분석할 정보를 입력해 주세요!");
        return;
    }

    // 로딩 상태 전환
    btn.disabled = true;
    btn.innerText = "⏳ 베테랑 교수설계자가 분석 중...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-blue-600 font-bold animate-pulse text-lg'>해커스 교육그룹의 기준에 맞춰 강의안을 설계하고 있습니다...</p>";

    try {
        // 가장 안정적인 v1 표준 주소와 모델명입니다.
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
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
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            
            // 해커스 스타일의 깔끔한 결과 출력
            resultContainer.innerHTML = `
                <div class="bg-white border-2 border-blue-100 p-8 rounded-2xl shadow-sm whitespace-pre-wrap leading-relaxed text-gray-800 text-lg font-medium">
                    ${text}
                </div>
            `;
        }

    } catch (error) {
        console.error("설계 오류:", error);
        alert("🚨 시스템 오류: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold text-center border border-red-100 rounded-lg'>오류가 발생했습니다: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};